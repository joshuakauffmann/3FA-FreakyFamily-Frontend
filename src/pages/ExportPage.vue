<template>
  <div class="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4">

    <div class="p-6 rounded-lg shadow-lg w-2/3 text-center">
      <div v-if="activeTab === 'clients'">
        <h2 class="text-2xl font-semibold mb-4">Kundensuche</h2>
        <SearchBar :fields="['id', 'name', 'dob']" />
      </div>
      
      <div v-if="activeTab === 'measurements'">
        <h2 class="text-2xl font-semibold mb-4">Messungssuche</h2>
        <SearchBar :fields="['id', 'date']" />
      </div>
    </div>
    <div class="">
      <button @click="activeTab = 'clients'" :class="tabClass('clients')">Kunden</button>
      <button @click="activeTab = 'measurements'" :class="tabClass('measurements')">Messungen</button>
    </div>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'

export default {
  components: { SearchBar },
  data() {
    return {
      activeTab: 'clients',
    }
  },
  methods: {
    tabClass(tab) {
      return `px-6 py-2 text-lg font-semibold rounded-lg transition-all shadow-md 
              ${this.activeTab === tab ? 'bg-green-500 text-white' : 'bg-gray-300'}`;
    }
  }
}
</script>
