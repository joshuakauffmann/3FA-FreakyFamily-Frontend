<template>
  <h1 id="Title">To do List</h1>
  <div class="background-container"></div>
  <div class="container">
    <div id="left">
      <h1 id="TodaysLabel">Heutige Aufgaben Liste</h1>
      <div id="TodaysContainer"></div>
    </div>
    <div id="right">
      <h1 id="DutysLabel">Aufgaben</h1>
      <select id="Choicebox"></select>
      <button id="NewFolderButton" @click="createFolder()">New Folder</button>
      <button id="NewDutyButton" @click="saveDuty()">New Duty</button>
      <button id="DeleteThisFolder" @click="deleteFolder()">
        Delete This Folder
      </button>
      <div id="DutyContainer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";

onMounted(() => {
  buildScene();
});
function buildScene() {
  folderExisting()
    .then((response) => {
      if (response == false) {
        createFolder("Alle Aufgaben");
      }
    })
    .then(buildChoicebox());
}
async function folderExisting() {
  const response = await fetch("http://localhost:8080/getFolders");
  const data = await response.json();
  return data.length > 0;
}
function buildChoicebox() {
  const choicebox = document.getElementById("Choicebox");
  fetch("http://localhost:8080/getFolders")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        const option = document.createElement("option");
        option.value = element.id;
        option.text = element.name;
        choicebox.appendChild(option);
      });
      choiceboxChanged(true);
    });
  choicebox.addEventListener("change", choiceboxChanged);
}
function choiceboxChanged(addToTodays) {
  const container = document.getElementById("DutyContainer");
  const choicebox = document.getElementById("Choicebox");
  const selectedOption = choicebox.options[choicebox.selectedIndex];
  if (selectedOption.text != "Alle Aufgaben") {
    const data = { folderId: selectedOption.value };
    container.replaceChildren();
    fetch(
      "http://localhost:8080/getDutysById" +
        "?" +
        Object.keys(data)
          .map((key) => key + "=" + encodeURIComponent(data[key]))
          .join("&")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          data.forEach((element) => {
            createGUIDuty(element);
            if (addToTodays == true) {
              addDutyToTodays(element, true);
            } else if (addToTodays == null) {
              addDutyToTodays(element, false);
            }
          });
        }
      })
      .catch((error) => console.log(error));
  } else {
    container.replaceChildren();
    fetch("http://localhost:8080/getDutys")
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          data.forEach((element) => {
            createGUIDuty(element);
            if (addToTodays == true) {
              addDutyToTodays(element, true);
            } else if (addToTodays == null) {
              addDutyToTodays(element, false);
            }
          });
        }
      })
      .catch((error) => console.log(error));
  }
}
function createGUIDuty(duty) {
  const container = document.getElementById("DutyContainer");
  const newContainer = document.createElement("div");
  const textField = document.createElement("input");
  const button = document.createElement("button");
  const deleteButton = document.createElement("button");

  newContainer.setAttribute("class", "DutyBox");
  newContainer.setAttribute("id", duty.id + "DutyContainer");

  deleteButton.textContent = "x";
  deleteButton.setAttribute("id", "DutyButton");
  deleteButton.addEventListener("click", function () {
    dutyFinished(duty);
  });

  button.textContent = "+";
  button.setAttribute("id", "DutyButton");
  button.addEventListener("click", function () {
    addDutyToTodays(duty, false);
  });
  if (duty.aufgabe != undefined) {
    textField.value = duty.aufgabe;
  }
  textField.setAttribute("id", duty.id);
  textField.setAttribute("class", "DutyTextField");
  textField.addEventListener("keyup", function () {
    duty.aufgabe = document.getElementById(duty.id).value;
    changeDuty(duty);
  });

  newContainer.appendChild(button);
  newContainer.appendChild(textField);
  newContainer.appendChild(deleteButton);
  container.appendChild(newContainer);
}
function addDutyToTodays(duty, build) {
  if (
    (duty.inTodays == false && build == false) ||
    (build == true && duty.inTodays == true)
  ) {
    duty.inTodays = true;
    changeDuty(duty);
    const container = document.getElementById("TodaysContainer");
    const newContainer = document.createElement("div");
    const textField = document.createElement("input");
    const button = document.createElement("button");
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "x";
    deleteButton.setAttribute("id", "DutyButton");
    deleteButton.addEventListener("click", function () {
      dochNichtTodaysDuty(duty);
    });

    newContainer.setAttribute("class", "TodaysBox");
    newContainer.setAttribute("id", duty.id + "TodaysContainer");
    textField.value = duty.aufgabe;
    textField.setAttribute("id", duty.id + "TodaysTextField");
    textField.setAttribute("class", "TodaysTextField");
    button.textContent = "Done";
    button.setAttribute("id", "DutyButton");
    button.addEventListener("click", function () {
      dutyFinished(duty);
    });
    textField.addEventListener("keyup", function () {
      dutyTextField = document.getElementById(duty.id);
      dutyTextField.value = textField.value;
      duty.aufgabe = dutyTextField.value;
      changeDuty(duty);
    });

    newContainer.appendChild(button);
    newContainer.appendChild(textField);
    newContainer.appendChild(deleteButton);
    container.appendChild(newContainer);
  }
}
function dochNichtTodaysDuty(duty) {
  duty.inTodays = false;
  const data = {
    id: duty.id,
    aufgabe: duty.aufgabe,
    inTodays: duty.inTodays,
    folder: duty.folder,
  };
  console.log(data);
  fetch("http://localhost:8080/changeDutyAufgabe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
  const Todayscontainer = document.getElementById(duty.id + "TodaysContainer");
  Todayscontainer.remove();
}
function dutyFinished(duty) {
  const data = {
    id: duty.id,
    aufgabe: duty.aufgabe,
    inTodays: duty.inTodays,
    folder: duty.folder,
  };
  fetch("http://localhost:8080/removeDuty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
  if (duty.inTodays) {
    const Todayscontainer = document.getElementById(
      duty.id + "TodaysContainer"
    );
    Todayscontainer.remove();
  }
  const Dutyconatiner = document.getElementById(duty.id + "DutyContainer");
  Dutyconatiner.remove();
}
function deleteDuty(duty) {
  console.log("another one");
  const data = {
    id: duty.id,
    aufgabe: duty.aufgabe,
    inTodays: duty.inTodays,
    folder: duty.folder,
  };
  fetch("http://localhost:8080/removeDuty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
  if (duty.inTodays) {
    const Todayscontainer = document.getElementById(
      duty.id + "TodaysContainer"
    );
    Todayscontainer.remove();
  }
  const Dutyconatiner = document.getElementById(duty.id + "DutyContainer");
  Dutyconatiner.remove();
}
function deleteAllDutysFromFolder() {
  const choicebox = document.getElementById("Choicebox");
  selectedOption = choicebox.options[choicebox.selectedIndex];
  if (selectedOption.text != "Alle Aufgaben") {
    const data = { folderId: selectedOption.value };
    fetch(
      "http://localhost:8080/getDutysById" +
        "?" +
        Object.keys(data)
          .map((key) => key + "=" + encodeURIComponent(data[key]))
          .join("&")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          data.forEach((element) => {
            deleteDuty(element);
          });
        }
      })
      .catch((error) => console.log(error));
  }
}
function deleteFoldercurrentFolder() {
  const choicebox = document.getElementById("Choicebox");
  selectedOption = choicebox.options[choicebox.selectedIndex];
  if (selectedOption.text != "Alle Aufgaben") {
    const data = {}; //Paramater eingeben
    fetch(
      "http://localhost:8080/getFolderById" +
        "?" +
        Object.keys(data)
          .map((key) => key + "=" + encodeURIComponent(data[key]))
          .join("&")
    )
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => console.log(error));
  }
}
function saveDuty() {
  const choicebox = document.getElementById("Choicebox");
  const selectedOption = choicebox.options[choicebox.selectedIndex];
  const param = {
    folderId: selectedOption.value,
    aufgabe: "",
    inTodays: false,
  };
  fetch("http://localhost:8080/saveDutys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(param),
  })
    .then((response) => response.json())
    .then((data) => {
      createGUIDuty(data);
    })
    .catch((error) => console.error(error));
}
function changeDuty(duty) {
  const dutyInTodays = document.getElementById(duty.id + "TodaysTextField");
  if (duty.inTodays != null) {
    if (duty.inTodays && dutyInTodays != null) {
      dutyInTodays.value = duty.aufgabe;
    }
  }
  const data = {
    id: duty.id,
    aufgabe: duty.aufgabe,
    inTodays: duty.inTodays,
    folder: duty.folder,
  };
  console.log(data);
  fetch("http://localhost:8080/changeDutyAufgabe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}
function createFolder(folderName) {
  const choicebox = document.getElementById("Choicebox");
  var userInput;
  if (folderName == null) {
    userInput = prompt("Name des neuen Folders:");
    console.log(userInput);
  } else {
    userInput = folderName;
    console.log(userInput);
  }
  if (userInput !== null && userInput !== "") {
    const data = { name: userInput };
    fetch("http://localhost:8080/saveFolder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        const option = document.createElement("option");
        option.text = userInput;
        option.value = data.id;
        console.log(option);
        choicebox.appendChild(option);
      })
      .catch((error) => console.error(error));
  }
}
function deleteFolder() {
  const response = confirm(
    "Are you sure you want to delete this Folder with all its Dutys in it?"
  );
  if (response) {
    //OK wurde gedrückt
    deleteAllDutysFromFolder();
  }
}
</script>

<style scoped>
* {
  font-family: "Courier New", Courier, monospace;
}

#Title {
  position: relative; /* Positionierung für das Pseudoelement */
  display: flex; /* Entferne die Flexbox-Anweisung von * */
  justify-content: center; /* Zentriere die Schrift horizontal */
  align-items: center; /* Zentriere die Schrift vertikal */
  height: 100px; /* Feste Höhe für den Titel */
  background-color: white; /* Hintergrundfarbe für den Titel */
  margin: 0;
}

