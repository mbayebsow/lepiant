from datetime import datetime
import schedule
import time
import asyncio
import threading
import logging
import cronitor
from agents.article import articles_job
from agents.press_review import press_review_job
from agents.newspaper import newspaper_job

from common.config import Config

logger = logging.getLogger(__name__)
cronitor.api_key = Config.CRONITOR_API_KEY
monitor = cronitor.Monitor('lepiant-bot')

def heartbeat():
    monitor.ping(message="Alive!")
    logger.info(f"Alive! | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

def run(job_func):
    job_thread = threading.Thread(target=asyncio.run, args=(job_func(),))
    job_thread.start()


schedule.every(30).seconds.do(heartbeat).tag('heartbeat')
schedule.every(30).minutes.do(run, articles_job).tag('articles-job')
schedule.every().day.at('07:00', "Africa/Dakar").do(run, press_review_job).tag('press-review-job')
schedule.every().day.at('07:00', "Africa/Dakar").do(run, newspaper_job).tag('newspaper-job')

while True:
    schedule.run_pending()
    time.sleep(1)



