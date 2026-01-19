from app.models.doctor_model import Doctor

def get_all_doctors():
    """Get all doctors from database"""
    try:
        doctors = Doctor.objects()
        doctors_list = []
        
        for doctor in doctors:
            doctors_list.append({
                "id": doctor.doctor_id,
                "name": doctor.name,
                "specialty": doctor.specialty,
                "img": doctor.img,
                "experience": doctor.experience,
                "rating": doctor.rating,
                "consultation_fee": doctor.consultation_fee,
                "availability": doctor.availability,
                "qualifications": doctor.qualifications,
                "about": doctor.about
            })
        
        return {"doctors": doctors_list, "count": len(doctors_list)}, 200
    except Exception as e:
        return {"message": f"Error fetching doctors: {str(e)}"}, 500

def get_doctor_by_id(doctor_id):
    """Get a specific doctor by ID"""
    try:
        doctor = Doctor.objects(doctor_id=doctor_id).first()
        
        if not doctor:
            return {"message": "Doctor not found"}, 404
        
        return {
            "id": doctor.doctor_id,
            "name": doctor.name,
            "specialty": doctor.specialty,
            "img": doctor.img,
            "experience": doctor.experience,
            "rating": doctor.rating,
            "consultation_fee": doctor.consultation_fee,
            "availability": doctor.availability,
            "qualifications": doctor.qualifications,
            "about": doctor.about
        }, 200
    except Exception as e:
        return {"message": f"Error fetching doctor: {str(e)}"}, 500

def get_doctors_by_specialty(specialty):
    """Get doctors filtered by specialty"""
    try:
        doctors = Doctor.objects(specialty=specialty)
        doctors_list = []
        
        for doctor in doctors:
            doctors_list.append({
                "id": doctor.doctor_id,
                "name": doctor.name,
                "specialty": doctor.specialty,
                "img": doctor.img,
                "experience": doctor.experience,
                "rating": doctor.rating,
                "consultation_fee": doctor.consultation_fee
            })
        
        return {"doctors": doctors_list, "count": len(doctors_list)}, 200
    except Exception as e:
        return {"message": f"Error fetching doctors: {str(e)}"}, 500

def get_specialties():
    """Get all unique specialties"""
    try:
        doctors = Doctor.objects()
        specialties = list(set([doctor.specialty for doctor in doctors]))
        return {"specialties": sorted(specialties)}, 200
    except Exception as e:
        return {"message": f"Error fetching specialties: {str(e)}"}, 500
