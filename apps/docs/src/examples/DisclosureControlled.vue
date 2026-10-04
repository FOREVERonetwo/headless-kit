<script setup>
import { ref } from 'vue'
import { DisclosureContent, DisclosureRoot, DisclosureTrigger } from '@headless-kit/vue'

const open = ref(false)
</script>

<template>
  <DisclosureRoot v-model:open="open">
    <DisclosureTrigger v-slot="{ props: triggerProps }">
      <button v-bind="triggerProps" class="hk-btn">{{ open ? 'Hide' : 'Show' }} details</button>
    </DisclosureTrigger>
    <DisclosureContent v-slot="{ props: contentProps }">
      <div v-bind="contentProps" class="hk-panel" style="margin-top: 12px">
        <p style="margin: 0 0 8px">Controlled state keeps the panel in sync with your own store.</p>
        <button class="hk-btn" @click="open = false">Close programmatically</button>
      </div>
    </DisclosureContent>
  </DisclosureRoot>
</template>
