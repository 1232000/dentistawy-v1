
// ==================== Get Patient ID from URL ====================
let params = new URLSearchParams(window.location.search);
let patientId = params.get("id");

if (!patientId) {
    alert('No patient selected');
    window.location.href = 'history.html';
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
const getPatient = async (id) => {
  return await apiCall(`/patients/${id}`);
};

const getMedicalHistory = async (id) => {
  return await apiCall(`/patients/${id}/history`);
};

const updateMedicalHistory = async (id, historyData) => {
  return await apiCall(`/patients/${id}/history`, {
    method: 'POST',
    body: JSON.stringify(historyData),
  });
};

const getAppointments = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return await apiCall(`/appointments?${params}`);
};

const addDoctorNotes = async (appointmentId, notesData) => {
  return await apiCall(`/appointments/${appointmentId}/notes`, {
    method: 'POST',
    body: JSON.stringify(notesData),
  });
};

// ==================== DOM Elements ====================
let name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let diseases = document.getElementById("diseases");
let notes = document.getElementById("notes");
let textarea = document.getElementById("notesTextarea");
let addNoteBtn = document.querySelector("button");



let currentPatient = null;
let patientAppointments = [];

// ==================== Load Patient Details ====================
async function loadPatientDetails() {
  const result = await getPatient(patientId);

  if (result.success) {
    currentPatient = result.data;
    
    // Display basic info
    name.innerText = currentPatient.name || "-";
    email.innerText = currentPatient.email || "-";
    phone.innerText = currentPatient.phone || "-";
    diseases.innerText = currentPatient.diseases || "None";

    // Load medical history
    await loadMedicalHistory();
    
    // Load patient appointments
    await loadPatientAppointments();

  } else {
    document.body.innerHTML = "<p class='text-danger fs-4 text-center mt-5'>Patient not found</p>";
  }
}

// ==================== Load Medical History ====================
async function loadMedicalHistory() {
  const result = await getMedicalHistory(patientId);

  if (result.success) {
    const history = result.data;
    
    // Display existing medical notes
    if (history.notes) {
      notes.innerHTML = `<p class="mb-2"><strong>Medical Notes:</strong></p><p>${history.notes}</p>`;
    } else {
      notes.innerText = "No medical notes yet.";
    }
  } else {
    notes.innerText = "No medical history available.";
  }
}

// ==================== Load Patient Appointments ====================
async function loadPatientAppointments() {
  const result = await getAppointments({ 
    patient_id: patientId,
    status: 'completed'
  });

  if (result.success) {
    patientAppointments = result.data;
    console.log('Patient appointments:', patientAppointments);
  }
}

// ==================== Add Note Button ====================
if (addNoteBtn) {
  addNoteBtn.addEventListener("click", async function() {
    let noteText = textarea.value.trim();
    
    if (noteText === "") {
      alert('Please write a note');
      return;
    }

    // Disable button
    addNoteBtn.disabled = true;
    addNoteBtn.textContent = 'Adding...';

    // Check if there's a completed appointment to add notes to
    if (patientAppointments.length > 0) {
      // Add note to the latest completed appointment
      const latestAppt = patientAppointments[patientAppointments.length - 1];
      
      const notesData = {
        diagnosis: '',
        treatment: '',
        prescription: '',
        notes: noteText
      };

      const result = await addDoctorNotes(latestAppt.id, notesData);

      if (result.success) {
        alert('Note added successfully! ');
        textarea.value = '';
        loadPatientDetails();
      } else {
        // If notes already exist, update medical history instead
        if (result.error.includes('already exist')) {
          await saveToMedicalHistory(noteText);
        } else {
          alert('Failed to add note: ' + result.error);
        }
      }
    } else {
      // No appointments yet, save to medical history
      await saveToMedicalHistory(noteText);
    }

    // Re-enable button
    addNoteBtn.disabled = false;
    addNoteBtn.textContent = 'Add Note';
  });
}

// ==================== Save to Medical History ====================
async function saveToMedicalHistory(noteText) {
  // Get existing history first
  const historyResult = await getMedicalHistory(patientId);
  let existingNotes = '';
  
  if (historyResult.success && historyResult.data.notes) {
    existingNotes = historyResult.data.notes + '\n\n';
  }

  const historyData = {
    notes: existingNotes + `[${new Date().toLocaleDateString()}] ${noteText}`
  };

  const result = await updateMedicalHistory(patientId, historyData);

  if (result.success) {
    alert('Note added to medical history! ');
    textarea.value = '';
    loadMedicalHistory();
  } else {
    alert('Failed to add note: ' + result.error);
  }
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
  loadPatientDetails();
});
