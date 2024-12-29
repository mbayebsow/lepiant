from googleapiclient.discovery import build
from datetime import datetime
from rich.console import Console
import time
import sys
import os
import asyncio
import yt_dlp
import speech_recognition as sr
from pydub import AudioSegment
import cronitor
import logging
from rich.logging import RichHandler

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import common.models as models
from common.database import engine, SessionLocal
from common.config import Config
from common.models import PressReviews
from utils.upload_to_cloudinary import upload_to_cloudinary

console = Console()
PLAYLIST_ID = "PLxXoQr_OKWwtgEI3qsuD0RVGYxtCbzi8o"
SEGMENT_DURATION = 10000

cronitor.api_key = Config.CRONITOR_API_KEY
monitor = cronitor.Monitor('press-review-job')

models.Base.metadata.create_all(bind=engine)
session = SessionLocal()

# Configure logging with Rich
log_name = datetime.now()
log_path = f'logs/press-review-job/{log_name}.log'

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

def add_press_review_to_db(audio_file_path, name, published_at):
    try:
        logger.info("Création de la revue de presse dans la base de données en cours...")
        
        if not audio_file_path:
            raise Exception("Échec de l'upload de l'audio sur Cloudinary")
            
        # Créer l'objet revue de presse
        press_review = PressReviews(
            audio=audio_file_path,
            name=name,
            publishedAt=published_at,
            createdAt=datetime.now()
        )
        
        # Ajouter et commit dans la base de données
        session.add(press_review)
        session.commit()
        session.refresh(press_review)
        logger.info(f"La revue de presse '{name}' a été créée avec succès!")
    except Exception as e:
        session.rollback()
        logger.info(f"Erreur lors de la création de la revue de presse: {str(e)}")
        raise e
    finally:
        session.close()


def get_language_duration(audio, segment_duration=SEGMENT_DURATION):

    try:
        logger.info("Détection des changements de langue...")

        # Initialize the recognizer
        recognizer = sr.Recognizer()

        # Initialisation des variables
        duration = len(audio)
        current_segment_start = 0
        consecutive_fr = 0 
        fr_duration = 0

        while current_segment_start < duration:
            # Extraire le segment
            end_time = min(current_segment_start + segment_duration, duration)
            segment = audio[current_segment_start:end_time]

            # Sauvegarder temporairement le segment
            segment.export("temp_segment.wav", format="wav")

            with sr.AudioFile("temp_segment.wav") as source:
                audio_listened = recognizer.record(source)
                try:
                    # Essayer les deux langues et comparer les résultats
                    wo_detected = False
                    fr_detected = False

                    try:
                        text_wo = recognizer.recognize_google(audio_listened, language="wo")
                        wo_detected = True
                    except sr.UnknownValueError:
                        text_wo = ""

                    try:
                        text_fr = recognizer.recognize_google(audio_listened, language="fr-FR")
                        fr_detected = True
                    except sr.UnknownValueError:
                        text_fr = ""

                    # Analyse basée sur la détection réussie et la longueur du texte
                    if fr_detected and len(text_fr.split()) >= 3:  # Au moins 3 mots en français
                        consecutive_fr += 1
                        if consecutive_fr >= 2:
                            fr_duration += segment_duration
                            logger.info(f"Segment à {current_segment_start/1000}s détecté en français")
                        else:
                            # Considéré comme du wolof avec des mots français
                            fr_duration = 0
                            logger.info(f"Segment à {current_segment_start/1000}s considéré comme du wolof")
                    else:
                        consecutive_fr = 0
                        if wo_detected or not fr_detected:
                            fr_duration = 0
                            logger.info(f"Segment à {current_segment_start/1000}s détecté en wolof")
                        else:
                            fr_duration = 0
                            logger.info(f"Segment à {current_segment_start/1000}s incertain, gardé en wolof")

                except Exception as e:
                    logger.info(f"Erreur lors de la reconnaissance: {str(e)}")
                    fr_duration = 0

            current_segment_start += segment_duration

            # Nettoyer le fichier temporaire
            if os.path.exists("temp_segment.wav"):
                os.remove("temp_segment.wav")

        logger.info("Analyse de l'audio terminée!")
        wo_duration = duration - fr_duration
        return fr_duration, wo_duration

    except Exception as e:
        logger.info(f"Erreur lors de la détection des langues: {str(e)}")
        return None


