let params = new URLSearchParams(window.location.search);
let index = parseInt(params.get("index"));

let users = JSON.parse(localStorage.getItem("users")) || [];
let user = users[index];

let name = document.getElementById("name");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let diseases = document.getElementById("diseases");
let notes = document.getElementById("notes");
let textarea = document.getElementById("notesTextarea");
let addNoteBtn = document.querySelector("button");

if(user){
  name.innerText = user.name || "-";
  email.innerText = user.email || "-";
  phone.innerText = user.phone || "-";
  diseases.innerText = user.diseases || "-";

  if(!user.notes) {
    user.notes = [];
  }
  updateNotesDisplay();

} else {
  document.body.innerHTML = "<p class='text-danger fs-4 text-center mt-5'>Patient not found</p>";
}

function updateNotesDisplay() {
  if(user.notes.length === 0){
    notes.innerText = "No notes yet.";
  } else {
    notes.innerHTML = "";
    user.notes.forEach((note, i) => {
      let p = document.createElement("p");
      p.innerText = `${i + 1}. ${note}`;
      notes.appendChild(p);
    });
  }
}

addNoteBtn.addEventListener("click", function(){
  let noteText = textarea.value.trim();
  if(noteText === "") return;

  user.notes.push(noteText);
  localStorage.setItem("users", JSON.stringify(users));
  textarea.value = "";
  updateNotesDisplay();
});
