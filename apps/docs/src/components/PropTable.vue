<script setup>
defineProps({
  rows: { type: Array, required: true },
})
</script>

<template>
  <table class="hk-table">
    <thead>
      <tr>
        <th>Prop</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.name">
        <td>
          <code>{{ row.name }}</code>
        </td>
        <td>
          <code>{{ row.type }}</code>
        </td>
        <td>
          <code>{{ row.default ?? '—' }}</code>
        </td>
        <td>{{ row.description }}</td>
      </tr>
    </tbody>
  </table>
</template>
