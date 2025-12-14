
// ==================== DOM Elements ====================
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');
var phoneInput = document.getElementById('phone');
var diseasesInput = document.getElementById('diseases');
var signUp = document.getElementById('signupBtn');

var requiredInput = document.getElementById('requiredInput');
var existInput = document.getElementById('existInput');
var successInput = document.getElementById('success');


// ==================== Validation Patterns ====================
var PATTERNS = {
  name: /^[A-Za-z0-9 _-]{1,}$/,
  email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
  phone: /^(?:\+20|0)1(?:0|1|2|5)\d{8}$/,
  diseases: /^(?!\s*$).+$/
};

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

// ==================== Signup Function ====================
const signupUser = async (userData) => {
  return await apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

signUp.addEventListener('click', async function (e) {
  e.preventDefault();
  
  requiredInput.classList.replace('d-block', 'd-none');
  existInput.classList.replace('d-block', 'd-none');
  successInput.classList.replace('d-block', 'd-none');

  // Check if fields are empty
  if (nameInput.value.trim() == '' || 
      emailInput.value.trim() == '' || 
      passwordInput.value.trim() == '' || 
      phoneInput.value.trim() == '' || 
      diseasesInput.value.trim() == '') {
    requiredInput.classList.replace('d-none', 'd-block');
    console.log('not completed');
    return;
  }

  // Validate inputs
  var nameValid = validation('name', nameInput);
  var emailValid = validation('email', emailInput);
  var passwordValid = validation('password', passwordInput);
  var phoneValid = validation('phone', phoneInput);
  var diseasesValid = validation('diseases', diseasesInput);

  console.log('nameValid:', nameValid);

  console.log('emailValid:', emailValid);
  console.log('passwordValid:', passwordValid);
  console.log('phoneValid:', phoneValid);
  console.log('diseasesValid:', diseasesValid);

  if (!(nameValid && emailValid && passwordValid && phoneValid && diseasesValid)) {
    requiredInput.classList.replace('d-none', 'd-block');
    requiredInput.textContent = 'Please enter valid information';
    return;
  }

  // Disable button while submitting
  signUp.disabled = true;
  signUp.textContent = 'Signing up...';

  // Prepare user data
  var user = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
    phone: phoneInput.value.trim(),
    diseases: diseasesInput.value.trim()
  };

  const result = await signupUser(user);

  signUp.disabled = false;
  signUp.textContent = 'Sign up';

  if (result.success) {
    requiredInput.classList.replace('d-block', 'd-none');
    existInput.classList.replace('d-block', 'd-none');
    successInput.classList.replace('d-none', 'd-block');

    console.log('Registration successful:', result.data);

    setTimeout(() => {
      window.location.href = 'type.html';
    }, 1500);

  } else {
    if (result.error.includes('already exists')) {
      requiredInput.classList.replace('d-block', 'd-none');
      existInput.classList.replace('d-none', 'd-block');
      successInput.classList.replace('d-block', 'd-none');
      console.log('Email exists');
    } else {
      requiredInput.classList.replace('d-none', 'd-block');
      requiredInput.textContent = result.error;
      console.log('Error:', result.error);
    }
  }
});

// ==================== Validation Function ====================
function validation(key, input) {
  var pattern = PATTERNS[key];
  var inputValue = input.value;
  var isMatched = pattern.test(inputValue);
  return isMatched;
}

// ==================== Real-time Validation (Optional) ====================
[nameInput, emailInput, passwordInput, phoneInput, diseasesInput].forEach(input => {
  input.addEventListener('blur', function() {
    const fieldName = this.id;
    if (PATTERNS[fieldName]) {
      const isValid = validation(fieldName, this);
      if (isValid) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      } else {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      }
    }
  });
});
