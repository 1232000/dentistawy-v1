
// ==================== Get Appointment ID ====================
const appointmentId = localStorage.getItem('currentAppointmentId');

if (!appointmentId) {
    alert('No appointment selected');
    window.location.href = 'home.html';
}

// ==================== API Configuration ====================
const API_BASE_URL = 'http://127.0.0.1:5000/api';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== API Functions ====================
const getAppointmentById = async (id) => {
  return await apiCall(`/appointments/${id}`);
};

const cancelAppointment = async (id) => {
  return await apiCall(`/appointments/${id}`, {
    method: 'DELETE',
  });
};

// ==================== DOM Elements ====================
const apptDate = document.getElementById('apptDate');
const apptTime = document.getElementById('apptTime');
const editBtn = document.getElementById('editBtn');
const cancelBtn = document.getElementById('cancelBtn');

// ==================== Load Appointment Details ====================
async function loadAppointmentDetails() {
  const result = await getAppointmentById(appointmentId);

  if (result.success) {
    const appointment = result.data;
    
    // Format date and time
    const dt = new Date(appointment.appointment_date);
    const date = dt.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
    const time = dt.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Display appointment details
    if (apptDate) apptDate.textContent = date;
    if (apptTime) apptTime.textContent = time;

    console.log('Appointment loaded:', appointment);

  } else {
    alert('Failed to load appointment: ' + result.error);
    window.location.href = 'home.html';
  }
}

// ==================== Edit Button ====================
if (editBtn) {
  editBtn.addEventListener('click', () => {
    // Go back to booking page (which will load this appointment for editing)
    window.location.href = 'booking.html';
  });
}

// ==================== Cancel Button ====================
if (cancelBtn) {
  cancelBtn.addEventListener('click', async () => {
    const confirmation = confirm('Are you sure you want to cancel this appointment?');
    
    if (confirmation) {
      // Disable button
      cancelBtn.disabled = true;
      cancelBtn.textContent = 'Cancelling...';

      const result = await cancelAppointment(appointmentId);

      if (result.success) {
        alert('Appointment cancelled successfully! ');
        localStorage.removeItem('currentAppointmentId');
        window.location.href = 'home.html';
      } else {
        alert('Failed to cancel appointment: ' + result.error);
        cancelBtn.disabled = false;
        cancelBtn.textContent = 'Cancel Appointment';
      }
    }
  });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
  loadAppointmentDetails();
});