#MainLabel {
  font-size: 50px;
  text-align: center;
  font-style: italic;
  color: rgb(2, 55, 116);
}
.container {
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 5%;
}
#left {
  border-style: solid;
  border-color: rgb(2, 55, 116);
  width: 72%;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
#left Button {
  margin: 4px 0;
  padding: 10px;
  background-color: #102497;
  color: white;
  border-color: blue;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
#right {
  border-style: solid;
  border-color: rgb(2, 55, 116);
  padding: 5px;
  width: 25%;
  float: right;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
#right Button {
  margin: 4px 0;
  padding: 10px;
  background-color: #102497;
  color: white;
  border-color: blue;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
#TodaysLabel {
  margin: 0;
  font-size: 32px;
  font-style: italic;
  color: rgb(2, 55, 116);
  text-align: center;
}
#DutysLabel {
  margin: 0%;
  font-size: 32px;
  font-style: italic;
  color: rgb(2, 55, 116);
  text-align: center;
}
#DutyContainer {
  padding-top: 5px;
}
.DutyBox {
  padding: 2px;
}
.DutyTextField {
  width: 198px;
}
#DutyButton {
  background-color: #102497;
  color: white;
  border-color: blue;
}
#TodayContainer {
  padding-top: 10px;
}
.TodaysBox {
  padding: 5px;
}
.TodaysTextField {
  width: 643px;
}
#TodaysButton {
  background-color: #102497;
  color: white;
  border-color: blue;
}
</style>
