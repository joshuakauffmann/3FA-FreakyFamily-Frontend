<template>
  <q-page class="q-pa-md">
    <h2 class="secondaryTopBar">Import</h2>

    <div id="Introduction">
      <q-card class="q-pa-lg form-card primaryStyle">
        <q-card-section>
          <div class="text-h5 text-white">Neuen Kunden importieren</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="submitForm">
            <q-input
              v-model="customer.firstName"
              label="Vorname"
              filled
              class="q-mb-md input-large primaryInput"
              :rules="[(val) => !!val || 'Vorname ist erforderlich']"
            />
            <q-input
              v-model="customer.lastName"
              label="Nachname"
              filled
              class="q-mb-md input-large primaryInput"
              :rules="[(val) => !!val || 'Nachname ist erforderlich']"
            />
            <q-select
              v-model="customer.gender"
              :options="genderOptions"
              label="Geschlecht"
              filled
              class="q-mb-md input-large primaryInput"
              emit-value
              map-options
              :rules="[(val) => !!val || 'Geschlecht auswählen']"
            />
            <q-input
              v-model="customer.birthDate"
              label="Geburtsdatum"
              type="date"
              filled
              class="q-mb-md input-large primaryInput"
              :rules="[(val) => !!val || 'Geburtsdatum ist erforderlich']"
            />

            <q-btn
              label="Importieren"
              type="submit"
              color="primary"
              class="full-width q-mt-md btn-large"
              :loading="loading"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const $q = useQuasar();
const loading = ref(false);

const customer = ref({
  firstName: "",
  lastName: "",
  gender: null,
  birthDate: "",
});

const genderOptions = [
  { label: "Männlich", value: "M" },
  { label: "Weiblich", value: "W" },
  { label: "Divers", value: "D" },
  { label: "Unbekannt", value: "U" },
];

const submitForm = async () => {
  loading.value = true;

  try {
    await axios.post("http://localhost:8080/customers", customer.value);
    $q.notify({
      type: "positive",
      message: "Kunde erfolgreich importiert!",
    });

    customer.value = {
      firstName: "",
      lastName: "",
      gender: null,
      birthDate: "",
    };
  } catch (error) {
    console.error("Fehler beim Importieren:", error);

    let errorMessage = "Fehler beim Importieren des Kunden!";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage;
    }

    $q.notify({
      type: "negative",
      message: errorMessage,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
#Introduction {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.form-card {
  max-width: 600px; /* Breitere Form für besseren Platz */
  width: 100%;
  padding: 20px;
  background-color: #01377d; /* Primary Color */
  border-radius: 10px;
  border: 2px solid #000000;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
}

.input-large {
  font-size: 18px; /* Größere Schrift für bessere Lesbarkeit */
}

.btn-large {
  font-size: 18px;
  height: 50px; /* Größerer Button für besseren Look */
}

.secondaryTopBar {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px; /* Größere Überschrift */
}

.primaryInput {
  background: #ffffff;
  color: #292929;
}
</style>
