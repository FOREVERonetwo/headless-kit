<script setup>
import { navigation } from '../router.js'
</script>

<template>
  <aside class="hk-sidebar">
    <RouterLink to="/" class="hk-brand">
      <span class="mark">H</span>
      <span>
        headless-kit
        <small>Vue 3 primitives</small>
      </span>
    </RouterLink>

    <div v-for="group in navigation" :key="group.title" class="hk-nav-group">
      <h4>{{ group.title }}</h4>
      <RouterLink v-for="link in group.links" :key="link.to" :to="link.to">
        {{ link.label }}
      </RouterLink>
    </div>
  </aside>
</template>
