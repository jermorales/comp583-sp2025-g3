import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', or 'waitlist'

  // Booking form state
  const [doctorId, setDoctorId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:8000/appointments?user_id=${user.name}&role=${user.role}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data.appointments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleJoinWaitlist = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8000/appointments/${appointmentId}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.name }),
      });
      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }
      setSuccess('Successfully added to waitlist!');
      fetchAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(appt => new Date(appt.start_time) > now);
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter(appt => new Date(appt.start_time) <= now);
  };

  const renderAppointmentCard = (appt) => (
    <div key={appt.id} style={{
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Doctor:</strong> {appt.doctor_id}<br />
          <strong>Date:</strong> {new Date(appt.start_time).toLocaleDateString()}<br />
          <strong>Time:</strong> {new Date(appt.start_time).toLocaleTimeString()} - {new Date(appt.end_time).toLocaleTimeString()}<br />
          <strong>Status:</strong> <span style={{
            color: appt.status === 'confirmed' ? 'green' : 
                   appt.status === 'pending' ? 'orange' : 'red'
          }}>{appt.status}</span>
        </div>
        {activeTab === 'upcoming' && appt.status === 'pending' && (
          <button
            onClick={() => handleJoinWaitlist(appt.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Join Waitlist
          </button>
        )}
      </div>
      {appt.notes && (
        <div style={{ marginTop: '0.5rem' }}>
          <strong>Notes:</strong> {appt.notes}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2>Appointments</h2>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Back to Dashboard
          </button>
        </div>
        {user.role === 'patient' && (
          <Link
            to="/schedule-appointment"
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            Schedule New Appointment
          </Link>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'upcoming' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'upcoming' ? 'white' : 'black',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'past' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'past' ? 'white' : 'black',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Past
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === 'waitlist' ? '#007bff' : '#f8f9fa',
              color: activeTab === 'waitlist' ? 'white' : 'black',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Waitlist
          </button>
        </div>

        {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        {loading && <p>Loading...</p>}

        {!loading && !error && (
          <div>
            {activeTab === 'upcoming' && (
              <>
                <h3>Upcoming Appointments</h3>
                {getUpcomingAppointments().length === 0 ? (
                  <p>No upcoming appointments found.</p>
                ) : (
                  getUpcomingAppointments().map(renderAppointmentCard)
                )}
              </>
            )}

            {activeTab === 'past' && (
              <>
                <h3>Past Appointments</h3>
                {getPastAppointments().length === 0 ? (
                  <p>No past appointments found.</p>
                ) : (
                  getPastAppointments().map(renderAppointmentCard)
                )}
              </>
            )}

            {activeTab === 'waitlist' && (
              <>
                <h3>Waitlist</h3>
                <p style={{ marginBottom: '1rem' }}>
                  You can join the waitlist for any pending appointment to be notified if an earlier slot becomes available.
                  Waitlist positions are offered on a first-come, first-served basis.
                </p>
                {appointments.filter(appt => appt.status === 'pending').length === 0 ? (
                  <p>No pending appointments available for waitlist.</p>
                ) : (
                  appointments
                    .filter(appt => appt.status === 'pending')
                    .map(renderAppointmentCard)
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;