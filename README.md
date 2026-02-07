# Vital Ease a  Gamified Mental Health Platform & Hospital  Management website  

scalable mental health platform to support users dealing with depression, anxiety, and PTSD through interactive therapeutic games  & a  hospital Management website  

## Features

- **Real-time Communication:** WebSocket support for live updates and smooth Flow of Data.
- **Cloud Storage:** Integration with Cloudinary for secure media uploads.
- **Modern Frontend:** Built with React and styled using Tailwind CSS.
- **Robust Backend:** Python (Flask) API with MongoDB for data storage and Redis for caching/session management.
- **Admin Dashboard:** Manage doctors, medicines, appointments, users and RESTAPI being used for connecting  the user panel and admin panel .
- **Mental Health Games:** Interactive games to support mental well-being.


## Tools & Technologies Used

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Python (Flask)
- **Database:** MongoDB
- **Cache/Session:** Redis for storing  the  Realtime scores of the games  and leaderboard  data  of the therapeutic games 
- **WebSockets:** For real-time features
- **Cloud Storage:** Cloudinary

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.8+
- MongoDB
- Redis
- Cloudinary account (for media uploads)

### Backend Setup
1. Clone the repository.
2. Navigate to the `backend/` directory.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and fill in required environment variables (MongoDB URI, Redis URL, Cloudinary credentials, etc).
5. **Seed the database:**
   - To add initial doctors and medicines, run:
     ```bash
     python seed.py
     ```
6. Start the backend server:
   ```bash
   python run.py
   ```

### Frontend Setup
1. Navigate to the `Healthcare/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

### WebSocket Usage
- . WebSocket support for live updates and smooth Flow of Data

### Cloudinary Integration
- Media uploads (e.g., doctor profile images, reports) are stored securely in Cloudinary. Configure your Cloudinary credentials in the backend `.env` file.

## Folder Structure
- `backend/` — Python Flask API, models, controllers, routes, and database seeders.
- `Healthcare/` — React frontend, components, assets, and styles.

## Required Environment Variables
- MongoDB URI
- Redis URL
- Cloudinary API Key, Secret, and Cloud Name
- (See `.env.example` in `backend/` for all required variables)

## Seeding Doctors and Medicines
- Use `backend/seed.py` to populate the database with initial doctor and medicine data.

## License
MIT

---

**Contributions are welcome!**
