from app import create_app
from app.models.doctor_model import Doctor
from app.models.medicine_model import Medicine
from mongoengine import connect
import os
from dotenv import load_dotenv

load_dotenv()

# Create Flask app context
app = create_app()

# Doctors data from frontend
doctors_data = [
    {
        "doctor_id": "doctor-1",
        "name": "Dr. Sarah Johnson",
        "specialty": "Cardiologist",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838693/healthcare/doctors/healthcare/doctors/doctor-1.png",
        "experience": 12,
        "rating": 4.8,
        "consultation_fee": 800,
        "qualifications": ["MBBS", "MD - Cardiology", "FACC"],
        "about": "Specialized in cardiovascular diseases with over 12 years of experience. Expert in interventional cardiology and cardiac rehabilitation."
    },
    {
        "doctor_id": "doctor-2",
        "name": "Dr. Micheal Lee",
        "specialty": "Neurologist",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838694/healthcare/doctors/healthcare/doctors/doctor-2.png",
        "experience": 15,
        "rating": 4.9,
        "consultation_fee": 900,
        "qualifications": ["MBBS", "MD - Neurology", "DM - Neurology"],
        "about": "Expert neurologist specializing in brain disorders, epilepsy, and stroke management. Board certified with extensive research background."
    },
    {
        "doctor_id": "doctor-3",
        "name": "Dr. James Patel",
        "specialty": "Pediatrician",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838695/healthcare/doctors/healthcare/doctors/doctor-3.png",
        "experience": 10,
        "rating": 4.7,
        "consultation_fee": 600,
        "qualifications": ["MBBS", "MD - Pediatrics"],
        "about": "Compassionate pediatrician dedicated to providing comprehensive care for children from infancy through adolescence."
    },
    {
        "doctor_id": "doctor-4",
        "name": "Dr. Sophia Patel",
        "specialty": "Neurologist",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838695/healthcare/doctors/healthcare/doctors/doctor-4.png",
        "experience": 8,
        "rating": 4.6,
        "consultation_fee": 850,
        "qualifications": ["MBBS", "MD - Neurology"],
        "about": "Specialized in treating neurological disorders including migraines, Parkinson's disease, and multiple sclerosis."
    },
    {
        "doctor_id": "doctor-5",
        "name": "Dr. Ethan Reynolds",
        "specialty": "Cardiologist",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838697/healthcare/doctors/healthcare/doctors/doctor-5.png",
        "experience": 14,
        "rating": 4.8,
        "consultation_fee": 850,
        "qualifications": ["MBBS", "MD - Cardiology", "FACC"],
        "about": "Senior cardiologist with expertise in preventive cardiology, heart failure management, and non-invasive cardiac imaging."
    },
    {
        "doctor_id": "doctor-6",
        "name": "Dr. Olivia Kim",
        "specialty": "Pulmonologist",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838697/healthcare/doctors/healthcare/doctors/doctor-6.png",
        "experience": 11,
        "rating": 4.7,
        "consultation_fee": 750,
        "qualifications": ["MBBS", "MD - Pulmonology", "FCCP"],
        "about": "Expert in respiratory diseases, asthma management, and critical care pulmonology with a focus on sleep disorders."
    },
    {
        "doctor_id": "doctor-7",
        "name": "Dr. Ava Thompson",
        "specialty": "Pediatrician",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838698/healthcare/doctors/healthcare/doctors/doctor-7.png",
        "experience": 9,
        "rating": 4.8,
        "consultation_fee": 650,
        "qualifications": ["MBBS", "MD - Pediatrics", "IAP"],
        "about": "Dedicated to child healthcare with special interest in developmental pediatrics and childhood nutrition."
    },
    {
        "doctor_id": "doctor-8",
        "name": "Dr. Mason Gupta",
        "specialty": "Orthopedic Surgeon",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838699/healthcare/doctors/healthcare/doctors/doctor-8.png",
        "experience": 16,
        "rating": 4.9,
        "consultation_fee": 1000,
        "qualifications": ["MBBS", "MS - Orthopedics", "MCh - Orthopedics"],
        "about": "Highly skilled orthopedic surgeon specializing in joint replacement, sports injuries, and arthroscopic surgery."
    },
    {
        "doctor_id": "doctor-9",
        "name": "Dr. James Nguyen",
        "specialty": "Psychiatrist",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838701/healthcare/doctors/healthcare/doctors/doctor-9.png",
        "experience": 13,
        "rating": 4.8,
        "consultation_fee": 900,
        "qualifications": ["MBBS", "MD - Psychiatry", "MRCPsych"],
        "about": "Compassionate psychiatrist specializing in mood disorders, anxiety, and cognitive behavioral therapy."
    },
    {
        "doctor_id": "doctor-10",
        "name": "Dr. Benjamin Carter",
        "specialty": "Gastroenterologist",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1768838703/healthcare/doctors/healthcare/doctors/doctor-10.webp",
        "experience": 12,
        "rating": 4.7,
        "consultation_fee": 800,
        "qualifications": ["MBBS", "MD - Gastroenterology", "DM - Gastroenterology"],
        "about": "Expert in digestive system disorders, liver diseases, and advanced endoscopic procedures."
    },
    {
        "doctor_id": "doctor-11",
        "name": "Dr. Charlotte Lee",
        "specialty": "Ophthalmologist",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1769338954/doctor11_emhjgz.webp",
        "experience": 10,
        "rating": 4.8,
        "consultation_fee": 700,
        "qualifications": ["MBBS", "MS - Ophthalmology", "FICO"],
        "about": "Specialized in cataract surgery, refractive surgery, and comprehensive eye care with state-of-the-art technology."
    },
    {
        "doctor_id": "doctor-12",
        "name": "Dr. Noah Martinez",
        "specialty": "Obstetrician & Gynecologist",
        "img": "https://res.cloudinary.com/dxnpcuppm/image/upload/v1769338954/doctor12_bkprwl.webp",
        "experience": 14,
        "rating": 4.9,
        "consultation_fee": 850,
        "qualifications": ["MBBS", "MS - OB/GYN", "FICOG"],
        "about": "Experienced OB/GYN providing comprehensive women's health care, pregnancy management, and minimally invasive gynecologic surgery."
    }
]

