<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import SlotTable from '../../components/SlotTable.vue'
import SwitchForm from '../../examples/SwitchForm.vue'
import formSource from '../../examples/SwitchForm.vue?raw'

const rootProps = [
  { name: 'modelValue', type: 'boolean', default: 'undefined', description: 'Checked state.' },
  { name: 'defaultValue', type: 'boolean', default: 'false', description: 'Initial state.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks toggling.' },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: 'Marks the hidden input required.',
  },
  { name: 'name', type: 'string', default: 'undefined', description: 'Hidden input name.' },
  {
    name: 'id',
    type: 'string',
    default: 'generated',
    description: 'Id shared by input and label.',
  },
]

const rootSlots = [
  { name: 'checked', type: 'boolean', description: 'Current state.' },
  { name: 'toggle', type: '() => void', description: 'Flips the state.' },
  { name: 'state', type: '"checked" | "unchecked"', description: 'Token for data-state styling.' },
  { name: 'id', type: 'string', description: 'Generated id for the hidden input.' },
]

const rootEvents = [
  { name: 'update:modelValue', params: '[boolean]', description: 'State changes.' },
  { name: 'change', params: '[{ checked: boolean }]', description: 'Native-like change event.' },
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Primitive</p>
    <h1>Switch</h1>
    <p class="hk-lead">
      An immediate on/off control. The root hands you <code>toggle()</code> and the current state;
      you render the element that carries <code>role="switch"</code>.
    </p>

    <h2>Usage</h2>
    <DemoBlock title="Settings form" :source="formSource">
      <SwitchForm />
    </DemoBlock>

    <div class="hk-callout">
      <code>SwitchInput</code> renders a visually hidden native checkbox so plain HTML form
      submission and server-side validation keep working. It carries the <code>name</code> you set
      on the root.
    </div>

    <h2>API</h2>
    <h3>SwitchRoot</h3>
    <PropTable :rows="rootProps" />
    <h3>Events</h3>
    <PropTable :rows="rootEvents" />
    <h3>Slots</h3>
    <SlotTable :items="rootSlots" />
    <h3>SwitchThumb</h3>
    <p>
      Exposes <code>checked</code> and <code>disabled</code> so the visual thumb can track state.
    </p>
    <h3>SwitchInput</h3>
    <p>
      Hidden native input. Accepts <code>value</code> (defaults to <code>on</code>) and forwards any
      other attributes.
    </p>
  </div>
</template>
