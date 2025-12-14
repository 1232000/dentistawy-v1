
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');
var phoneInput = document.getElementById('phone');
var diseasesInput = document.getElementById('diseases');
var signUp = document.getElementById('signupBtn');

var requiredInput = document.getElementById('requiredInput');
var existInput = document.getElementById('existInput');
var successInput = document.getElementById('success');

var arrayList = [];
var USERS_KEY = "users";

var PATTERNS = {
  name : /^[A-Za-z0-9 _-]{1,}$/ ,
  email : /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/ ,
  password : /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
  phone : /^(?:\+20|0)1(?:0|1|2|5)\d{8}$/,
  diseases : /^(?!\s*$).+$/

}

  if(localStorage.getItem(USERS_KEY) == null){
    arrayList = [];
  }else{
    arrayList = JSON.parse(localStorage.getItem(USERS_KEY)) ;
}
//------------------------------------------------------
signUp.addEventListener('click' ,function (e){
  requiredInput.classList.replace('d-block','d-none');
  existInput.classList.replace('d-block', 'd-none');
  successInput.classList.replace('d-block', 'd-none');


  if(nameInput.value.trim() =='' || emailInput.value.trim() =='' || passwordInput.value.trim() =='' || phoneInput.value.trim() == '' || diseasesInput.value.trim() == ''){
      requiredInput.classList.replace('d-none','d-block');
      existInput.classList.replace('d-block', 'd-none');
      successInput.classList.replace('d-block', 'd-none');
      console.log('not completed');
      return;
  }

  var nameValid = validation('name', nameInput);
  var emailValid = validation('email', emailInput);
  var passwordValid = validation('password', passwordInput);
  var phoneValid = validation('phone', phoneInput);
  var diseasesValid = validation('diseases', diseasesInput);

  console.log('nameValid:', nameValid);
console.log('emailValid:', emailValid);
console.log('passwordValid:', passwordValid);
console.log('phoneValid:', phoneValid);
console.log('diseasesValid:', diseasesValid);

  if (!(nameValid && emailValid && passwordValid && phoneValid && diseasesValid)) {
    requiredInput.classList.replace('d-none','d-block');
    return;
  }

  if(!exists()){
    requiredInput.classList.replace('d-block','d-none');
    existInput.classList.replace('d-block', 'd-none');
    successInput.classList.replace('d-none', 'd-block');
  
    var user = {
    name : nameInput.value.trim() ,
    email : emailInput.value.trim() ,
    password : passwordInput.value.trim() ,
    phone : phoneInput.value.trim() ,
    diseases : diseasesInput.value.trim()
  };

  arrayList.push(user);

  var stringList = JSON.stringify(arrayList);
  localStorage.setItem(USERS_KEY,stringList);

  console.log(arrayList);
  console.log('added');
return;
}}
 )
// ----------------------------------------------------------------
function exists(){
  for (var i = 0; i < arrayList.length; i++) {
    if(arrayList[i].email.toLowerCase().trim() == emailInput.value.toLowerCase().trim()){
      requiredInput.classList.replace('d-block','d-none');
      existInput.classList.replace('d-none','d-block');
      successInput.classList.replace('d-block', 'd-none');

      console.log('exists');
      return true;
    }}
    console.log('not exists');
    return false;

}
//-----------------------------------------------------------------
function validation(key , input){
  var pattern = PATTERNS[key];

  var inputValue = input.value;
  var isMatched = pattern.test(inputValue);

  return isMatched;
}

