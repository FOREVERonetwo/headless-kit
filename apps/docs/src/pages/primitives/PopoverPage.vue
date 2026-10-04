<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import SlotTable from '../../components/SlotTable.vue'
import PopoverBasic from '../../examples/PopoverBasic.vue'
import basicSource from '../../examples/PopoverBasic.vue?raw'

const rootProps = [
  { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state.' },
  {
    name: 'placement',
    type: 'string',
    default: '"bottom"',
    description: 'top | right | bottom | left, optionally suffixed with -start or -end.',
  },
  {
    name: 'offset',
    type: 'number',
    default: '8',
    description: 'Distance in pixels between trigger and content.',
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    default: 'true',
    description: 'Dismiss on Escape.',
  },
  {
    name: 'closeOnOutsideClick',
    type: 'boolean',
    default: 'true',
    description: 'Dismiss on an outside press.',
  },
]

const contentProps = [
  {
    name: 'placement',
    type: '"top" | "right" | "bottom" | "left"',
    default: '"bottom"',
    description: 'Preferred side for this content.',
  },
  {
    name: 'offset',
    type: 'number',
    default: '8',
    description: 'Main-axis offset.',
  },
  {
    name: 'sideOffset',
    type: 'number',
    default: 'undefined',
    description: 'Overrides offset when provided.',
  },
]

const contentSlots = [
  {
    name: 'props',
    type: 'object',
    description:
      'ref, id, role="dialog", tabindex="-1", data-state, data-side, data-align, fixed position, onKeydown.',
  },
  { name: 'position', type: 'object', description: 'x, y, side, align, arrowX, arrowY.' },
  { name: 'onAfterLeave', type: '() => void', description: 'Forward to <Transition>.' },
]

const arrowSlots = [
  {
    name: 'props',
    type: 'object',
    description: 'Absolute position inside the content plus data-side.',
  },
  { name: 'position', type: 'object', description: 'Resolved coordinates.' },
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Primitive</p>
    <h1>Popover</h1>
    <p class="hk-lead">
      A non-modal overlay anchored to its trigger. Positioning is dependency free: the library
      measures both boxes, flips to the opposite side when there is not enough room, and clamps the
      cross axis inside the viewport.
    </p>

    <h2>Usage</h2>
    <DemoBlock title="Deployment status" :source="basicSource" align="center">
      <PopoverBasic />
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
        <tr>
          <td><code>Enter / Space</code></td>
          <td>Toggle the popover</td>
        </tr>
        <tr>
          <td><code>ArrowDown / ArrowUp</code></td>
          <td>Move focus into the content</td>
        </tr>
        <tr>
          <td><code>Escape</code></td>
          <td>Close and return focus to the trigger</td>
        </tr>
      </tbody>
    </table>

    <h2>API</h2>
    <h3>PopoverRoot</h3>
    <PropTable :rows="rootProps" />
    <h3>PopoverContent</h3>
    <PropTable :rows="contentProps" />
    <SlotTable :items="contentSlots" />
    <h3>PopoverArrow</h3>
    <SlotTable :items="arrowSlots" />
  </div>
</template>
