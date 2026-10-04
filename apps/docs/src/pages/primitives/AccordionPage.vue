<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import SlotTable from '../../components/SlotTable.vue'
import AccordionBasic from '../../examples/AccordionBasic.vue'
import basicSource from '../../examples/AccordionBasic.vue?raw'

const rootProps = [
  {
    name: 'type',
    type: '"single" | "multiple"',
    default: '"single"',
    description: 'Whether one or many items can be expanded.',
  },
  {
    name: 'collapsible',
    type: 'boolean',
    default: 'true',
    description: 'In single mode, allows closing the expanded item.',
  },
  {
    name: 'modelValue',
    type: 'string | string[]',
    default: 'undefined',
    description: 'Controlled expanded value(s).',
  },
  {
    name: 'defaultValue',
    type: 'string | string[]',
    default: 'undefined',
    description: 'Initial expanded value(s) when uncontrolled.',
  },
  {
    name: 'orientation',
    type: '"vertical" | "horizontal"',
    default: '"vertical"',
    description: 'Chooses which arrow keys move between triggers.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every item.' },
  { name: 'dir', type: 'string', default: '"ltr"', description: 'Reading direction.' },
]

const itemProps = [
  { name: 'value', type: 'string', default: 'required', description: 'Identity of the item.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this item only.' },
]

const triggerSlots = [
  {
    name: 'props',
    type: 'object',
    description: 'id, aria-expanded, aria-controls, aria-disabled, data-state, onClick, onKeydown.',
  },
  { name: 'open', type: 'boolean', description: 'Whether this item is expanded.' },
]

const contentSlots = [
  { name: 'props', type: 'object', description: 'id, role="region", aria-labelledby, data-state.' },
  { name: 'state', type: 'string', description: 'Presence state for transitions.' },
  { name: 'onAfterLeave', type: '() => void', description: 'Forward to <Transition>.' },
]

const keyboard = [
  ['Enter / Space', 'Toggle the focused item'],
  ['ArrowDown / ArrowUp', 'Move focus to the next / previous trigger'],
  ['Home / End', 'Move focus to the first / last trigger'],
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Primitive</p>
    <h1>Accordion</h1>
    <p class="hk-lead">
      A vertical stack of disclosures with shared state and arrow-key navigation between headers.
    </p>

    <h2>Usage</h2>
    <DemoBlock title="Single, collapsible" :source="basicSource">
      <AccordionBasic style="width: 100%; max-width: 460px" />
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

    <h2>API</h2>
    <h3>AccordionRoot</h3>
    <PropTable :rows="rootProps" />
    <h3>AccordionItem</h3>
    <PropTable :rows="itemProps" />
    <h3>AccordionTrigger</h3>
    <SlotTable :items="triggerSlots" />
    <h3>AccordionContent</h3>
    <SlotTable :items="contentSlots" />
    <h3>AccordionHeader</h3>
    <p>
      Optional wrapper for a heading element. Exposes <code>data-state</code> and
      <code>data-disabled</code> through its slot.
    </p>
  </div>
</template>
