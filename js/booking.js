// ==================== Session Check ====================
const currentPatientId = sessionStorage.getItem('currentPatientId');
const currentName = sessionStorage.getItem('currentName');

if (!currentPatientId || !currentName) {
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
const bookAppointment = async (appointmentData) => {
  return await apiCall('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
};

const getAvailableSlots = async (doctorId, date) => {
  const params = new URLSearchParams({ doctor_id: doctorId, date });
  return await apiCall(`/appointments/available-slots?${params}`);
};

const getDoctors = async () => {
  return await apiCall('/doctors');
};

// ==================== DOM Elements ====================
const dateTimePicker = document.getElementById('dateTimePicker');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// ==================== Set Minimum Date ====================
const now = new Date();
const formattedNow = now.toISOString().slice(0, 16);
dateTimePicker.min = formattedNow;

// ==================== Selected Doctor (default to first doctor) ====================
let selectedDoctorId = 1; // Default doctor ID

// ==================== Load Available Time Slots ====================
async function loadAvailableSlots() {
  const selectedDateTime = dateTimePicker.value;
  
  if (!selectedDateTime) {
    return;
  }

  // Extract date only (YYYY-MM-DD)
  const dateOnly = selectedDateTime.split('T')[0];
  
  const result = await getAvailableSlots(selectedDoctorId, dateOnly);

  const timeButtons = document.querySelectorAll('.timeBtn');
  
  if (result.success) {
    const availableSlots = result.data.available_slots;
    
    // Update time buttons based on availability
    timeButtons.forEach(btn => {
      const btnTime = btn.textContent.trim();
      // Convert "2:30 PM" to "14:30" format
      const time24 = convertTo24Hour(btnTime);
      
      if (availableSlots.includes(time24)) {
        btn.classList.remove('bg-secondary');
        btn.classList.add('main-clr');
        btn.disabled = false;
        btn.style.opacity = '1';
      } else {
        btn.classList.remove('main-clr');
        btn.classList.add('bg-secondary');
        btn.disabled = true;
        btn.style.opacity = '0.5';
      }
    });
  }
}

// ==================== Convert 12-hour to 24-hour format ====================
function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// ==================== Convert 24-hour to 12-hour format ====================
function convertTo12Hour(time24h) {
  const [hours, minutes] = time24h.split(':');
  const hour = parseInt(hours, 10);
  const modifier = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${modifier}`;
}

// ==================== Time Button Selection ====================
let selectedTime = null;

document.querySelectorAll('.timeBtn').forEach(btn => {
  btn.addEventListener('click', function() {
    if (!this.disabled) {
      // Remove selection from all buttons
      document.querySelectorAll('.timeBtn').forEach(b => {
        b.style.border = 'none';
      });
      
      // Add selection to clicked button
      this.style.border = '2px solid #8bc8caff';
      selectedTime = this.textContent.trim();
    }
  });
});

// ==================== Date Change Event ====================
dateTimePicker.addEventListener('change', loadAvailableSlots);

// ==================== Submit Booking ====================
submitBtn.addEventListener('click', async () => {
  const selectedDateTime = dateTimePicker.value;
  
  if (!selectedDateTime) {
    alert('Please select date and time.');
    return;
  }

  if (!selectedTime) {
    alert('Please select an available time slot.');
    return;
  }

  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Booking...';

  // Combine date and selected time
  const dateOnly = selectedDateTime.split('T')[0];
  const time24 = convertTo24Hour(selectedTime);
  const fullDateTime = `${dateOnly}T${time24}:00`;

  // Prepare appointment data
  const appointmentData = {
    patient_id: parseInt(currentPatientId),
    doctor_id: selectedDoctorId,
    appointment_date: new Date(fullDateTime).toISOString(),
    reason: 'General checkup', // Default reason
    symptoms: ''
  };

  console.log('Booking appointment:', appointmentData);

  // Send to backend
  const result = await bookAppointment(appointmentData);

  // Re-enable button
  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit';

  if (result.success) {
    const appointmentId = result.data.appointment.id;
    
    // Store appointment ID for edit page
    localStorage.setItem('currentAppointmentId', appointmentId);
    
    alert('Appointment booked successfully! ');
    window.location.href = 'editTime.html';
    
  } else {
    if (result.error.includes('already booked')) {
      alert('⚠️ This time slot is already booked! Please choose another time.');
      loadAvailableSlots(); // Refresh available slots
    } else {
      alert('Booking failed: ' + result.error);
    }
  }
});

// ==================== Cancel Button ====================
cancelBtn.addEventListener('click', () => {
  if (confirm('Do you want to cancel booking?')) {
    window.location.href = 'home.html';
  }
});

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', async function() {
  // Load doctors (optional: allow doctor selection)
  const doctorsResult = await getDoctors();
  if (doctorsResult.success && doctorsResult.data.length > 0) {
    selectedDoctorId = doctorsResult.data[0].id; // Use first doctor by default
  }
});