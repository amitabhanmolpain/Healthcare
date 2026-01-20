from flask import Blueprint, jsonify
from flask_restful import Api, Resource
from app.models.doctor_model import Doctor

doctor_bp = Blueprint("doctors", __name__, url_prefix='/api')
api = Api(doctor_bp)

class DoctorList(Resource):
    def get(self):
        """Get all active doctors (for dashboard)"""
        try:
            # Only show active doctors to regular users
            doctors = Doctor.objects(is_active=True)
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
                    "about": doctor.about,
                    "is_active": doctor.is_active if hasattr(doctor, 'is_active') else True
                })
            
            return {"doctors": doctors_list, "count": len(doctors_list)}, 200
        except Exception as e:
            return {"message": f"Error fetching doctors: {str(e)}"}, 500

class AllDoctorsList(Resource):
    def get(self):
        """Get all doctors including inactive (for appointment booking)"""
        try:
            # Show all doctors with their availability status
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
                    "about": doctor.about,
                    "is_active": doctor.is_active if hasattr(doctor, 'is_active') else True
                })
            
            return {"doctors": doctors_list, "count": len(doctors_list)}, 200
        except Exception as e:
            return {"message": f"Error fetching doctors: {str(e)}"}, 500

class DashboardDoctorsList(Resource):
    def get(self):
        """Get limited active doctors for dashboard home (limit 4)"""
        try:
            # Only show active doctors, limit to 4
            doctors = Doctor.objects(is_active=True).limit(4)
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
                    "about": doctor.about,
                    "is_active": True
                })
            
            return {"doctors": doctors_list, "count": len(doctors_list)}, 200
        except Exception as e:
            return {"message": f"Error fetching doctors: {str(e)}"}, 500

class DoctorDetail(Resource):
    def get(self, doctor_id):
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

class DoctorsBySpecialty(Resource):
    def get(self, specialty):
        """Get doctors by specialty"""
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

api.add_resource(DoctorList, "/doctors")
api.add_resource(AllDoctorsList, "/doctors/all")
api.add_resource(DashboardDoctorsList, "/doctors/dashboard")
api.add_resource(DoctorDetail, "/doctors/<string:doctor_id>")
api.add_resource(DoctorsBySpecialty, "/doctors/specialty/<string:specialty>")
