// ==================== Session Check ====================
const currentPatientId = sessionStorage.getItem('currentPatientId');

if (!currentPatientId) {
  alert('Please login first');
  window.location.href = 'index.html';
}

// ==================== API Configuration ====================
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// ==================== Generic API Call ====================
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));

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

const getPatientAppointments = async () => {
  return await apiCall(
    `/appointments?patient_id=${currentPatientId}&status=scheduled`
  );
};

const cancelAppointment = async (id) => {
  return await apiCall(`/appointments/${id}`, {
    method: 'DELETE',
  });
};

const editAppointmentDate = async (id, newDateTime) => {
  return await apiCall(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ appointment_date: newDateTime }),
  });
};

// ==================== DOM Elements ====================
const apptDate = document.getElementById('apptDate');
const apptTime = document.getElementById('apptTime');
const editBtn = document.getElementById('editBtn');
const cancelBtn = document.getElementById('cancelBtn');

// ==================== Resolve Appointment ID ====================
async function resolveAppointmentId() {
  let appointmentId = localStorage.getItem('currentAppointmentId');

  if (appointmentId) return appointmentId;

  const result = await getPatientAppointments();

  if (!result.success || result.data.length === 0) {
    alert('No upcoming appointments');
    window.location.href = 'home.html';
    return null;
  }

  result.data.sort(
    (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
  );

  appointmentId = result.data[0].id;
  localStorage.setItem('currentAppointmentId', appointmentId);

  return appointmentId;
}

// ==================== Load Appointment Details ====================
let appointmentId = null;

async function loadAppointmentDetails() {
  appointmentId = await resolveAppointmentId();
  if (!appointmentId) return;

  const result = await getAppointmentById(appointmentId);

  if (!result.success) {
    alert('Failed to load appointment');
    window.location.href = 'home.html';
    return;
  }

  const appointment = result.data;
  const dt = new Date(appointment.appointment_date);

  if (apptDate) {
    apptDate.textContent = dt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (apptTime) {
    apptTime.textContent = dt.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  console.log('Appointment loaded:', appointment);
}

// ==================== Edit Button ====================
editBtn.addEventListener('click', () => {
  localStorage.setItem('currentAppointmentId', appointmentId);
  window.location.href = 'booking.html';
});


// ==================== Cancel Button ====================
if (cancelBtn) {
  cancelBtn.addEventListener('click', async () => {
    const confirmation = confirm(
      'Are you sure you want to cancel this appointment?'
    );
    if (!confirmation) return;

    cancelBtn.disabled = true;
    cancelBtn.textContent = 'Cancelling...';

    const result = await cancelAppointment(appointmentId);

    if (result.success) {
      alert('Appointment cancelled successfully');
      localStorage.removeItem('currentAppointmentId');
      window.location.href = 'home.html';
    } else {
      alert(result.error);
      cancelBtn.disabled = false;
      cancelBtn.textContent = 'Cancel Appointment';
    }
  });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', loadAppointmentDetails);
