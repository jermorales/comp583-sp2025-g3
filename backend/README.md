# Healthcare Appointment System Backend

## Setup

1. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in your values.
4. Start MongoDB (if not already running):
   ```bash
   mongod
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## API
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Endpoints for authentication, appointments, notifications, and more.