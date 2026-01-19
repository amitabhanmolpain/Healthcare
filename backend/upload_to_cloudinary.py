"""
Upload doctor images to Cloudinary
This script uploads local doctor images to Cloudinary and returns the Cloudinary URLs
"""

import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Get the project root directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_ASSETS = os.path.join(BASE_DIR, "..", "Healthcare", "src", "assets")

# Doctor images - Map to local files
doctors_images = [
    {
        "public_id": "doctor-1",
        "name": "Dr. Sarah Johnson",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor3.png")
    },
    {
        "public_id": "doctor-2",
        "name": "Dr. Micheal Lee",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor2.png")
    },
    {
        "public_id": "doctor-3",
        "name": "Dr. James Patel",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor1.jpg")
    },
    {
        "public_id": "doctor-4",
        "name": "Dr. Sophia Patel",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor4.png")
    },
    {
        "public_id": "doctor-5",
        "name": "Dr. Ethan Reynolds",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor5.png")
    },
    {
        "public_id": "doctor-6",
        "name": "Dr. Olivia Kim",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor6.png")
    },
    {
        "public_id": "doctor-7",
        "name": "Dr. Ava Thompson",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor7.png")
    },
    {
        "public_id": "doctor-8",
        "name": "Dr. Mason Gupta",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor8.png")
    },
    {
        "public_id": "doctor-9",
        "name": "Dr. James Nguyen",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor9.png")
    },
    {
        "public_id": "doctor-10",
        "name": "Dr. Benjamin Carter",
        "local_path": os.path.join(FRONTEND_ASSETS, "doctor10.webp")
    }
]

def upload_images():
    """Upload local images to Cloudinary"""
    cloudinary_urls = {}
    
    print("Starting upload to Cloudinary...\n")
    print(f"Frontend Assets Path: {FRONTEND_ASSETS}\n")
    
    for doctor in doctors_images:
        try:
            # Check if file exists
            if not os.path.exists(doctor['local_path']):
                print(f"⚠️  File not found: {doctor['local_path']}")
                continue
            
            print(f"Uploading {doctor['name']} from {os.path.basename(doctor['local_path'])}...")
            
            # Upload image to Cloudinary
            result = cloudinary.uploader.upload(
                doctor['local_path'],
                public_id=f"healthcare/doctors/{doctor['public_id']}",
                folder="healthcare/doctors",
                overwrite=True,
                resource_type="image"
            )
            
            cloudinary_urls[doctor['public_id']] = result['secure_url']
            print(f"✅ Uploaded: {result['secure_url']}\n")
            
        except Exception as e:
            print(f"❌ Error uploading {doctor['name']}: {str(e)}\n")
    
    print("\n" + "="*80)
    print("CLOUDINARY URLS - Copy these to seed.py:")
    print("="*80)
    for key, url in cloudinary_urls.items():
        print(f'"{key}": "{url}",')
    
    return cloudinary_urls

if __name__ == "__main__":
    # Check if Cloudinary credentials are set
    if not all([
        os.getenv("CLOUDINARY_CLOUD_NAME"),
        os.getenv("CLOUDINARY_API_KEY"),
        os.getenv("CLOUDINARY_API_SECRET")
    ]):
        print("❌ Error: Cloudinary credentials not found in .env file")
        print("\nPlease add the following to your backend/.env file:")
        print("CLOUDINARY_CLOUD_NAME=your_cloud_name")
        print("CLOUDINARY_API_KEY=your_api_key")
        print("CLOUDINARY_API_SECRET=your_api_secret")
        print("\nGet your credentials from: https://cloudinary.com/console")
    else:
        upload_images()
