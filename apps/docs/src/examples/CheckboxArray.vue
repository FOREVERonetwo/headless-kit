<script setup>
import { ref } from 'vue'
import { CheckboxIndicator, CheckboxInput, CheckboxRoot } from '@headless-kit/vue'

const topics = ref(['composition', 'typescript'])
</script>

<template>
  <div style="display: grid; gap: 8px">
    <label
      v-for="topic in ['composition', 'typescript', 'testing']"
      :key="topic"
      style="
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        text-transform: capitalize;
      "
    >
      <CheckboxRoot :model-value="topics" :value="topic" @update:model-value="topics = $event">
        <template #default="{ state, toggle }">
          <span
            role="checkbox"
            tabindex="0"
            class="hk-checkbox"
            :data-state="state"
            :aria-checked="state === 'checked'"
            :aria-label="topic"
            @click="toggle"
            @keydown.enter.prevent="toggle"
            @keydown.space.prevent="toggle"
          >
            <CheckboxIndicator v-slot="{ state: indicatorState }">
              <span v-if="indicatorState === 'checked'" aria-hidden="true">✓</span>
              <span v-else aria-hidden="true">–</span>
            </CheckboxIndicator>
          </span>
          <CheckboxInput :value="topic" />
        </template>
      </CheckboxRoot>
      {{ topic }}
    </label>
    <p style="margin: 4px 0 0; font-size: 13px; color: var(--hk-muted)">
      selected: {{ topics.join(', ') || 'none' }}
    </p>
  </div>
</template>
