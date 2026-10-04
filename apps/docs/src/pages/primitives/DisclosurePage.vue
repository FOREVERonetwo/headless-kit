<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import SlotTable from '../../components/SlotTable.vue'
import DisclosureBasic from '../../examples/DisclosureBasic.vue'
import DisclosureControlled from '../../examples/DisclosureControlled.vue'
import basicSource from '../../examples/DisclosureBasic.vue?raw'
import controlledSource from '../../examples/DisclosureControlled.vue?raw'

const rootProps = [
  {
    name: 'open',
    type: 'boolean',
    default: 'undefined',
    description: 'Controlled open state. Pair with v-model:open.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Initial open state when uncontrolled.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks all interaction.' },
]

const rootEvents = [
  {
    name: 'update:open',
    params: '[boolean]',
    description: 'Fires whenever the open state changes.',
  },
  { name: 'toggle', params: '[boolean]', description: 'Convenience event with the new state.' },
]

const rootSlots = [
  { name: 'open', type: 'boolean', description: 'Current open state.' },
  { name: 'disabled', type: 'boolean', description: 'Whether interaction is blocked.' },
  { name: 'toggle', type: '() => void', description: 'Flips the open state.' },
  { name: 'setOpen', type: '(value: boolean) => void', description: 'Sets an explicit value.' },
]

const triggerSlots = [
  {
    name: 'props',
    type: 'object',
    description:
      'id, type, aria-expanded, aria-controls, aria-disabled, data-state, disabled, onClick.',
  },
  { name: 'open', type: 'boolean', description: 'Current open state.' },
]

const contentSlots = [
  {
    name: 'props',
    type: 'object',
    description: 'id, role="region", aria-labelledby, data-state.',
  },
  { name: 'open', type: 'boolean', description: 'Current open state.' },
  { name: 'state', type: '"mounted" | "unmounting" | "unmounted"', description: 'Presence state.' },
  { name: 'isPresent', type: 'boolean', description: 'True while entering or mounted.' },
  {
    name: 'onAfterLeave',
    type: '() => void',
    description: 'Forward to <Transition @after-leave>.',
  },
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Primitive</p>
    <h1>Disclosure</h1>
    <p class="hk-lead">
      A show/hide widget. The smallest primitive in the kit and the reference for how every other
      part is shaped.
    </p>

    <h2>Usage</h2>
    <DemoBlock title="Basic" :source="basicSource">
      <DisclosureBasic />
    </DemoBlock>

    <DemoBlock title="Controlled" :source="controlledSource">
      <DisclosureControlled />
    </DemoBlock>

    <h2>Accessibility</h2>
    <ul>
      <li>
        The trigger is a button with <code>aria-expanded</code> and <code>aria-controls</code>.
      </li>
      <li>The content is a <code>region</code> labelled by the trigger.</li>
      <li>Ids are generated per instance, so multiple disclosures on one page never collide.</li>
    </ul>

    <h2>API</h2>
    <h3>DisclosureRoot</h3>
    <PropTable :rows="rootProps" />
    <h3>Events</h3>
    <PropTable :rows="rootEvents" />
    <h3>Slots</h3>
    <SlotTable :items="rootSlots" />

    <h3>DisclosureTrigger</h3>
    <SlotTable :items="triggerSlots" />

    <h3>DisclosureContent</h3>
    <SlotTable :items="contentSlots" />
  </div>
</template>
