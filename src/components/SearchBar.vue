<template>
  <div class="mb-4 w-full">
    <div class="flex space-x-2 mb-4">
      <input v-for="field in fields" :key="field" v-model="searchQuery[field]" 
        :placeholder="placeholders[field]" 
        class="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
      <button class="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md">🔍</button>
    </div>
    <ul class="bg-white shadow-md rounded-lg overflow-hidden">
      <li v-for="(result, index) in filteredResults" :key="index" class="p-2 border-b last:border-none">
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    fields: Array
  },
  data() {
    return {
      searchQuery: {},
      results: ["Ergebnis 1", "Ergebnis 2", "Ergebnis 3"]
    }
  },
  computed: {
    placeholders() {
      return {
        id: "ID eingeben",
        name: "Name eingeben",
        dob: "Geburtsdatum eingeben",
        date: "Messdatum eingeben"
      }
    },
    filteredResults() {
      return this.results.filter(r => {
        return Object.values(this.searchQuery).some(query => 
          query && r.toLowerCase().includes(query.toLowerCase())
        )
      })
    }
  }
}
</script>