def split_audio(input_file, output_prefix, fr_duration, wo_duration):

    try:
        logger.info("Séparation de l'audio en cours...")

        # Charger l'audio complet
        audio = AudioSegment.from_mp3(input_file)

        # Supprimer les fichiers existants s'ils existent
        for lang in ['wo', 'fr']:
            output_file = f"{output_prefix}_{lang}_part.mp3"
            if os.path.exists(output_file):
                os.remove(output_file)

        # Initialiser les segments pour chaque langue
        wolof_segments = AudioSegment.empty()
        french_segments = AudioSegment.empty()

        wolof_segments += audio[:wo_duration]
        french_segments += audio[fr_duration:]

        logger.info("Retrait des 5 derniers secondes de wolof")
        last_5s_wolof = audio[wo_duration-SEGMENT_DURATION:wo_duration]

        logger.info("Détecter les changements de langue des 5 derniers secondes")
        wo_d, fr_d = get_language_duration(last_5s_wolof, segment_duration=int(SEGMENT_DURATION/2))

        logger.info("Mise à jour des durations")
        real_wo_duration = wo_duration - wo_d
        real_fr_duration = fr_duration + fr_d

        wolof_segments = audio[:real_wo_duration]
        french_segments = audio[real_wo_duration:]

        wo_path = f"{output_prefix}_wo_part.mp3"
        fr_path = f"{output_prefix}_fr_part.mp3"

        if len(wolof_segments) > 0:
            wolof_segments = wolof_segments.fade_in(500).fade_out(300)
            wolof_segments.export(wo_path, format="mp3")
            logger.info(f"Partie wolof sauvegardée ({len(wolof_segments)/1000:.2f} secondes)")

        if len(french_segments) > 0:
            french_segments = french_segments.fade_in(500).fade_out(300)
            french_segments.export(fr_path, format="mp3")
            logger.info(f"Partie francaise sauvegardée ({len(french_segments)/1000:.2f} secondes)")

        logger.info("Séparation audio terminée avec succès!")
        return wo_path, fr_path

    except Exception as e:
        logger.info(f"Erreur lors de la séparation de l'audio: {str(e)}")
        return None


def download_mp3(url, output_path="downloads",target_date=datetime.now().strftime('%Y-%m-%d')):
    try:
        logger.info("Téléchargement de l'audio en cours...")

        # Créer le dossier de sortie s'il n'existe pas
        if not os.path.exists(output_path):
            os.makedirs(output_path)

        output_file = f'{output_path}/pr_{target_date}'

        ydl_opts = {
            'format': 'worstaudio/worst',
            'extract_audio': True,
            'audio_format': 'mp3',
            'outtmpl': f'{output_file}.%(ext)s',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '96',
            }],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        logger.info("Téléchargement terminé!")
        return output_file

    except Exception as e:
        logger.info(f"Erreur lors du download de l'audio: {str(e)}")
        return None


def search_press_review(target_date, max_results=1):
    try:
        logger.info("Recherche de revue de presse en cours...")
        # Convertir la date cible en format ISO 8601
        if isinstance(target_date, str):
            # Nettoyer la chaîne de date en supprimant les espaces superflus
            target_date = target_date.strip()
            try:
                target_date = datetime.strptime(target_date, "%Y-%m-%d")
            except ValueError as e:
                logger.info(f"Format de date invalide. Utilisez le format YYYY-MM-DD (ex: 2024-12-07)")
                return []

        # Calculer la période de recherche (début et fin de la journée)
        start_date = target_date.replace(hour=0, minute=0, second=0).isoformat() + "Z"
        end_date = target_date.replace(hour=23, minute=59, second=59).isoformat() + "Z"

        # Création du service YouTube
        youtube = build('youtube', 'v3', developerKey=Config.GOOGLE_API_KEY)

        # Récupérer les vidéos de la playlist
        playlist_items = []
        next_page_token = None

        while True:
            # Paramètres pour récupérer les éléments de la playlist
            playlist_params = {
                'playlistId': PLAYLIST_ID,
                'part': 'snippet',
                'maxResults': 50,  # Maximum permis par l'API
                'pageToken': next_page_token
            }

            playlist_response = youtube.playlistItems().list(**playlist_params).execute()

            # Filtrer les vidéos par date
            for item in playlist_response.get('items', []):

                # Vérifier si la vidéo est dans la plage de dates
                if start_date <= item['snippet']['publishedAt'] <= end_date:
                    playlist_items.append(item)

                    if len(playlist_items) >= max_results:
                        break

            next_page_token = playlist_response.get('nextPageToken')
            if not next_page_token or len(playlist_items) >= max_results:
                break

        # Traiter les résultats
        videos = []
        for item in playlist_items[:max_results]:
            snippet = item['snippet']
            video_id = snippet['resourceId']['videoId']

            # Ajouter aux résultats
            videos.append({
                'title': snippet['title'],
                'video_id': video_id,
                'published_at': snippet['publishedAt'],
                'channel_title': snippet['channelTitle'],
                'description': snippet['description'],
                'thumbnail_url': snippet['thumbnails']['default']['url'],
                'video_url': f"https://www.youtube.com/watch?v={video_id}",
            })

        logger.info(f"Recherche de revue de presse terminée! resultat:{len(videos)}")
        return videos, False

    except Exception as e:
        logger.info(f"Erreur lors de la recherche YouTube: {str(e)}")
        return [], True


