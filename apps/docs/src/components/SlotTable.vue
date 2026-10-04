<script setup>
defineProps({
  items: { type: Array, required: true },
})
</script>

<template>
  <table class="hk-table">
    <thead>
      <tr>
        <th>Slot prop</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in items" :key="row.name">
        <td>
          <code>{{ row.name }}</code>
        </td>
        <td>
          <code>{{ row.type }}</code>
        </td>
        <td>{{ row.description }}</td>
      </tr>
    </tbody>
  </table>
</template>
