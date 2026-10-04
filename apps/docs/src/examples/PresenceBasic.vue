<script setup>
import { Presence, VisuallyHidden } from '@headless-kit/vue'
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <div style="display: grid; gap: 12px; justify-items: start">
    <button class="hk-btn" @click="open = !open">Toggle</button>
    <Presence v-slot="{ state }" :present="open">
      <div class="hk-panel" style="max-width: 300px; padding: 12px 14px" :data-state="state">
        Rendered while <code>present</code> is true. Presence also keeps the node around for two
        frames so exit transitions can finish.
      </div>
    </Presence>
    <VisuallyHidden>Screen-reader-only text.</VisuallyHidden>
  </div>
</template>