def delete_file(file_path):
    try:
        logger.info(f"Suppression du fichier '{file_path}' en cours...")
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Fichier '{file_path}' supprimé!")
        else:
            logger.info(f"Le fichier '{file_path}' n'existe pas.")
    except Exception as e:
        logger.info(f"Erreur lors de la suppression du fichier: {str(e)}")

async def press_review_job():
    while True:
        try: 
            monitor.ping(state='run')
            target_date = datetime.now()
            current_date = datetime.now().strftime('%Y-%m-%d')
            results, error = search_press_review(target_date)

            if error:
                monitor.ping(state='fail', message='Une erreur s\'est produite lors de la recherche de la revue de presse')
                return

            if len(results) == 0:
                logger.info("Aucun resultat trouvé. Nouvelle tentative dans 30 minutes...")
                monitor.ping(state='complete', message='Aucun resultat trouvé. Nouvelle tentative dans 30 minutes...')
                # await asyncio.sleep(1800)
                time.sleep(1800) # Sleep for 30 minutes
                await press_review_job()
                # continue

            video_url = results[0]['video_url']
            output_file = download_mp3(video_url, 'temps_audio', current_date)

            if not output_file:
                monitor.ping(state='fail', message='Une erreur s\'est produite lors du téléchargement de l\'audio')
                # sys.exit(1)
                return

            audio_file = f"{output_file}.mp3"
            audio = AudioSegment.from_mp3(audio_file)
            wo_duration, fr_duration = get_language_duration(audio)

            if not wo_duration or not fr_duration:
                monitor.ping(state='fail', message='Aucun changement de langue détecté')
                delete_file(audio_file)
                # sys.exit(1)
                return
            
            wo_path, fr_path = split_audio(audio_file, output_file, fr_duration, wo_duration)

            if not wo_path or not fr_path:
                monitor.ping(state='fail', message='Echec lors de la séparation de l\'audio')
                delete_file(audio_file)
                # sys.exit(1)
                return

            logger.info(f"Upload des fichiers WO et FR en cours...")
            folder = f"{Config.PRESS_REVIEW_PATH}/{current_date}"
            wo_result = await upload_to_cloudinary(wo_path, folder)
            fr_result = await upload_to_cloudinary(fr_path, folder)
            logger.info(f"Upload des fichiers WO et FR terminé!")

            logger.info(f"Suppression des fichiers temporaires...")
            delete_file(audio_file)
            delete_file(wo_path)
            delete_file(fr_path)

            if not wo_result or not fr_result:
                logger.info("Echec lors de l'upload de l'audio")
                monitor.ping(state='fail', message='Echec lors de l\'upload des audios')
                # sys.exit(1)
                return

            wo_audio_url = wo_result['secure_url']
            fr_audio_url = fr_result['secure_url']

            try:
                add_press_review_to_db(wo_audio_url, f"Revue de presse WO | du {current_date}", current_date)
                add_press_review_to_db(fr_audio_url, f"Revue de presse FR | du {current_date}", current_date)
            except Exception as e:
                logger.info(f"Erreur lors de la création de la revue de presse: {str(e)}")
                monitor.ping(state='fail', message=f"Erreur lors de la création de la revue de presse: {str(e)}")
                # sys.exit(1)
                return

            logger.info("Press review job terminée!")
            # sys.exit(0)
            monitor.ping(state='complete', message='Press review job terminée!')
            break

        except Exception as e:
            logger.info(f"Une erreur s'est produite: {str(e)}")
            monitor.ping(state='fail', message=str(e))
            await asyncio.sleep(1800)  # 30 minutes = 1800 seconds

if __name__ == "__main__":
    asyncio.run(press_review_job())
