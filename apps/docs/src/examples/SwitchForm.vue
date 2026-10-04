<script setup>
import { ref } from 'vue'
import { SwitchInput, SwitchRoot, SwitchThumb } from '@headless-kit/vue'

const settings = ref({ notifications: true, telemetry: false })

const set = (key, value) => {
  settings.value = { ...settings.value, [key]: value }
}
</script>

<template>
  <div style="display: grid; gap: 10px; width: 100%; max-width: 320px">
    <div
      v-for="(value, key) in settings"
      :key="key"
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <label :for="`switch-${key}`" style="font-size: 14px; text-transform: capitalize">
        {{ key }} <span style="color: var(--hk-muted)">({{ value }})</span>
      </label>
      <SwitchRoot
        :id="`switch-${key}`"
        :model-value="value"
        :name="key"
        @update:model-value="set(key, $event)"
      >
        <template #default="{ checked, toggle }">
          <button
            type="button"
            role="switch"
            class="hk-switch"
            :data-state="checked ? 'checked' : 'unchecked'"
            :aria-checked="checked"
            @click="toggle"
          >
            <SwitchThumb v-slot="{ checked: isChecked }">
              <span class="hk-switch-thumb" :data-state="isChecked ? 'checked' : 'unchecked'" />
            </SwitchThumb>
          </button>
          <SwitchInput :value="key" />
        </template>
      </SwitchRoot>
    </div>
  </div>
</template>
