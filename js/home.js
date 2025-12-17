// ==================== Session Check ====================
var currentName = sessionStorage.getItem('currentName');
var currentPatientId = sessionStorage.getItem('currentPatientId');

if (!currentName || !currentPatientId) {
  alert('Please login first');
  window.location.href = 'type.html';
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
const getAppointments = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return await apiCall(`/appointments?${params}`);
};

const addReview = async (reviewData) => {
  return await apiCall('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
};

const getReviews = async () => {
  return await apiCall('/reviews');
};

const getDoctors = async () => {
  return await apiCall('/doctors');
};

// ==================== Load Next Appointment (Notification Modal) ====================
async function loadNextAppointment() {
  const modalBody = document.querySelector('.modal-body');
  if (!modalBody) return;

  const result = await getAppointments({
    patient_id: currentPatientId,
    status: 'scheduled'
  });

  if (!result.success || result.data.length === 0) {
    modalBody.innerHTML = '<p class="fw-bold">You have no upcoming appointments.</p>';
    return;
  }

  const now = new Date();

  const futureAppointments = result.data.filter(a =>
    new Date(a.appointment_date) > now
  );

  if (futureAppointments.length === 0) {
    modalBody.innerHTML = '<p class="fw-bold">You have no upcoming appointments.</p>';
    return;
  }

  futureAppointments.sort(
    (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date)
  );

  const nextAppt = futureAppointments[0];

  localStorage.setItem('currentAppointmentId', nextAppt.id);

  const apptDate = new Date(nextAppt.appointment_date);

  const dateStr = apptDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeStr = apptDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  modalBody.innerHTML = `
    <div class="d-flex align-items-center gap-3 fw-bold">
      Your next appointment with ${nextAppt.doctor_name}
      is on ${dateStr} at ${timeStr}
      <i id="editTime"
        class="fa-solid fa-pen-to-square fs-4 text-danger cursor-pointer"></i>
    </div>
  `;

  document.getElementById('editTime').addEventListener('click', () => {
    window.location.href = 'editTime.html';
  });
}

// ==================== Reviews ====================

    if (!currentName || !currentPatientId) {
      alert('Please login first');
      window.location.href = 'type.html';
    }

    const sendBtn = document.querySelector('#reviews button');
    const textarea = document.querySelector('#reviews textarea');

    const doctorId = 1; 
    const patientName = currentName;

    sendBtn.addEventListener('click', () => {
      const comment = textarea.value.trim();
      if (!comment) {
        alert('Please write a review');
        return;
      }

      const reviews = JSON.parse(localStorage.getItem('doctorReviews')) || [];

      reviews.push({
        doctor_id: doctorId,
        patient_name: patientName,
        comment: comment,
        date: new Date().toISOString()
      });

      localStorage.setItem('doctorReviews', JSON.stringify(reviews));

      textarea.value = '';
      alert('Review submitted successfully!');
    });

// ==================== Logout ====================
var logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    const confirmation = confirm('Are you sure you want to log out?');
    if (confirmation) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = 'index.html';
    }
  });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function () {
  loadNextAppointment();
});
