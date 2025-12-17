const datePicker = document.getElementById('datePicker');
const submitBtn = document.getElementById('submitBtn');
const timeButtonsDiv = document.getElementById('timeButtons');
const appointmentId = localStorage.getItem('currentAppointmentId');


let selectedTime = null;
const doctorId = 1;
const patientId = 1;

function renderTimeButtons(slots) {
  timeButtonsDiv.innerHTML = '';
  slots.forEach(time => {
    const btn = document.createElement('button');
    btn.textContent = time;
    btn.dataset.time = time;
    btn.className = 'timeBtn d-block rounded-5 my-2 mx-auto px-4 py-2 pointer-event border-0 text-white dark-btn-clr';
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timeBtn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTime = time;
    });
    timeButtonsDiv.appendChild(btn);
  });
}

datePicker.addEventListener('change', async () => {
  const date = datePicker.value;
  if (!date) return;

  try {
    const res = await fetch(`http://127.0.0.1:5000/api/appointments/available-slots?doctor_id=${doctorId}&date=${date}`);
    if (!res.ok) throw new Error(`Failed to fetch available slots: ${res.status}`);
    const data = await res.json();
    renderTimeButtons(data.available_slots);
  } catch (err) {
    alert(err.message);
  }
});

submitBtn.addEventListener('click', async () => {
  if (!datePicker.value || !selectedTime) {
    alert('Select date and time');
    return;
  }

  const appointmentDate = `${datePicker.value}T${selectedTime}:00`;

  const url = appointmentId
    ? `http://127.0.0.1:5000/api/appointments/${appointmentId}`
    : `http://127.0.0.1:5000/api/appointments`;

  const method = appointmentId ? 'PUT' : 'POST';

  const body = appointmentId
    ? { appointment_date: appointmentDate }
    : {
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_date: appointmentDate
      };

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (res.ok) {
    alert(appointmentId ? 'Appointment updated' : 'Appointment booked');
    localStorage.removeItem('currentAppointmentId');
    window.location.href = 'home.html';
  } else {
    alert(data.error || 'Something went wrong');
  }
});

