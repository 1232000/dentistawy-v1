
const date = localStorage.getItem('appointmentDate');
const time = localStorage.getItem('appointmentTime');

const apptDate = document.getElementById('apptDate');
const apptTime = document.getElementById('apptTime');
const cancelBtn = document.getElementById('cancelBtn');

  if (date) document.getElementById('apptDate').textContent = date;
  if (time) document.getElementById('apptTime').textContent = time;

cancelBtn.addEventListener('click', () => {
    if (confirm('You want to cancel booking?')) {
        localStorage.removeItem('appointmentDate');
        localStorage.removeItem('appointmentTime');

        apptDate.textContent = "You haven't booked an appointment yet.";
        apptTime.textContent = "";
    }
});
