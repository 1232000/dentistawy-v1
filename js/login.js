var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');
var loginBtn = document.getElementById('loginBtn');

var requiredInput = document.getElementById('requiredInput');
var incorrectInput = document.getElementById('incorrectInput');

var arrayList = [];
var USERS_KEY = "users";

if(localStorage.getItem(USERS_KEY) != null){
    arrayList = JSON.parse(localStorage.getItem(USERS_KEY));
}

loginBtn.addEventListener('click', function(){
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const userType = localStorage.getItem('userType');

    requiredInput.classList.replace('d-block', 'd-none');
    incorrectInput.classList.replace('d-block', 'd-none');

    if(email === '' || password === ''){
        requiredInput.classList.replace('d-none', 'd-block');
        return;
    }

    if(userType === 'doctor'){
        const doctorEmail = "doctor@gmail.com";
        const doctorPassword = "Doctor123*";

        if(email === doctorEmail && password === doctorPassword){
            sessionStorage.setItem('currentName', 'Dr.Youmna');
            sessionStorage.setItem('userType', 'doctor');
            window.location.href = "doctorHome.html";
        } else {
            incorrectInput.textContent = "Incorrect doctor credentials";
            incorrectInput.classList.replace('d-none', 'd-block');
        }

    } else {
        var user = arrayList.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if(user){
            sessionStorage.setItem('currentName', user.name);
            window.location.href = "home.html";
        } else {
            incorrectInput.textContent = "Incorrect email or password";
            incorrectInput.classList.replace('d-none', 'd-block');
        }
    }
});
