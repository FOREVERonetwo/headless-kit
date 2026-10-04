<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import { flatRoutes } from './router.js'

const route = useRoute()

const position = computed(() => {
  const index = flatRoutes.findIndex((entry) => entry.name === route.name)
  return { index, total: flatRoutes.length }
})

const previous = computed(() =>
  position.value.index > 0 ? flatRoutes[position.value.index - 1] : null,
)
const next = computed(() =>
  position.value.index >= 0 && position.value.index < flatRoutes.length - 1
    ? flatRoutes[position.value.index + 1]
    : null,
)
</script>

<template>
  <div class="hk-layout">
    <AppSidebar />
    <main class="hk-main">
      <RouterView />
      <nav v-if="previous || next" class="hk-footer-nav">
        <RouterLink v-if="previous" :to="previous.path">&larr; {{ previous.name }}</RouterLink>
        <span v-else />
        <RouterLink v-if="next" :to="next.path">{{ next.name }} &rarr;</RouterLink>
      </nav>
    </main>
  </div>
</template>
