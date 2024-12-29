import asyncio
import time
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import logging
import os
import sys
import redis
import hashlib
from rich.console import Console
from rich.logging import RichHandler
import cronitor
from rich.table import Table
from datetime import timedelta

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import common.models as models
from common.database import engine, SessionLocal
from common.config import Config
from utils.webpage_parser import get_html

console = Console()
log_name = datetime.now()
log_path = f'logs/articles-job/{log_name}.log'

if not os.path.exists(os.path.dirname(log_path)):
    os.makedirs(os.path.dirname(log_path))

logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    datefmt="[%X]",
    handlers=[
        RichHandler(rich_tracebacks=True, console=console),
        logging.FileHandler(log_path)
    ]
)
logger = logging.getLogger(__name__)


redis_client = redis.Redis(
        host=Config.REDIS_HOST or 'localhost',
        username=Config.REDIS_USERNAME or None,
        password=Config.REDIS_PASSWORD or None,
        port=int(Config.REDIS_PORT or 6379),
        ssl=True if Config.REDIS_SSL == "1" else False,
        db=0,
        decode_responses=True
    )

models.Base.metadata.create_all(bind=engine)
session = SessionLocal()

cronitor.api_key = Config.CRONITOR_API_KEY
monitor = cronitor.Monitor('articles-job')
STEP = None


def is_valid_url(url):
    parsed_url = urlparse(url)
    return all([parsed_url.scheme, parsed_url.netloc])


async def sleep(millis):
    time.sleep(millis / 1000)


async def get_article_image(url):
    try:
        html = get_html(url)
        if html:
            soup = BeautifulSoup(html, 'html.parser')
            # Chercher d'abord l'image og:image
            meta_tag = soup.find('meta', property='og:image')
            if meta_tag and meta_tag.get('content'):
                image_url = meta_tag.get('content')
                if is_valid_url(image_url):
                    return image_url, True
            
            # Si pas d'og:image, chercher la première image pertinente
            images = soup.find_all('img')
            for img in images:
                src = img.get('src', '')
                if src and is_valid_url(src) and not src.endswith(('.gif', '.svg')):
                    return src, True
                    
    except requests.exceptions.RequestException as e:
        logger.error(f"Erreur lors de la récupération de l'image pour {url}: {str(e)}")
    except Exception as e:
        logger.error(f"Erreur inattendue lors de la récupération de l'image pour {url}: {str(e)}")
        
    return "https://ik.imagekit.io/7whoa8vo6/lepiant/LEPIANT_Article_betterplaceholder_LxvtvPYyB?updatedAt=1710000626513", False


async def get_sources():
    try:
        logger.info(f"Recuperation des sources...")
        sources = session.query(models.Source).filter(models.Source.isActive == True).all()
        sources_list = [{'id': source.id, 'categorieId': source.categorieId, 'channelId': source.channelId, 'url': source.url, 'language': source.language} for source in sources]
        return sources_list
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des sources: {e}")
        return None


async def save_articles_to_db(articles):
    success_count = 0
    error_count = 0
    current_index = 0
    error_list = []

    logger.info(f"Enregistrement des articles dans la base de données...")

    for article in articles:
        current_index += 1
        hash_title = hashlib.md5(article['title'].encode()).hexdigest()
        try:
            if not article['image']:
                article['image'] = await get_article_image(article["link"])
                
            new_article = models.Article(
                categorieId=article['categorieId'],
                channelId=article['channelId'],
                title=article['title'],
                image=article['image'],
                description=article['description'],
                link=article['link'],
                published=article['published'], #datetime.fromisoformat(article['published']),
            )
            session.add(new_article)
            session.commit()
            success_count += 1
            redis_client.setex(f"processed_articles:{hash_title}", timedelta(days=3), 1)
            logger.info(f"Enregistrement de: [{current_index} / {len(articles)}] - SUCCESS - {article['link']}")
        except Exception as e:
            session.rollback()
            error_count += 1
            error_list.append({"article_title": article['title'],"article_link": article['link'], "error_message": str(e)})
            logger.error(f"Enregistrement de: [{current_index} / {len(articles)}] - ERROR - {article['link']}")
            if "duplicate key" in str(e):
                redis_client.setex(f"processed_articles:{hash_title}", timedelta(days=3), 1)
    
    session.close()
    saved_summary = {
        "total_article": len(articles),
        "total_saved": success_count,
        "total_error": error_count,
        "error_list": error_list,
    }
    logger.info(f"Enregistrement des articles terminé!")
    return saved_summary


