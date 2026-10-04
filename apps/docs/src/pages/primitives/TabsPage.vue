<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import SlotTable from '../../components/SlotTable.vue'
import TabsBasic from '../../examples/TabsBasic.vue'
import basicSource from '../../examples/TabsBasic.vue?raw'

const rootProps = [
  { name: 'modelValue', type: 'string | number', default: 'undefined', description: 'Active tab.' },
  {
    name: 'defaultValue',
    type: 'string | number',
    default: 'undefined',
    description: 'Initial tab when uncontrolled.',
  },
  {
    name: 'orientation',
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: 'Decides which arrow keys navigate the list.',
  },
  {
    name: 'activationMode',
    type: '"automatic" | "manual"',
    default: '"automatic"',
    description: 'Select on focus, or wait for Enter / Space.',
  },
  { name: 'dir', type: 'string', default: '"ltr"', description: 'Reading direction.' },
]

const triggerProps = [
  { name: 'value', type: 'string | number', default: 'required', description: 'Tab identity.' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Removes the tab from keyboard navigation.',
  },
]

const listSlots = [
  {
    name: 'props',
    type: 'object',
    description: 'role="tablist", aria-orientation, data-orientation and the roving-focus ref.',
  },
]

const triggerSlots = [
  {
    name: 'props',
    type: 'object',
    description:
      'role="tab", aria-selected, aria-controls, data-state, tabindex, onClick, onKeydown.',
  },
  { name: 'selected', type: 'boolean', description: 'Whether this tab is active.' },
  { name: 'focused', type: 'boolean', description: 'Whether this tab owns the roving tab stop.' },
]

const contentSlots = [
  {
    name: 'props',
    type: 'object',
    description: 'role="tabpanel", id, aria-labelledby, data-state, tabindex.',
  },
  { name: 'selected', type: 'boolean', description: 'Whether this panel is active.' },
]

const keyboard = [
  ['ArrowRight / ArrowLeft', 'Horizontal navigation'],
  ['ArrowDown / ArrowUp', 'Vertical navigation'],
  ['Home / End', 'First / last tab'],
  ['Enter / Space', 'Activate in manual mode'],
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Primitive</p>
    <h1>Tabs</h1>
    <p class="hk-lead">
      Roving tabindex over a list of triggers, with the automatic and manual activation patterns
      from the WAI-ARIA authoring practices.
    </p>

    <h2>Usage</h2>
    <DemoBlock title="Automatic activation" :source="basicSource">
      <TabsBasic style="width: 100%; max-width: 460px" />
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
    <h3>TabsRoot</h3>
    <PropTable :rows="rootProps" />
    <h3>TabsList</h3>
    <SlotTable :items="listSlots" />
    <h3>TabsTrigger</h3>
    <PropTable :rows="triggerProps" />
    <SlotTable :items="triggerSlots" />
    <h3>TabsContent</h3>
    <PropTable
      :rows="[
        {
          name: 'forceMount',
          type: 'boolean',
          default: 'false',
          description: 'Keep the panel mounted while inactive.',
        },
      ]"
    />
    <SlotTable :items="contentSlots" />
  </div>
</template>
