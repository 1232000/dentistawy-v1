document.getElementById('doctorBtn').addEventListener('click', () => {
  localStorage.setItem('userType', 'doctor');
  window.location.href = 'login.html';
});

document.getElementById('patientBtn').addEventListener('click', () => {
  localStorage.setItem('userType', 'patient');
  window.location.href = 'login.html';
});
