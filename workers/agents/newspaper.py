import os
import sys
from datetime import datetime
import time
import asyncio
import requests
from bs4 import BeautifulSoup
# from imagekitio import ImageKit
from rich.console import Console
import logging
from rich.logging import RichHandler
import cronitor
import re
import tempfile
from rich.table import Table

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.upload_to_cloudinary import upload_to_cloudinary
from utils.webpage_parser import get_html
from utils.webpage_parser import HTTPClientWithRetryAndRedirect
import common.models as models
from common.database import engine, SessionLocal
from common.models import Newspapers
from common.config import Config

console = Console()
log_name = datetime.now()
log_path = f'logs/newspaper-job/{log_name}.log'

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
http_client = HTTPClientWithRetryAndRedirect(
        max_retries=3,
        initial_delay=1.0,
        max_delay=5.0,
        backoff_factor=2.0
    )

logger = logging.getLogger(__name__)

NEWSPAPERS = []
TODAY = None
LASTPOSTDATE = None

cronitor.api_key = Config.CRONITOR_API_KEY
monitor = cronitor.Monitor('newspaper-job')

models.Base.metadata.create_all(bind=engine)
session = SessionLocal()

# imagekit = ImageKit(
#     private_key=Config.IMAGEKIT_PRIVATE_KEY,
#     public_key=Config.IMAGEKIT_PUBLIC_KEY,
#     url_endpoint = Config.IMAGEKIT_ENDPOINT
# )

def formatter_url(url):
  match = re.match(r"^(https?://i\d+\.wp\.com/cafeactu\.com/wp-content/uploads/\d{4}/\d{2}/[^?]+)\?", url)
  if match:
    return match.group(1)
  else:
    return None


def date_short_convert(date_iso):
    date = datetime.fromisoformat(date_iso.replace('Z', '+00:00'))
    return date.strftime('%Y-%m-%d')


def download_image(url, dossier_temp=None):

  try:
    response = requests.get(url, stream=True)
    response.raise_for_status()  # Lève une exception en cas d'erreur HTTP (4xx ou 5xx)

    # Créer un dossier temporaire si non spécifié
    if dossier_temp is None:
      dossier_temp = tempfile.mkdtemp()
    
    # Extraire le nom du fichier à partir de l'URL
    nom_fichier = os.path.basename(url)
    chemin_fichier = os.path.join(dossier_temp, nom_fichier)

    # Sauvegarder l'image dans le fichier
    with open(chemin_fichier, 'wb') as fichier:
      for chunk in response.iter_content(1024):
        fichier.write(chunk)

    return chemin_fichier

  except requests.exceptions.RequestException as e:
    print(f"Erreur lors du téléchargement de l'image : {e}")
    return None
  except Exception as e:
    print(f"Une erreur inattendue s'est produite : {e}")
    return None


async def saved_newspapers_to_db(newspapers):
    success_count = 0
    error_count = 0
    error_list = []

    logger.info(f"Enregistrement des quotidiens dans la base de données...")

    # added_newspapers = []
    for newspaper in newspapers:
        try:
            logger.info(f"Ajout du quotidien: {newspaper['images']}")

            new_newspaper = Newspapers(
                images=newspaper["images"],
                thumbnailUrl=newspaper["thumbnailUrl"],
                publishedAt=newspaper["publishedAt"]
            )
            session.add(new_newspaper)
            # added_newspapers.append(newspaper)
            session.commit()
            success_count += 1
        except Exception as error:
            error_count += 1
            error_list.append({"newspaper_title": newspaper["title"], "error_message": str(error)})
            raise error

    session.rollback()
    saved_summary = {
        "total_newspaper": len(newspapers),
        "total_saved": success_count,
        "total_error": error_count,
        "error_list": error_list,
    }
    return saved_summary


# async def get_html_code(url):
#     logger.info(f"Recuperation du code HTML depuis {url}")
#     try:
#         response = requests.get(url)
#         response.raise_for_status()
#         return response.text
#     except Exception as error:
#         logger.error(f"Erreur lors de l'obstention du code HTML {error}")
#         return None


async def extract_images_from_html(html_code):
    logger.info("Extraction des images du code HTML")
    urls = []
    # try:
    soup = BeautifulSoup(html_code, 'html.parser')
    
    for img in soup.select('figure.wp-block-image.size-large img'):
        if img.has_attr('src'):
            image_url = img.get('src')
            urls.append(image_url)

    if len(urls) == 0:
        logger.error(f"Pas d'images trouvées sur le code HTML")
        return None

    return urls


async def get_last_post():
    logger.info("Recuperation du dernier post")
    feed_url = "https://parser-lepiant.deno.dev/?url=https://cafeactu.com/category/une-des-journaux,une-des-journaux-internationaux/feed/"

    try:
        response = requests.get(feed_url)
        response.raise_for_status()
        data = response.json()
        return data["entries"][0] if data.get("entries") else None
    except Exception as error:
        logger.error(f"Erreur lors de l'obstention du dernier publication {error}")
        
        return None


async def newspaper_job():
    global TODAY, LASTPOSTDATE

    try:
        monitor.ping(state='run')
        TODAY = datetime.now().strftime('%Y-%m-%d')

        if datetime.now().weekday() == 6:  # Sunday
            logger.info('Pas de publication le dimanche')
            monitor.ping(state='complete', message='Pas de publication le dimanche')
            return

        last_post = await get_last_post()

        if not last_post:
            monitor.ping(state='complete', message='Aucun dernier post')
            return

        LASTPOSTDATE = date_short_convert(last_post["published"])

        if LASTPOSTDATE != TODAY:
            logger.info("Date du dernier post différente de la date d'aujourd'hui. Attente de 30 minutes...")
            time.sleep(1800) # Sleep for 30 minutes
            await newspaper_job()
        else:
            html_code = http_client.get_html(last_post["link"]) #await get_html_code(last_post["link"])
            if not html_code:
                monitor.ping(state='fail', message='Aucun dernier post')
                return

            images_extracted = await extract_images_from_html(html_code)
            if not images_extracted:
                monitor.ping(state='fail', message='Aucun dernier post')
                return

            collected_nesspapers_urls = []
            for url in images_extracted:
                filename = os.path.basename(url)
                if "ODIA" in filename:
                    continue

                url_formated = formatter_url(url)
                local_path = download_image(url_formated)

                if not local_path:
                    logger.error(f"Erreur lors du téléchargement de l'image {url}")
                    continue

                folder = f"{Config.NEWSPAPER_PATH}/{TODAY}"
                
                logger.info(f"Upload de l'image {local_path} -> {folder}")
                upload_result = await upload_to_cloudinary(local_path, folder)
                if not upload_result:
                    continue

                image_url = upload_result['secure_url']
                collected_nesspapers_urls.append({
                    "images": image_url,
                    "thumbnailUrl": image_url,
                    "publishedAt": LASTPOSTDATE
                })
                
                os.remove(local_path)

            if len(collected_nesspapers_urls) == 0:
                monitor.ping(state='complete', message='Aucun quotidien n\'a été enregistré')
                logger.error("Aucun quotidien n\'a été enregistré")
                return

            saved_summary = await saved_newspapers_to_db(collected_nesspapers_urls)
            monitor.ping(state='complete', message="Job terminé avec succès")

            logger.info(f"saved_summary: {saved_summary}")
    except Exception as e:
        logger.error(f"Erreur dans le job de journaux: {str(e)}[/]")
        monitor.ping(state='fail', message=str(e))

if __name__ == "__main__":
    asyncio.run(newspaper_job())
