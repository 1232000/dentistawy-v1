// ==================== Session Check ====================
const currentDoctorId = sessionStorage.getItem('currentDoctorId');
const userType = localStorage.getItem('userType');

if (!currentDoctorId || userType !== 'doctor') {
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

// ==================== API Functions ====================
const getPatientsWithAppointments = async (doctorId) => {
  const params = new URLSearchParams({ doctor_id: doctorId });
  return await apiCall(`/patients/with-appointments?${params}`);
};

const getPatients = async () => {
  return await apiCall('/patients');
};

// ==================== DOM Elements ====================
let patientsList = document.getElementById("patientsList");
let searchInput = document.getElementById("searchInput");

let allPatients = [];

// ==================== Display Patients Function ====================
function displayPatients(list) {
  patientsList.innerHTML = "";
  
  if (list.length === 0) {
    patientsList.innerHTML = "<p class='fs-4 text-center text-muted'>No patients found</p>";
    return;
  }

  list.forEach((patient) => {
    patientsList.innerHTML += `
      <div class="d-flex justify-content-between align-items-center fs-5 p-3 light-bg rounded-3 mb-2 shadow-sm">
        <p class="mb-0 fw-bold">${patient.name}</p>
        <p class="mb-0 text-muted">${patient.diseases || 'No diseases'}</p>
        <a href="patientDetails.html?id=${patient.id}"
           class="btn dark-btn-clr rounded-5 px-4 text-white">
           View Details
        </a>
      </div>
    `;
  });
}

// ==================== Load Patients ====================
async function loadPatients() {
  patientsList.innerHTML = '<div class="text-center"><div class="spinner-border"></div></div>';

  // Get patients who have appointments with this doctor
  const result = await getPatientsWithAppointments(currentDoctorId);

  if (result.success) {
    allPatients = result.data;
    displayPatients(allPatients);
  } else {
    // Fallback: get all patients
    const allPatientsResult = await getPatients();
    if (allPatientsResult.success) {
      allPatients = allPatientsResult.data;
      displayPatients(allPatients);
    } else {
      patientsList.innerHTML = '<p class="text-danger text-center">Failed to load patients</p>';
    }
  }
}

// ==================== Search Functionality ====================
if (searchInput) {
  searchInput.addEventListener("input", function () {
    let searchValue = searchInput.value.toLowerCase();
    
    let filteredPatients = allPatients.filter(p =>
      p.name.toLowerCase().includes(searchValue) ||
      (p.email && p.email.toLowerCase().includes(searchValue)) ||
      (p.diseases && p.diseases.toLowerCase().includes(searchValue))
    );
    
    displayPatients(filteredPatients);
  });
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
  loadPatients();
});