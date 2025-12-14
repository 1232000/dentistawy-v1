
// ==================== DOM Elements ====================
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');
var loginBtn = document.getElementById('loginBtn');
var requiredInput = document.getElementById('requiredInput');
var incorrectInput = document.getElementById('incorrectInput');

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

// ==================== Login Function ====================
const loginUser = async (credentials) => {
  return await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

// ==================== Login Event Listener ====================
loginBtn.addEventListener('click', async function() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const userType = localStorage.getItem('userType') || 'patient';
  
  // Hide messages
  requiredInput.classList.replace('d-block', 'd-none');
  incorrectInput.classList.replace('d-block', 'd-none');
  
  // Validation
  if (email === '' || password === '') {
    requiredInput.classList.replace('d-none', 'd-block');
    return;
  }

  // Disable button
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';

  // Prepare credentials
  const credentials = {
    email: email,
    password: password,
    user_type: userType
  };

  // Send to backend
  const result = await loginUser(credentials);

  // Re-enable button
  loginBtn.disabled = false;
  loginBtn.textContent = 'Login';

  if (result.success) {
    console.log('Login successful:', result.data);

    if (userType === 'doctor') {
      // Doctor login
      const doctor = result.data.doctor;
      sessionStorage.setItem('currentName', doctor.name);
      sessionStorage.setItem('currentDoctorId', doctor.id);
      sessionStorage.setItem('currentEmail', doctor.email);
      localStorage.setItem('userType', 'doctor');
      
      window.location.href = 'doctorHome.html';
      
    } else {
      // Patient login
      const patient = result.data.patient;
      sessionStorage.setItem('currentName', patient.name);
      sessionStorage.setItem('currentPatientId', patient.id);
      sessionStorage.setItem('currentEmail', patient.email);
      localStorage.setItem('userType', 'patient');
      
      // Store full patient data
      localStorage.setItem('currentUser', JSON.stringify(patient));
      
      window.location.href = 'home.html';
    }

  } else {
    incorrectInput.textContent = result.error;
    incorrectInput.classList.replace('d-none', 'd-block');
    console.log('Login error:', result.error);
  }
});
