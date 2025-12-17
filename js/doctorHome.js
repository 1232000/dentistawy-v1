
// ==================== Session Check ====================
var currentName = sessionStorage.getItem('currentName');
var currentDoctorId = sessionStorage.getItem('currentDoctorId');
var userType = localStorage.getItem('userType');

if (!currentName || userType !== 'doctor' || !currentDoctorId) {
    alert('Please login as doctor');
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

// ==================== Get Doctor Appointments ====================
const getAppointments = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return await apiCall(`/appointments?${params}`);
};

// ==================== Load Today's Appointments ====================
async function loadTodayAppointments() {
  const today = new Date().toISOString().split('T')[0];
  
  const result = await getAppointments({ 
    doctor_id: currentDoctorId,
    status: 'scheduled'
  });

  if (result.success && result.data.length > 0) {
    const appointments = result.data;
    
    // Filter today's appointments
    const todayAppts = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date).toISOString().split('T')[0];
      return aptDate === today;
    });

    if (todayAppts.length > 0) {
      // Display in notification modal
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.innerHTML = `
          <div class="fw-bold">
            <p>You have ${todayAppts.length} appointment(s) today:</p>
            ${todayAppts.map(apt => {
              const time = new Date(apt.appointment_date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });
              return `<p>• ${apt.patient_name} at ${time}</p>`;
            }).join('')}
          </div>
        `;
      }
    }
  }
}


//================doctor review js==========

    if (!currentName || !currentDoctorId) {
      alert('Please login as doctor');
      window.location.href = 'type.html';
    }

    const reviewsContainer = document.getElementById('reviewsContainer');
    const doctorId = parseInt(currentDoctorId);

    function loadDoctorReviews() {
      if (!reviewsContainer) return;

      const reviews = JSON.parse(localStorage.getItem('doctorReviews')) || [];
      const doctorReviews = reviews.filter(r => r.doctor_id === doctorId);

      reviewsContainer.innerHTML = '';

      if (doctorReviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="fw-bold">No reviews yet</p>';
        return;
      }

      doctorReviews.forEach(review => {
        const div = document.createElement('div');
        div.className = 'bg-white p-3 rounded-4 w-100 my-2';

        div.innerHTML = `
          <p class="fw-bold mb-1">${review.patient_name}</p>
          <p class="mb-1">${review.comment}</p>
          <small class="text-muted">${new Date(review.date).toLocaleDateString()}</small>
        `;

        reviewsContainer.appendChild(div);
      });
    }

    document.addEventListener('DOMContentLoaded', loadDoctorReviews);

// ==================== Logout ====================
var logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    var confirmation = confirm('Are you sure you want to log out?');
    if (confirmation) {
      sessionStorage.clear();
      localStorage.removeItem('userType');
      window.location.href = 'index.html';
    }
  });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
  loadTodayAppointments();
});
