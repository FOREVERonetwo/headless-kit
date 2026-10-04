<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import SlotTable from '../../components/SlotTable.vue'
import CheckboxArray from '../../examples/CheckboxArray.vue'
import arraySource from '../../examples/CheckboxArray.vue?raw'

const rootProps = [
  {
    name: 'modelValue',
    type: 'boolean | any[]',
    default: 'undefined',
    description: 'Checked state, or an array for multi-select.',
  },
  {
    name: 'defaultValue',
    type: 'boolean | any[]',
    default: 'false',
    description: 'Initial state.',
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    default: 'false',
    description: 'Renders the mixed state and clears the selection on toggle.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks toggling.' },
  {
    name: 'value',
    type: 'string',
    default: '"on"',
    description: 'Identity used when the value is an array.',
  },
  { name: 'name', type: 'string', default: 'undefined', description: 'Hidden input name.' },
]

const rootSlots = [
  { name: 'checked', type: 'boolean | any[]', description: 'Current value.' },
  {
    name: 'state',
    type: '"checked" | "unchecked" | "indeterminate"',
    description: 'Token for data-state styling.',
  },
  { name: 'toggle', type: '() => void', description: 'Toggles the checkbox.' },
]

const indicatorProps = [
  {
    name: 'forceMount',
    type: 'boolean',
    default: 'false',
    description: 'Render even while unchecked.',
  },
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Primitive</p>
    <h1>Checkbox</h1>
    <p class="hk-lead">
      A tri-state control. Passing an array as the value switches it into multi-select mode:
      toggling adds or removes <code>value</code> from the array.
    </p>

    <h2>Usage</h2>
    <DemoBlock title="Multi-select topics" :source="arraySource">
      <CheckboxArray />
    </DemoBlock>

    <h2>API</h2>
    <h3>CheckboxRoot</h3>
    <PropTable :rows="rootProps" />
    <h3>Slots</h3>
    <SlotTable :items="rootSlots" />
    <h3>CheckboxIndicator</h3>
    <PropTable :rows="indicatorProps" />
    <p>
      Renders only while checked or indeterminate. Its slot exposes
      <code>state</code>, <code>checked</code>, <code>indeterminate</code> and
      <code>disabled</code>.
    </p>
    <h3>CheckboxInput</h3>
    <p>Hidden native input that mirrors the state for form submission.</p>
  </div>
</template>
