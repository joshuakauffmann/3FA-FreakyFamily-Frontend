<!-- //HTML\\ -->
<template>
  <h2 class="secondaryTopBar">To do List</h2>
  <div id="mainContainer">
    <!-- Left Drawer -->
    <div v-if="leftDraw === true" id="leftDraw">
      <div class="topBar">
        <h5 style="color: white">Ordner</h5>
      </div>

      <q-list id="folderList">
        <br />
        <q-item>
          <q-item-section>
            <q-btn
              text-color="black"
              icon="flare"
              label="Today"
              size="16px"
              class="foldersButton"
              @click="getTasksToday()"
            />
            </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-btn
              text-color="black"
              icon="rule"
              label="Alle Aufgaben"
              size="16px"
              class="foldersButton"
              @click="getAllTasks(true)"
            />
          </q-item-section>
        </q-item>
        <q-item v-for="folder in folderListAll" :key="folder.id">
          <q-item-section>
            <q-btn
              text-color="black"
              icon="liste"
              :label="folder.name"
              size="16px"
              class="foldersButton"
              @click="getTasksByFolder(folder)"
            />
          </q-item-section>
        </q-item>
      </q-list>
      <div id="leftDrawFooter">
        <q-input
          outlined
          v-model="newFolder"
          label="New Folder"
          label-color="white"
        />
        <q-btn
          text-color="white"
          icon="add"
          id="addFolderButton"
          @click="createFolder(newFolder)"
        />
      </div>
    </div>
    <!-- Left Drawer -->

    <!-- Left Drawer Button -->
    <q-btn
      color="gray"
      text-color="black"
      icon="list"
      class="hideButton"
      @click="toggleLeftDraw()"
    />
    <!-- Left Drawer Button -->

    <!-- Middle Drawer -->
    <div id="middleDraw">
      <h5>{{ currentFolderName }}</h5>

      <q-list>
        <q-item v-for="task in currentTasks" :key="task.id">
          <q-item-section>
            <q-field outlined id="taskBox">
              <template v-slot:control>
                <div class="taskText" tabindex="0">
                  <p>{{ task.description }}</p>
                </div>
              </template>
            </q-field>
            <div id="taskButtons">
              <q-btn
                text-color="white"
                icon="done"
                class="addButton"
                size="xs"
                @click="deleteTask(task)"  
              /> <!-- TODO: delete Folder Reference OR Change Reference to a hidden Folder -->
              <q-btn
                text-color="white"
                icon="flare"
                class="addButton"
                size="xs"
                @click="addTaskToToday(task)"
              />
              <q-btn
                text-color="white"
                icon="settings"
                class="addButton"
                size="xs"
              />
              <q-btn
                text-color="white"
                icon="delete"
                class="addButton"
                size="xs"
                @click="deleteTask(task)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-if="inTodayFolder === false && inAlleAufgabenFolder === false" id="middleDrawFooter">
        <q-input
          id="middleTextInputField"
          outlined
          v-model="newTask"
          label="New Task"
        />
        <q-btn
          text-color="white"
          icon="add"
          class="addButton"
          @click="addTask(newTask)"
        />
      </div>
    </div>
    <!-- Middle Drawer -->


    <!-- Right Drawer Button-->
    <q-btn
      v-if="inTodayFolder === true"
      color="gray"
      text-color="black"
      icon="offline_bolt"
      class="hideButton"
      @click="toggleRightDraw(),getAllTasks(false)"
    />
    <!-- Right Drawer Button-->


    <!-- Right Drawer -->
    <!-- Only when in Todays Folder -->

    <div v-if="rightDraw === true && inTodayFolder === true" id="rightDraw">
      <div class="topBar">
        <h5>Vorschläge</h5>
      </div>
      <q-list v-for="task in allTasks" :key="task.id">
        <q-item v-if="task.today === false">
          <q-item-section>
            <q-field outlined id="taskBox">
              <template v-slot:control>
                <div id="taskTextVorschlag" tabindex="0">
                  <p>{{ task.description }}</p>
                </div>                
              </template>
            </q-field>
          </q-item-section>
        </q-item>
      </q-list>  
    </div>

    <!-- Right Drawer -->
    <!-- Only when in Todays Folder -->
  </div>
  <br />
  <br />
</template>
<!-- //HTML\\ -->

<!-- //Script\\ -->
<script setup>
//Imports\\
import { ref } from "vue";
import { onMounted } from "vue";
//Imports\\


//Attributes\\

//Lists\\
const allTasks = ref([]);
const currentTasks = ref([]);
const folderListAll = ref([]);
//Lists\\

//Booleans\\
const leftDraw = ref(false);
const rightDraw = ref(false);

const inTodayFolder = ref(true);
const inAlleAufgabenFolder = ref();
//Booleans\\

//Strings\\
const currentFolderName = ref();
const currentFolderId = ref();
const newFolder = ref();
const newTask = ref();
//Strings\\

//Attributes\\


//Setup\\
onMounted(() => {
  getAllFolders();
  getTasksToday();
});
//Setup\\



//Folder Methods\\
async function getAllFolders() {
  fetch("http://localhost:8080/api/v1/folder/")
    .then((response) => response.json())
    .then((data) => {
      folderListAll.value = data;
    });
}

async function createFolder(newFolderName) {

  const data = { name: newFolderName };
  fetch("http://localhost:8080/api/v1/folder/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((responseData) => {
    const newFolder = { name: responseData.name, id: responseData.id };
    folderListAll.value.push(newFolder);
  })
  .catch((error) => console.error(error));
}
//Folder Methods\\


