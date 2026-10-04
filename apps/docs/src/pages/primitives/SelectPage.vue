<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import SlotTable from '../../components/SlotTable.vue'
import SelectBasic from '../../examples/SelectBasic.vue'
import basicSource from '../../examples/SelectBasic.vue?raw'

const rootProps = [
  { name: 'modelValue', type: 'any', default: 'undefined', description: 'Selected value.' },
  { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger.' },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: 'Marks the hidden input required.',
  },
  { name: 'name', type: 'string', default: 'undefined', description: 'Hidden input field name.' },
  {
    name: 'placement',
    type: 'string',
    default: '"bottom"',
    description: 'Preferred side for the listbox.',
  },
  { name: 'offset', type: 'number', default: '4', description: 'Main-axis offset.' },
]

const itemProps = [
  {
    name: 'value',
    type: 'string | number | object',
    default: 'required',
    description: 'Option value.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Skips the option when selecting.',
  },
  {
    name: 'textValue',
    type: 'string',
    default: 'undefined',
    description: 'Label used for the trigger before the list is opened.',
  },
]

const itemSlots = [
  {
    name: 'props',
    type: 'object',
    description:
      'id, role="option", aria-selected, aria-disabled, data-state, data-highlighted, onClick, onMousemove.',
  },
  { name: 'selected', type: 'boolean', description: 'Whether this option is selected.' },
  {
    name: 'highlighted',
    type: 'boolean',
    description: 'Whether this option is the active descendant.',
  },
  {
    name: 'setText',
    type: '(value: string) => void',
    description: 'Register a runtime label for the trigger.',
  },
]

const valueSlots = [
  { name: 'value', type: 'string', description: 'Resolved label of the selected option.' },
  { name: 'selected', type: 'any', description: 'Raw selected value.' },
  { name: 'hasSelection', type: 'boolean', description: 'False while the placeholder is shown.' },
]

const keyboard = [
  ['Enter / Space / ArrowDown / ArrowUp', 'Open the listbox'],
  ['ArrowDown / ArrowUp', 'Move the active descendant'],
  ['Home / End', 'First / last option'],
  ['a–z', 'Typeahead; repeated letters cycle through matches'],
  ['Tab', 'Close and keep focus on the trigger'],
  ['Escape', 'Close without selecting'],
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Primitive</p>
    <h1>Select</h1>
    <p class="hk-lead">
      A single-select listbox with typeahead and <code>aria-activedescendant</code>. Options are
      collected from the slot's vnode tree, so the trigger can display the selected label before the
      list has ever been mounted.
    </p>

    <h2>Usage</h2>
    <DemoBlock title="Framework picker" :source="basicSource" align="center">
      <SelectBasic />
    </DemoBlock>

    <h2>Keyboard</h2>
    <table class="hk-table">
      <thead>
        <tr>
          <th>Key</th>
          <th>Behaviour</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in keyboard" :key="row[0]">
          <td>
            <code>{{ row[0] }}</code>
          </td>
          <td>{{ row[1] }}</td>
        </tr>
      </tbody>
    </table>

    <div class="hk-callout">
      Render <code>SelectHiddenInput</code> to submit the value with a plain HTML form. Option
      labels are static metadata, so options declared inside another component's slot are not
      discovered — keep the <code>v-for</code> in the same template as <code>SelectContent</code>.
    </div>

    <h2>API</h2>
    <h3>SelectRoot</h3>
    <PropTable :rows="rootProps" />
    <h3>SelectItem</h3>
    <PropTable :rows="itemProps" />
    <SlotTable :items="itemSlots" />
    <h3>SelectValue</h3>
    <SlotTable :items="valueSlots" />
    <h3>Other parts</h3>
    <ul>
      <li><code>SelectTrigger</code> — button with <code>role="combobox"</code>.</li>
      <li><code>SelectContent</code> — listbox with positioning and key handling.</li>
      <li><code>SelectIcon</code> — decorative slot wrapper.</li>
      <li><code>SelectItemText</code> — pass-through wrapper for the label markup.</li>
      <li><code>SelectPortal</code> / <code>SelectHiddenInput</code>.</li>
    </ul>
  </div>
</template>
