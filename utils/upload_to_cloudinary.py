from datetime import datetime
import sys
import os
import cloudinary
import cloudinary.uploader

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common.config import Config


cloudinary.config( 
    cloud_name = Config.CLOUDINARY_NAME,
    api_key = Config.CLOUDINARY_API_KEY, 
    api_secret = Config.CLOUDINARY_API_SECRET
)

async def upload_to_cloudinary(file_path, folder):

    try:
        result = cloudinary.uploader.upload(
            file_path,
            resource_type="auto",  # Permet de détecter automatiquement le type de fichier
            folder=folder,    # Spécifie le dossier de destination
            use_filename=True,     # Utilise le nom de fichier original
            unique_filename=True   # Ajoute un identifiant unique pour éviter les doublons
        )
        return result
        
    except Exception as e:
        print(f"Erreur lors de l'upload : {str(e)}")
        return None
