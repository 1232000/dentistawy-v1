// date
const dateTimePicker = document.getElementById('dateTimePicker');
const now = new Date();
const formattedNow = now.toISOString().slice(0,16);
dateTimePicker.min = formattedNow;

// submit
submitBtn.addEventListener('click', () => {
  if (!dateTimePicker.value) {
    alert('Please select date and time.');
    return;
  }

  const dt = new Date(dateTimePicker.value);

  const date = dt.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  const time = dt.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });

  localStorage.setItem('appointmentDate', date);
  localStorage.setItem('appointmentTime', time);

  window.location.href = 'editTime.html';
});

// cancel
const cancelBtn = document.getElementById('cancelBtn');
cancelBtn.addEventListener('click', () => {
  if (confirm('You want to cancel booking?')) {
    window.location.href = 'home.html';
  }
});
