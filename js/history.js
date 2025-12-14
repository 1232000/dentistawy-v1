let patients = JSON.parse(localStorage.getItem("users")) || [];

let patientsList = document.getElementById("patientsList");
let searchInput = document.getElementById("searchInput");

function displayPatients(list) {
  patientsList.innerHTML = "";

  if (list.length === 0) {
    patientsList.innerHTML = "<p class='fs-4 text-center'>No patients found</p>";
    return;
  }

  list.forEach((p, index) => {
    patientsList.innerHTML += `
      <div class="d-flex justify-content-between align-items-center fs-4 p-3 light-bg rounded-3 mb-2">
        <p>${p.name}</p>
        <p>${p.email}</p>
        <a href="patientDetails.html?index=${index}"
           class="btn dark-btn-clr rounded-5 px-4 text-white">
           View Details
        </a>
      </div>
    `;
  });
}

displayPatients(patients);

searchInput.addEventListener("input", function () {
  let searchValue = searchInput.value.toLowerCase();

  let filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchValue) ||
    p.email.toLowerCase().includes(searchValue)
  );

  displayPatients(filteredPatients);
});