async def process_articles(articles):
    global STEP
    # redis_client.flushall()

    total_article = len(articles)
    total_saved = 0
    total_error = 0
    total_skipped = 0
    current_article = 0
    error_list = []
    skipped_list = []
    all_articles = []

    logger.info("Recuperation des images articles")
    
    for article in articles:
        current_article += 1
        title = article['title']
        hash_title = hashlib.md5(title.encode()).hexdigest()

        exists = redis_client.exists(f"processed_articles:{hash_title}")

        if exists == 1:
            total_skipped += 1
            skipped_list.append({"article_title": article['title'],"article_link": article['link']})
            logger.info(f"Recuperation de: [{current_article} / {total_article}] - PASS - {article['link']}")

        if exists == 0:
            await sleep(200)
            article_image, is_origin_image = await get_article_image(article["link"])

            if is_origin_image:
                logger.info(f"Recuperation de: [{current_article} / {total_article}] - SUCCESS - {article['link']}")
                article["image"] = str(article_image)
                all_articles.append(article)
                total_saved += 1
            else:
                logger.error(f"Recuperation de: [{current_article} / {total_article}] - ERROR - {article['link']}")
                error_list.append({"article_title": article['title'],"article_link": article['link'], "error_message": "Image non trouvée"})
                total_error += 1

    process_summary = {
        "total_article": total_article,
        "total_saved": total_saved,
        "total_skipped": total_skipped,
        "total_error": total_error,
        # "skipped_list": skipped_list,
        "error_list": error_list,
    }

    return all_articles, process_summary


async def get_articles_from_sources(sources):
    logger.info(f"Recuperation des articles depuis les sources RSS...")

    articles = []
        
    for source in sources:
        logger.info(f"Traitement de la source: {source['url']}...")
        try:
            data = requests.get(f"https://parser-lepiant.deno.dev/?url={source['url']}").json()

            if data:
                for article in data.get('entries', []):
                    if article.get('title'):
                        articles.append({
                            "channelId": source['channelId'],
                            "categorieId": source['categorieId'],
                            "title": article['title'],
                            "link": article['link'],
                            "published": article['published'],
                            "description": article['description'],
                        })
        except Exception as e:
            logger.info(f"[red]Erreur lors du traitement de {source['url']}: {str(e)}")
            continue

    if len(articles) == 0:
        logger.info("Aucun nouvel article trouvé")
        return None

    return articles
        

async def articles_job():
    try:
        monitor.ping(state='run')   

        sources = await get_sources()

        if not sources:
            monitor.ping(state='fail', message='Aucune source n\'a été trouvée')
            return
            
        articles = await get_articles_from_sources(sources)
        
        if not articles:
            monitor.ping(state='fail', message='Aucun nouvel article trouvé')
            return

        processed_articles, processed_summary = await process_articles(articles)

        if len(processed_articles) == 0:
            logger.info("Aucun article n'a été traité")
            monitor.ping(state='fail', message='Aucun article n\'a été traité')
            return
                
        saved_summary = await save_articles_to_db(processed_articles)

        processed_summary_table = Table(title="Résumé du traitement")
        processed_summary_table.add_column("Champ", style="cyan", no_wrap=True)
        processed_summary_table.add_column("Valeur", style="magenta")
        processed_summary_table.add_row("Nombre total d'articles", str(processed_summary["total_article"]))
        processed_summary_table.add_row("Nombre total enregistrés", str(processed_summary["total_saved"]))
        processed_summary_table.add_row("Nombre total ignorés", str(processed_summary["total_skipped"]))
        processed_summary_table.add_row("Nombre total d'erreurs", str(processed_summary["total_error"]))

        saved_summary_table = Table(title="Résumé de l'enregistrement")
        saved_summary_table.add_column("Champ", style="cyan", no_wrap=True)
        saved_summary_table.add_column("Valeur", style="magenta")
        saved_summary_table.add_row("Nombre total d'articles", str(saved_summary["total_article"]))
        saved_summary_table.add_row("Nombre total enregistrés", str(saved_summary["total_saved"]))
        saved_summary_table.add_row("Nombre total d'erreurs", str(saved_summary["total_error"]))

        job_summary = {
            "processed_summary": processed_summary,
            "saved_summary": saved_summary,
        }

        logger.info(f"job_summary: {job_summary}")
        console.print(processed_summary_table)
        console.print(saved_summary_table)

        monitor.ping(state='complete', message=str(job_summary))

    except Exception as e:
        logger.error(f"[bold red]Erreur dans le job d'articles: {str(e)}")
        monitor.ping(state='fail', message=str(e))


if __name__ == "__main__":
    asyncio.run(articles_job())
