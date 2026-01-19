# Appointments & Bookings System Documentation

## Overview
Complete appointment booking system with models, controllers, and REST API routes.

---

## Database Model

### Appointment Model
**File:** `backend/app/models/appointments_models.py`

**Fields:**
- `user` - Reference to User who booked the appointment
- `doctor` - Reference to Doctor for the appointment
- `appointment_date` - Date of appointment (DateTime)
- `appointment_time` - Time slot (e.g., "10:00 AM")
- `reason` - Reason for appointment (required)
- `status` - Appointment status: "pending", "confirmed", "cancelled", "completed"
- `notes` - Additional notes (optional)
- `consultation_type` - Type: "in-person", "video-call", "phone-call"
- `created_at` - When appointment was created
- `updated_at` - Last update timestamp

**Indexes:** user, doctor, appointment_date, status

---

## API Endpoints

### 1. Create Appointment
**POST** `/appointments`
- **Auth:** Required (JWT Token)
- **Request Body:**
```json
{
  "doctor_id": "doctor-1",
  "appointment_date": "2026-01-25",
  "appointment_time": "10:00 AM",
  "reason": "Regular checkup",
  "notes": "Experiencing mild headaches",
  "consultation_type": "in-person"
}
```
- **Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "appointment_id",
    "doctor": {
      "id": "doctor-1",
      "name": "Dr. Sarah Johnson",
      "specialty": "Cardiologist",
      "consultation_fee": 800
    },
    "appointment_date": "2026-01-25",
    "appointment_time": "10:00 AM",
    "reason": "Regular checkup",
    "status": "pending"
  }
}
```

### 2. Get My Appointments
**GET** `/appointments/my`
- **Auth:** Required
- **Query Params:** 
  - `status` (optional): Filter by status (pending, confirmed, cancelled, completed)
- **Example:** `/appointments/my?status=confirmed`
- **Response:**
```json
{
  "appointments": [...],
  "count": 5
}
```

### 3. Get Appointment Details
**GET** `/appointments/<appointment_id>`
- **Auth:** Required
- **Response:** Single appointment object

### 4. Update Appointment Status
**PATCH** `/appointments/<appointment_id>`
- **Auth:** Required
- **Request Body:**
```json
{
  "status": "confirmed"
}
```

### 5. Cancel Appointment
**DELETE** `/appointments/<appointment_id>`
- **Auth:** Required
- **Response:**
```json
{
  "message": "Appointment cancelled successfully"
}
```

### 6. Get Available Time Slots
**GET** `/appointments/available-slots/<doctor_id>?date=2026-01-25`
- **Auth:** Required
- **Response:**
```json
{
  "available": true,
  "date": "2026-01-25",
  "doctor": "Dr. Sarah Johnson",
  "slots": ["09:00 AM", "09:30 AM", "11:00 AM", ...],
  "total_slots": 12
}
```

### 7. Get Upcoming Appointments
**GET** `/appointments/upcoming?days=30`
- **Auth:** Required
- **Query Params:**
  - `days` (optional, default: 30): Number of days to look ahead
- **Response:**
```json
{
  "appointments": [...],
  "count": 3
}
```

---

## Business Logic (Controller)

### Key Features:

1. **Validation:**
   - Checks required fields (doctor, date, time, reason)
   - Validates date format (YYYY-MM-DD)
   - Prevents booking appointments in the past
   - Verifies doctor availability on selected day

2. **Conflict Prevention:**
   - Checks for existing appointments at the same time
   - Returns error if slot is already booked

3. **Time Slots:**
   - Default slots: 9:00 AM - 5:00 PM (30-minute intervals)
   - Filters out booked slots
   - Returns only available slots

4. **Authorization:**
   - Users can only view/modify their own appointments
   - JWT token required for all operations

5. **Status Management:**
   - Tracks appointment lifecycle: pending → confirmed → completed
   - Allows cancellation at any time

---

## Frontend Integration

### API Service
**File:** `Healthcare/src/services/api.js`

**Methods:**
```javascript
// Create appointment
await appointmentAPI.createAppointment({
  doctor_id: "doctor-1",
  appointment_date: "2026-01-25",
  appointment_time: "10:00 AM",
  reason: "Regular checkup",
  consultation_type: "in-person"
});

// Get my appointments
const { appointments } = await appointmentAPI.getMyAppointments();

