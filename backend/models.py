from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    name: str
    role: str  # patient, doctor, admin, receptionist, nurse
    google_id: Optional[str] = None
    is_active: bool = True

class Appointment(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    patient_id: str
    doctor_id: str
    start_time: datetime
    end_time: datetime
    status: str  # booked, cancelled, rescheduled, blocked
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None