# Medicines data from frontend
medicines_data = [
    {
        "medicine_id": "med-1",
        "name": "Paracetamol 500mg",
        "category": "pain-relief",
        "price": 749,
        "description": "For fever and pain relief",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": True,
        "rating": 4.5,
        "reviews": 234
    },
    {
        "medicine_id": "med-2",
        "name": "Ibuprofen 400mg",
        "category": "pain-relief",
        "price": 1099,
        "description": "Anti-inflammatory and pain reliever",
        "image": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": True,
        "rating": 4.7,
        "reviews": 189
    },
    {
        "medicine_id": "med-3",
        "name": "Amoxicillin 500mg",
        "category": "antibiotics",
        "price": 1349,
        "description": "Antibiotic for bacterial infections",
        "image": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
        "requires_prescription": True,
        "in_stock": True,
        "rating": 4.6,
        "reviews": 156
    },
    {
        "medicine_id": "med-4",
        "name": "Vitamin D3 1000 IU",
        "category": "vitamins",
        "price": 1599,
        "description": "Bone health and immunity support",
        "image": "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": True,
        "rating": 4.8,
        "reviews": 412
    },
    {
        "medicine_id": "med-5",
        "name": "Multivitamin Complex",
        "category": "vitamins",
        "price": 2099,
        "description": "Complete daily vitamin supplement",
        "image": "https://images.unsplash.com/photo-1526434426615-1abe81efcb0b?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": True,
        "rating": 4.5,
        "reviews": 328
    },
    {
        "medicine_id": "med-6",
        "name": "Cold Relief Syrup",
        "category": "cold-flu",
        "price": 1249,
        "description": "Relief from cold and flu symptoms",
        "image": "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": True,
        "rating": 4.4,
        "reviews": 267
    },
    {
        "medicine_id": "med-7",
        "name": "Antihistamine Tablets",
        "category": "pain-relief",
        "price": 999,
        "description": "For allergy relief",
        "image": "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": True,
        "rating": 4.6,
        "reviews": 198
    },
    {
        "medicine_id": "med-8",
        "name": "Cough Suppressant",
        "category": "cold-flu",
        "price": 1149,
        "description": "Effective cough relief",
        "image": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": False,
        "rating": 4.3,
        "reviews": 145
    },
    {
        "medicine_id": "med-9",
        "name": "Omega-3 Fish Oil",
        "category": "vitamins",
        "price": 2499,
        "description": "Heart and brain health support",
        "image": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": True,
        "rating": 4.7,
        "reviews": 389
    },
    {
        "medicine_id": "med-10",
        "name": "Azithromycin 500mg",
        "category": "antibiotics",
        "price": 1949,
        "description": "Broad-spectrum antibiotic",
        "image": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=300&fit=crop",
        "requires_prescription": True,
        "in_stock": True,
        "rating": 4.5,
        "reviews": 142
    },
    {
        "medicine_id": "med-11",
        "name": "Vitamin C 1000mg",
        "category": "vitamins",
        "price": 1399,
        "description": "Immune system support",
        "image": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": True,
        "rating": 4.6,
        "reviews": 456
    },
    {
        "medicine_id": "med-12",
        "name": "Pain Relief Gel",
        "category": "pain-relief",
        "price": 1699,
        "description": "Topical pain relief",
        "image": "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop",
        "requires_prescription": False,
        "in_stock": True,
        "rating": 4.4,
        "reviews": 223
    }
]

def seed_doctors():
    """Seed the database with doctors data"""
    print("Starting to seed doctors...")
    
    # Clear existing doctors
    Doctor.objects.delete()
    print("Cleared existing doctors")
    
    # Add all doctors
    for doctor_data in doctors_data:
        doctor = Doctor(**doctor_data)
        doctor.save()
        print(f"Added: {doctor.name} - {doctor.specialty}")
    
    print(f"\nSuccessfully seeded {len(doctors_data)} doctors!")
    
    # Display summary
    print("\n--- Doctors Summary ---")
    for specialty in set(d['specialty'] for d in doctors_data):
        count = len([d for d in doctors_data if d['specialty'] == specialty])
        print(f"{specialty}: {count} doctor(s)")

def seed_medicines():
    """Seed the database with medicines data"""
    print("\nStarting to seed medicines...")
    
    # Clear existing medicines
    Medicine.objects.delete()
    print("Cleared existing medicines")
    
    # Add all medicines
    for medicine_data in medicines_data:
        medicine = Medicine(**medicine_data)
        medicine.save()
        print(f"Added: {medicine.name} - {medicine.category}")
    
    print(f"\nSuccessfully seeded {len(medicines_data)} medicines!")
    
    # Display summary
    print("\n--- Medicines Summary ---")
    for category in set(m['category'] for m in medicines_data):
        count = len([m for m in medicines_data if m['category'] == category])
        print(f"{category}: {count} medicine(s)")

if __name__ == "__main__":
    with app.app_context():
        seed_doctors()
        seed_medicines()
