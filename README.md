# Healthcare Appointment System

A web application for managing healthcare appointments, built with React and FastAPI.

## Features

- User authentication (login/register)
- Appointment scheduling
- View upcoming and past appointments
- Waitlist functionality for earlier appointments
- Role-based access (patients, doctors, admin)

## Tech Stack

### Frontend
- React
- React Router
- Context API for state management

### Backend
- FastAPI
- MongoDB
- Python 3.9+

## Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.9+
- MongoDB

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will be available at http://localhost:3000

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python -m uvicorn main:app --reload
   ```
   The backend will be available at http://localhost:8000

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 