// Filter by status
const confirmed = await appointmentAPI.getMyAppointments("confirmed");

// Get available slots
const { slots } = await appointmentAPI.getAvailableSlots("doctor-1", "2026-01-25");

// Cancel appointment
await appointmentAPI.cancelAppointment(appointmentId);

// Get upcoming appointments
const upcoming = await appointmentAPI.getUpcomingAppointments(7); // Next 7 days
```

---

## Usage Examples

### Example 1: Book Appointment
```python
# Backend Controller
response = create_appointment({
    "doctor_id": "doctor-1",
    "appointment_date": "2026-01-25",
    "appointment_time": "10:00 AM",
    "reason": "Regular checkup",
    "consultation_type": "in-person"
}, user_id="user_123")
```

### Example 2: Check Available Slots
```python
response = get_available_slots("doctor-1", "2026-01-25")
# Returns: ["09:00 AM", "09:30 AM", "11:00 AM", ...]
```

### Example 3: Get User's Appointments
```python
# All appointments
response = get_user_appointments(user_id="user_123")

# Only confirmed appointments
response = get_user_appointments(user_id="user_123", status="confirmed")
```

---

## Error Handling

**Common Errors:**

1. **400 Bad Request**
   - Missing required fields
   - Invalid date format
   - Past date selected
   - Invalid status value

2. **403 Forbidden**
   - User trying to access another user's appointment

3. **404 Not Found**
   - Doctor doesn't exist
   - Appointment doesn't exist

4. **409 Conflict**
   - Time slot already booked
   - Doctor not available on selected day

---

## Database Queries

**Indexes for Performance:**
- User ID (for fetching user appointments)
- Doctor ID (for checking availability)
- Appointment Date (for date-based queries)
- Status (for filtering by status)

**Common Queries:**
```python
# Get user's upcoming appointments
Appointment.objects(
    user=user,
    appointment_date__gte=today,
    status__in=["pending", "confirmed"]
).order_by('appointment_date')

# Get booked slots for a doctor on a date
Appointment.objects(
    doctor=doctor,
    appointment_date=date,
    status__in=["pending", "confirmed"]
)
```

---

## Testing the API

### Using cURL:

**1. Create Appointment:**
```bash
curl -X POST http://localhost:5000/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "doctor-1",
    "appointment_date": "2026-01-25",
    "appointment_time": "10:00 AM",
    "reason": "Regular checkup"
  }'
```

**2. Get My Appointments:**
```bash
curl http://localhost:5000/appointments/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**3. Get Available Slots:**
```bash
curl "http://localhost:5000/appointments/available-slots/doctor-1?date=2026-01-25" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**4. Cancel Appointment:**
```bash
curl -X DELETE http://localhost:5000/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Integration with Frontend Components

**AppointmentBooking.jsx** can now:
1. Fetch real doctors from backend
2. Check real-time availability
3. Create actual appointments in database
4. Show confirmation with appointment details

**MyAppointments.jsx** can now:
1. Display user's actual appointments
2. Filter by status (upcoming, past, cancelled)
3. Allow cancellation
4. Show appointment details

---

## Future Enhancements

1. **Email Notifications:** Send confirmation emails
2. **Reminders:** Automated appointment reminders
3. **Rescheduling:** Allow users to reschedule appointments
4. **Payment Integration:** Process consultation fees
5. **Video Call Integration:** Direct video consultation links
6. **Doctor Notes:** Allow doctors to add notes after appointments
7. **Prescription Management:** Link prescriptions to appointments
8. **Ratings & Reviews:** Allow patients to rate doctors after appointments

---

## Security Features

1. **JWT Authentication:** All endpoints require valid JWT token
2. **Authorization:** Users can only access their own appointments
3. **Data Validation:** Strict validation on all inputs
4. **SQL Injection Protection:** MongoEngine handles query sanitization
5. **Date Validation:** Prevents booking in the past

---

## Summary

✅ **Complete Appointment Model** with all necessary fields
✅ **Full CRUD Operations** (Create, Read, Update, Delete)
✅ **Availability Checking** to prevent double-booking
✅ **Status Management** for appointment lifecycle
✅ **JWT Protected** endpoints
✅ **Frontend API Service** ready to use
✅ **Comprehensive Error Handling**
✅ **Optimized Database Queries** with indexes

The appointment system is now ready to use! Simply start the backend server and make API calls from your frontend.
