
const doctorBtn = document.getElementById('doctorBtn');
const patientBtn = document.getElementById('patientBtn');


// Doctor button
doctorBtn.addEventListener('click', function() {
  localStorage.setItem('userType', 'doctor');
  window.location.href = 'login.html';
});


// Patient button
patientBtn.addEventListener('click', function() {
  localStorage.setItem('userType', 'patient');
  window.location.href = 'login.html';
});
