<script setup>
import { ref } from 'vue'
import {
  SelectContent,
  SelectHiddenInput,
  SelectItem,
  SelectItemText,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '@headless-kit/vue'

const frameworks = ['Vue', 'Svelte', 'Solid', 'Angular', 'Qwik']
const framework = ref('Vue')
</script>

<template>
  <SelectRoot v-model="framework" name="framework">
    <SelectTrigger v-slot="{ props: triggerProps }">
      <button v-bind="triggerProps" class="hk-field">
        <SelectValue v-slot="{ value, placeholder }" placeholder="Pick a framework">
          <span style="color: var(--hk-muted)">{{ value || placeholder }}</span>
        </SelectValue>
        <span aria-hidden="true">▾</span>
      </button>
    </SelectTrigger>

    <SelectContent v-slot="{ props: contentProps }">
      <div v-bind="contentProps" class="hk-listbox hk-panel">
        <SelectItem
          v-for="option in frameworks"
          :key="option"
          v-slot="{ props: itemProps, selected }"
          :value="option"
        >
          <div v-bind="itemProps" class="hk-option">
            <SelectItemText v-slot="{ attrs: textAttrs }">
              <span v-bind="textAttrs">{{ option }}</span>
            </SelectItemText>
            <span v-if="selected" aria-hidden="true">✓</span>
          </div>
        </SelectItem>
      </div>
    </SelectContent>

    <SelectHiddenInput />
  </SelectRoot>
</template>
