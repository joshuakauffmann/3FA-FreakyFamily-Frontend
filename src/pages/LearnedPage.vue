<!-- //HTML\\ -->
<template>
  <h2 class="secondaryTopBar">What I Know</h2>

  <!-- Upper Buttons -->
  <q-tabs align-items="left">
    <q-route-tab
      label="Vue / Quasar"
      class="routeItems"
      @click="openPage('Vue')"
    />
    <q-route-tab
      label="HTML / CSS"
      class="routeItems"
      @click="openPage('CSS')"
    />
    <q-route-tab
      label="Spring Boot"
      class="routeItems"
      @click="openPage('SpringBoot')"
    />
  </q-tabs>
  <!-- Upper Buttons -->

  <!-- Content of Pages -->
  <div>
    <div v-if="page === 'Vue'">
      <div class="infobox">
          <h4>VUE / QUASAR</h4>
          <h5>Was genau ist Vue?</h5>
          <p>
            Vue ist ein JavaScript-Framework, das verwendet wird, um
            Benutzeroberflächen zu erstellen. Es baut auf standardmäßigem HTML,
            CSS und JavaScript auf. Es ermöglicht, Benutzeroberflächen effizient
            zu entwickeln.
          </p>
          <br />
          <p>
            Mit Vue kann man schnell und einfach interaktive Webanwendungen
            erstellen, die reaktionsfähig und benutzerfreundlich sind.
          </p>
          <h5>Was genau ist Quasar?</h5>
          <p>
            Quasar ist ein UI Framework, das auf Vue.js basiert und entwickelt
            wurde, um die Entwicklung von modernen, responsiven und
            benutzerfreundlichen Webanwendungen zu vereinfachen. Es bietet
            vorgefertigte Komponenten, Layouts und Tools, um schnell
            ansprechende Benutzeroberflächen zu erstellen.
          </p>
          <br />
          <p>
            Insgesamt vereinfacht Quasar die Entwicklung von Webanwendungen mit
            Vue.js und ermöglicht Entwicklern, sich auf die Umsetzung kreativer
            Ideen und Funktionen zu konzentrieren.
          </p>
          <h5>Hier kommen noch nützliche Funktionen</h5>
          <a href="//vuejs.org/tutorial/#step-7"> Tutorials</a>
          <h5>Wie Erstelle ich ein VUE/Quasar Projekt</h5>

          <p>...</p>
      </div>
    </div>
    <div v-else-if="page === 'CSS'">
      <div class="infobox">
          <h4>HTML / CSS</h4>
      </div>
    </div>
    <div v-else-if="page === 'SpringBoot'">
      <div class="infobox">
          <h4>Spring Boot</h4>
      </div>
    </div>
  </div>
  <!-- Content of Pages -->

  <q-page-container>
    <router-view />
  </q-page-container>
</template>
<!-- //HTML\\ -->

<!-- //Script\\ -->
<script setup>
import { ref } from "vue";
const page = ref();
function openPage(string) {
  page.value = string;
}
</script>
<!-- //Script\\ -->

<!-- //CSS\\ -->
<style scoped>
.routeItems {
  margin-left: 2%;
  margin-right: 2%;
}

.infobox {
  display: flex;
  flex-direction: column;
  align-items: center;     
  padding-right: 10%;
  padding-left: 10%;
}
</style>
<!-- //CSS\\ -->