//Task Methods\\
function getAllTasks(show) {
  fetch("http://localhost:8080/api/v1/task/")
    .then((response) => response.json())
    .then((data) => {
      if(show)currentTasks.value = data;
      allTasks.value = data;
    });

  if(show)
  {
    inTodayFolder.value = false;
    inAlleAufgabenFolder.value = true;
    currentFolderName.value = "Alle Aufgaben";
    currentFolderId.value = null;
    rightDraw.value = false;
  }
}

function getTasksByFolder(folder) {
      fetch(`http://localhost:8080/api/v1/task/folder${folder.id}`)
        .then((response) => response.json())
        .then((data) => {
            currentTasks.value = data;
        })
        .catch((error) => console.log(error));

      inTodayFolder.value = false;
      inAlleAufgabenFolder.value = false;
      currentFolderName.value = folder.name;
      currentFolderId.value = folder.id;
      rightDraw.value = false;
}

function getTasksToday(){
  fetch("http://localhost:8080/api/v1/task/todays")
  .then((response) => response.json())
  .then((data) => {
    currentTasks.value = data;
  })

  inTodayFolder.value = true;
  inAlleAufgabenFolder.value = false;
  currentFolderName.value = "Today";
  currentFolderId.value = null;
}

function addTask(text) {
  var userInput;
  if (text == null) userInput = prompt("Insert Task:");
  else userInput = text;

    const param = {
      description: userInput,
      today: false,
      folderId: currentFolderId.value
    };
    fetch(`http://localhost:8080/api/v1/task/?folderId=${currentFolderId.value}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param),
    })
    .then((response) => response.json())
    .then((responseData) => {
      const newTask = {
        id: responseData.id,
        description: responseData.description,
        today: responseData.today,
        folderId: responseData.folderId,
      };
      currentTasks.value.push(newTask);
    })
    .catch((error) => console.error(error));
}

function addTaskToToday(task) {
  task.today = true;
  changeTask(task);
}

function changeTask(task) {
  const changedTask = {
    description: task.description,
    today: task.today,
    folderId: task.folderId
  };
  fetch(`http://localhost:8080/api/v1/task/${task.id}?folderId=${task.folderId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changedTask),
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

function deleteTask(task) {
  fetch(`http://localhost:8080/api/v1/task/${task.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
  deleteFromCurrentTaskList(task);
  deleteFromAllTaskList(task);
}

function deleteFromCurrentTaskList(task) {
  const indexToDelete = currentTasks.value.findIndex(
    (item) => item.id === task.id
  );
  if (indexToDelete !== -1) currentTasks.value.splice(indexToDelete, 1);
}

function deleteFromAllTaskList(task) {
  const indexToDelete = allTasks.value.findIndex(
    (item) => item.id === task.id
  );
  if (indexToDelete !== -1) allTasks.value.splice(indexToDelete, 1);
}
//Task Methods\\


//Drawer Methods\\
function toggleLeftDraw() {
  leftDraw.value = !leftDraw.value;
}

function toggleRightDraw() {
  rightDraw.value = !rightDraw.value;
}
//Drawer Methods\\
</script>
<!-- //Script\\ -->

<!-- //CSS\\ -->
<style scoped>

/* TodoList Layout */
#mainContainer {
  margin-top: 5%;
  margin-left: 15%;
  margin-right: 15%;
  min-height: 450px;

  border: solid;
  display: flex;
  flex-direction: row;
  border-color: rgb(0, 0, 0);
  border-width: 3px;
  border-radius: 25px;

  box-shadow: 0px 0px 45px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.topBar {
  display: flex;
  justify-content: center;
  align-items: center;
}

h5 {
  text-align: center;
  margin-bottom: 2%;
}

p {
  font-size: 18px;
  margin: 0%;
}
/* TodoList layout */


/* LeftDraw */
#leftDraw {
  display: flex;
  flex-direction: column;

  background-color: #01377d;

  border-right-style: solid;
  border-right-width: 1px;

  box-shadow: 0px 0px 12px #292929;
}

#folderList {
  height: auto;
}

.foldersButton {
  background-color: #7ed348;

  border: solid;
  border-color: black;
  border-width: 1px;
  border-radius: 10px;
}

#leftDrawFooter {
  margin: 7%;
  margin-top: auto;

  display: flex;
  justify-content: center;
}

.textInputField {
  color: white;
}
/* LeftDraw */


/* MiddleDraw */
.hideButton {
  font-size: 10px;
  max-height: 10px;
  max-width: 8px;
}

#middleDraw {
  display: flex;
  flex-direction: column;

  align-items: center;
  height: auto;
  flex: 1;
}

#taskList {
  height: auto;
}

#taskBox {
  display: flex;
  flex-direction: row;
}

#middleDrawFooter {
  margin-bottom: 7%;
  margin-top: auto;
  display: flex;
  justify-content: center;
}

#middleTextInputField {
  width: 3000px;
}
/* MiddleDraw */


/* RightDraw */
#rightDraw {
  background-color: #009dd1;

  max-width: 350px;
  min-width: 200px;
  width: auto;

  border-left-style: solid;
  border-left-width: 1px;

  box-shadow: 0px 0px 12px #292929;
}

#taskTextVorschlag {
  color: white;
}
/* RightDraw */

</style>
<!-- //CSS\\ -->
