# Backend Database Seeding Guide

## Overview
This guide explains how to populate the backend database with all the doctors from the frontend.

## What's Been Created

### 1. Doctor Model
**File:** `backend/app/models/doctor_model.py`

The Doctor model includes:
- `doctor_id`: Unique identifier matching frontend
- `name`: Doctor's full name
- `specialty`: Medical specialty
- `img`: Image path/URL
- `experience`: Years of experience
- `rating`: Doctor rating (out of 5)
- `consultation_fee`: Consultation fee
- `availability`: List of available days
- `qualifications`: List of medical qualifications
- `about`: Description/bio

### 2. Seed Script
**File:** `backend/seed.py`

Contains all 12 doctors from the frontend:
- Dr. Sarah Johnson - Cardiologist
- Dr. Micheal Lee - Neurologist
- Dr. James Patel - Pediatrician
- Dr. Sophia Patel - Neurologist
- Dr. Ethan Reynolds - Cardiologist
- Dr. Olivia Kim - Pulmonologist
- Dr. Ava Thompson - Pediatrician
- Dr. Mason Gupta - Orthopedic Surgeon
- Dr. James Nguyen - Psychiatrist
- Dr. Benjamin Carter - Gastroenterologist
- Dr. Charlotte Lee - Ophthalmologist
- Dr. Noah Martinez - Obstetrician & Gynecologist

### 3. Doctor API Routes
**File:** `backend/app/routes/doctor_routes.py`

API Endpoints:
- `GET /doctors` - Get all doctors
- `GET /doctors/<doctor_id>` - Get specific doctor by ID
- `GET /doctors/specialty/<specialty>` - Get doctors by specialty

### 4. Doctor Controller
**File:** `backend/app/controllers/doctor_controller.py`

Contains business logic for:
- Fetching all doctors
- Fetching doctor by ID
- Filtering doctors by specialty
- Getting all unique specialties

### 5. Frontend API Integration
**File:** `Healthcare/src/services/api.js`

Added doctorAPI with methods:
- `getAllDoctors()` - Fetch all doctors from backend
- `getDoctorById(doctorId)` - Fetch specific doctor
- `getDoctorsBySpecialty(specialty)` - Filter by specialty

## How to Use

### Step 1: Install Dependencies (if not already installed)
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Ensure MongoDB is Running
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or check if it's already running
mongo --eval "db.version()"
```

### Step 3: Configure Environment Variables
Ensure your `.env` file in the backend folder has:
```env
JWT_SECRET_KEY=your-secret-key-here
MONGO_URI=mongodb://localhost:27017/health_care
```

### Step 4: Run the Seed Script
```bash
cd backend
python seed.py
```

You should see output like:
```
Starting to seed doctors...
Cleared existing doctors
Added: Dr. Sarah Johnson - Cardiologist
Added: Dr. Micheal Lee - Neurologist
...
Successfully seeded 12 doctors!

--- Doctors Summary ---
Cardiologist: 2 doctor(s)
Neurologist: 2 doctor(s)
Pediatrician: 2 doctor(s)
...
```

### Step 5: Start the Backend Server
```bash
python run.py
```

### Step 6: Test the API
You can test the endpoints using:

**Get all doctors:**
```bash
curl http://localhost:5000/doctors
```

**Get specific doctor:**
```bash
curl http://localhost:5000/doctors/doctor-1
```

**Get doctors by specialty:**
```bash
curl http://localhost:5000/doctors/specialty/Cardiologist
```

## Frontend Integration

To use the doctors from the database in your frontend:

```javascript
import { doctorAPI } from './services/api';

// Fetch all doctors
const { doctors } = await doctorAPI.getAllDoctors();

// Fetch specific doctor
const doctor = await doctorAPI.getDoctorById('doctor-1');

// Fetch by specialty
const { doctors } = await doctorAPI.getDoctorsBySpecialty('Cardiologist');
```

## Database Structure

The doctors are stored in MongoDB with the following structure:

```json
{
  "doctor_id": "doctor-1",
  "name": "Dr. Sarah Johnson",
  "specialty": "Cardiologist",
  "img": "/assets/doctors/doctor3.jpg",
  "experience": 12,
  "rating": 4.8,
  "consultation_fee": 800,
  "availability": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "qualifications": ["MBBS", "MD - Cardiology", "FACC"],
  "about": "Specialized in cardiovascular diseases..."
}
```

## Re-seeding the Database

To clear and re-seed the database at any time:
```bash
cd backend
python seed.py
```

This will:
1. Delete all existing doctors
2. Add all 12 doctors from the seed data
3. Display a summary of what was added

## Troubleshooting

### MongoDB Connection Error
If you get a connection error:
- Ensure MongoDB is running
- Check your MONGO_URI in the .env file
- Verify MongoDB is accessible on the specified port

### Import Errors
If you get import errors:
- Make sure you're in the backend directory
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check that the Flask app is properly initialized

### Doctor Not Found
If doctors aren't appearing:
- Run the seed script: `python seed.py`
- Check MongoDB to verify data: `mongo health_care` then `db.doctors.find()`
- Ensure the backend server is running

## Next Steps

You can now:
1. Fetch doctors from the database instead of hardcoded frontend constants
2. Add more doctor-related endpoints (search, filter, etc.)
3. Create appointment booking functionality
4. Add doctor availability management
5. Implement doctor profile updates
