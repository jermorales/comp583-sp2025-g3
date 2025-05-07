from fastapi import APIRouter, HTTPException, status, Request, Body
from pydantic import BaseModel, EmailStr
from users import create_user, authenticate_user, get_user_by_email_or_username
from models import Appointment
from database import get_database
from bson import ObjectId
from datetime import datetime
from typing import Optional

router = APIRouter()
db = get_database()
appointments_collection = db["appointments"]

# User registration, login, forgot password
class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class LoginRequest(BaseModel):
    identifier: str  # username or email
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post('/register')
def register_user(data: RegisterRequest):
    if get_user_by_email_or_username(data.email) or get_user_by_email_or_username(data.username):
        raise HTTPException(status_code=400, detail="User already exists")
    user = create_user(data.email, data.username, data.password)
    return {"message": "User registered successfully", "user": {"email": user["email"], "name": user["name"], "role": user["role"]}}

@router.post('/login')
def login_user(data: LoginRequest):
    user = authenticate_user(data.identifier, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": {"email": user["email"], "name": user["name"], "role": user["role"]}}

@router.post('/forgot-password')
def forgot_password(data: ForgotPasswordRequest):
    user = get_user_by_email_or_username(data.email)
    # For demo: just return a message. In production, send an email with a reset link.
    if user:
        return {"message": "Password reset link sent to your email (demo)"}
    else:
        return {"message": "If an account with that email exists, a reset link has been sent (demo)"}

# Appointment booking and management
class AppointmentRequest(BaseModel):
    patient_id: str
    doctor_id: str
    start_time: datetime
    end_time: datetime
    notes: str = ""

@router.post('/appointments')
def book_appointment(data: AppointmentRequest, role: str = Body(...)):
    if role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can book appointments")
    appointment = data.dict()
    appointment["status"] = "booked"
    appointment["created_at"] = datetime.utcnow()
    result = appointments_collection.insert_one(appointment)
    appointment["id"] = str(result.inserted_id)
    return {"message": "Appointment booked", "appointment": appointment}

@router.get('/appointments')
def list_appointments(user_id: str, role: str):
    # Patients see their appointments, doctors see theirs
    query = {"patient_id": user_id} if role == "patient" else {"doctor_id": user_id}
    appointments = list(appointments_collection.find(query))
    for appt in appointments:
        appt["id"] = str(appt["_id"])
        appt.pop("_id", None)
    return {"appointments": appointments}

class AppointmentUpdateRequest(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None
    notes: Optional[str] = None

@router.patch('/appointments/{appointment_id}')
def update_appointment(appointment_id: str, data: AppointmentUpdateRequest, user_id: str = Body(...), role: str = Body(...)):
    appt = appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    # Only the patient who booked can cancel/reschedule
    if role == "patient" and appt["patient_id"] != user_id:
        raise HTTPException(status_code=403, detail="You can only modify your own appointments")
    # For doctors/admins, allow update (could add more checks here)
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    appointments_collection.update_one({"_id": ObjectId(appointment_id)}, {"$set": update_data})
    return {"message": "Appointment updated"}