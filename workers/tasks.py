from redis import Redis
from rq import Queue
from .models import Article

q = Queue(connection=Redis(host='redis', port=6379))

def process_new_article(article_id: int):
    # Traitement asynchrone (ex: analyse NLP)
    article = Article.query.get(article_id)
    # ... traitement long ...
    article.is_processed = True
    db.session.commit()