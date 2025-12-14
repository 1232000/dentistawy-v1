
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

// ==================== Get Patient Appointments ====================
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

// ==================== Load Next Appointment ====================
async function loadNextAppointment() {
  const result = await getAppointments({ 
    patient_id: currentPatientId,
    status: 'scheduled'
  });

  if (result.success && result.data.length > 0) {
    const appointments = result.data;
    // Sort by date and get the next one
    appointments.sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
    const nextAppt = appointments[0];

    // Display in modal
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
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
          Your next appointment with ${nextAppt.doctor_name} is on ${dateStr} at ${timeStr}
          <i id="editTime" class="fa-solid fa-pen-to-square fs-4 text-danger cursor-pointer"></i>
        </div>
      `;

      // Add edit button event
      const editTimeBtn = document.getElementById('editTime');
      if (editTimeBtn) {
        editTimeBtn.addEventListener('click', () => {
          localStorage.setItem('currentAppointmentId', nextAppt.id);
          window.location.href = 'editTime.html';
        });
      }
    }
  } else {
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = '<p class="fw-bold">You have no upcoming appointments.</p>';
    }
  }
}

// ==================== Load Reviews ====================
async function loadAllReviews() {
  const result = await getReviews();
  
  if (result.success && result.data.length > 0) {
    // TODO: Display reviews in the reviews section
    console.log('Reviews:', result.data);
  }
}

// ==================== Send Review ====================
async function setupReviewForm() {
  const sendBtn = document.querySelector('#reviews button');
  const textarea = document.querySelector('#reviews textarea');

  if (sendBtn && textarea) {
    sendBtn.addEventListener('click', async () => {
      const comment = textarea.value.trim();
      
      if (!comment) {
        alert('Please write a review');
        return;
      }

      const doctorsResult = await getDoctors();
      
      if (doctorsResult.success && doctorsResult.data.length > 0) {
        const doctorId = doctorsResult.data[0].id; 
        
        const reviewData = {
          patient_id: parseInt(currentPatientId),
          doctor_id: doctorId,
          rating: 5, // Default 5 stars for now
          comment: comment
        };

        const result = await addReview(reviewData);

        if (result.success) {
          alert('Review submitted successfully! ');
          textarea.value = '';
          loadAllReviews();
        } else {
          alert('Failed to submit review: ' + result.error);
        }
      }
    });
  }
}

// ==================== Logout ====================
var logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    var confirmation = confirm('Are you sure you want to log out?');
    if (confirmation) {
      sessionStorage.clear();
      localStorage.removeItem('userType');
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    }
  });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
  loadNextAppointment();
  loadAllReviews();
  setupReviewForm();
});
