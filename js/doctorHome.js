
var currentName = sessionStorage.getItem('currentName');
var userType = localStorage.getItem('userType');

if (!currentName || userType !== 'doctor') {
    window.location.href = 'type.html';
}

// logout
var logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', function () {
    sessionStorage.clear();
    localStorage.removeItem('userType');
    window.location.href = 'index.html';
});
