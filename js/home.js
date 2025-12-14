var currentName = sessionStorage.getItem('currentName');
if (!currentName) {
    window.location.href = 'type.html'; 
}

//logout
var logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', function () {
    var confirmation = confirm('You sure you want to log out?')
    if (confirmation) {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
});

// notifications
const editTimeBtn = document.getElementById('editTime');

editTimeBtn.addEventListener('click', () => {
  window.location.href = 'editTime.html';
});
