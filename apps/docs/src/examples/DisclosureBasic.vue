<script setup>
import { DisclosureContent, DisclosureRoot, DisclosureTrigger } from '@headless-kit/vue'
</script>

<template>
  <DisclosureRoot>
    <DisclosureTrigger v-slot="{ open, props: triggerProps }">
      <button v-bind="triggerProps" class="hk-btn">
        <span>{{ open ? 'Hide' : 'Show' }} details</span>
        <span aria-hidden="true" style="margin-left: 8px">{{ open ? '▾' : '▸' }}</span>
      </button>
    </DisclosureTrigger>
    <DisclosureContent v-slot="{ props: contentProps }">
      <div v-bind="contentProps" class="hk-panel" style="margin-top: 12px">
        Every part ships the ARIA attributes and keyboard behaviour it is responsible for. You
        decide what the markup looks like.
      </div>
    </DisclosureContent>
  </DisclosureRoot>
</template>
