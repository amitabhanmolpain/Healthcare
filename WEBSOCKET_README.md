# Real-Time WebSocket Integration

## Overview
This project now includes real-time WebSocket communication between the admin panel and user dashboard using Socket.IO.

## Features

### Real-Time Updates
- **Appointment Status Changes**: When an admin updates an appointment status, users see the change instantly
- **Doctor Availability**: When a doctor's status changes (Active/Offline), all users are notified immediately
- **Live Connection Status**: Visual indicator showing WebSocket connection status

## Setup

### Backend (Flask-SocketIO)

1. **Install Dependencies**:
```bash
cd backend
pip install flask-socketio python-socketio
```

2. **Run Server**:
```bash
python run.py
```

The server will start with SocketIO support on `http://localhost:5000`

### Frontend (Socket.IO Client)

1. **Install Dependencies**:
```bash
cd Healthcare
npm install socket.io-client
```

2. **Run Development Server**:
```bash
npm run dev
```

## How It Works

### Backend Events

#### 1. Appointment Updated
**Event**: `appointment_updated`  
**Triggered When**: Admin changes appointment status  
**Payload**:
```json
{
  "appointment_id": "string",
  "status": "pending|confirmed|cancelled|completed",
  "appointment": { /* full appointment object */ }
}
```

#### 2. Doctor Status Updated
**Event**: `doctor_status_updated`  
**Triggered When**: Admin toggles doctor availability  
**Payload**:
```json
{
  "doctor_id": "string",
  "is_active": true|false,
  "name": "Dr. Name"
}
```

### Frontend Listeners

#### Admin Dashboard
- Connects to WebSocket on mount
- Listens for both `appointment_updated` and `doctor_status_updated`
- Updates local state to reflect changes
- Shows toast notifications
- Displays connection status indicator

#### User Dashboard
- Connects to WebSocket on mount
- Listens for appointment updates affecting the user
- Listens for doctor status changes
- Auto-refreshes MyAppointments when updates occur
- Shows toast notifications

## Architecture

```
┌─────────────────┐         WebSocket         ┌─────────────────┐
│  Admin Panel    │◄──────────────────────────►│  Flask Server   │
│                 │         (Socket.IO)        │  with SocketIO  │
└─────────────────┘                            └─────────────────┘
                                                        │
                                                        │ WebSocket
                                                        │ (Socket.IO)
                                                        ▼
                                               ┌─────────────────┐
                                               │  User Dashboard │
                                               └─────────────────┘
```

## Files Modified

### Backend
- `backend/app/__init__.py` - Added SocketIO initialization
- `backend/app/controllers/admin_controller.py` - Added event emissions
- `backend/run.py` - Changed to use socketio.run()
- `backend/requirements.txt` - Added flask-socketio, python-socketio

### Frontend
- `Healthcare/src/services/socket.js` - WebSocket service singleton
- `Healthcare/src/components/Admin/AdminDashboard.jsx` - WebSocket connection & listeners
- `Healthcare/src/components/Dashboard/Dashboard.jsx` - WebSocket connection & listeners
- `Healthcare/src/components/Dashboard/MyAppointments.jsx` - Custom event listener for refresh
- `Healthcare/package.json` - Added socket.io-client

## Usage Example

### Admin Updates Appointment
1. Admin clicks "Confirm" on a pending appointment
2. Backend updates database
3. Backend emits `appointment_updated` event via WebSocket
4. All connected clients receive the event
5. Admin panel updates the appointment list
6. User dashboard shows toast notification
7. User's MyAppointments component auto-refreshes

### Admin Changes Doctor Status
1. Admin toggles doctor from Active to Offline
2. Backend updates doctor's `is_active` field
3. Backend emits `doctor_status_updated` event
4. All connected clients receive the event
5. Admin panel updates doctor card
6. User dashboard shows notification
7. Doctor list updates to hide offline doctor

## Testing

1. **Open Two Browser Windows**:
   - Window 1: Admin Dashboard (`http://localhost:5173/admin/dashboard`)
   - Window 2: User Dashboard (`http://localhost:5173`)

2. **Test Appointment Update**:
   - In admin window, go to Appointments tab
   - Change an appointment status
   - Watch user window - should see toast notification
   - Check MyAppointments - status should update

3. **Test Doctor Status**:
   - In admin window, go to Doctors tab
   - Toggle a doctor's status
   - Watch user window - should see notification
   - Check Available Doctors - list should update

## Connection Status Indicator

The admin dashboard header shows a live connection status:
- 🟢 **Green dot** = Connected to WebSocket
- 🔴 **Red dot** = Disconnected

## Debugging

Enable detailed logging in browser console:
```javascript
// In socket.js or component
console.log('Socket event received:', eventData);
```

Check Flask terminal for emitted events:
```python
# In admin_controller.py
print(f"Emitting event: {event_name}")
```

## Benefits

1. **Real-Time Updates**: No need to refresh page to see changes
2. **Better UX**: Users get instant feedback on their appointments
3. **Improved Admin Experience**: See changes propagate immediately
4. **Scalable**: Socket.IO handles reconnections and multiple clients
5. **Efficient**: Only sends updates when data changes

## Future Enhancements

- [ ] Add user-specific rooms (only send updates to relevant users)
- [ ] Add typing indicators for admin chat
- [ ] Add notification sound/bell for updates
- [ ] Add update history/activity log
- [ ] Add admin-to-user messaging
- [ ] Add new appointment notifications to admin
