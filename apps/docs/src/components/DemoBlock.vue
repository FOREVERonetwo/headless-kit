<script setup>
defineProps({
  title: { type: String, required: true },
  source: { type: String, default: '' },
  align: { type: String, default: 'start' },
})
</script>

<template>
  <section class="hk-demo">
    <header class="hk-demo-title">{{ title }}</header>
    <div class="hk-demo-preview" :style="align === 'center' ? 'justify-content: center' : null">
      <slot />
    </div>
    <pre v-if="source" class="hk-code"><code>{{ source }}</code></pre>
  </section>
</template>
