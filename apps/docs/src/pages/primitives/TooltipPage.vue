<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import SlotTable from '../../components/SlotTable.vue'
import TooltipBasic from '../../examples/TooltipBasic.vue'
import basicSource from '../../examples/TooltipBasic.vue?raw'

const providerProps = [
  {
    name: 'delayDuration',
    type: 'number',
    default: '300',
    description: 'Delay before a tooltip opens on hover or focus.',
  },
  {
    name: 'skipDelayDuration',
    type: 'number',
    default: '300',
    description: 'Window during which sibling tooltips open instantly.',
  },
  {
    name: 'disableHoverableContent',
    type: 'boolean',
    default: 'false',
    description: 'Close the tooltip as soon as the pointer leaves the trigger.',
  },
]

const rootProps = [
  { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state.' },
  {
    name: 'delayDuration',
    type: 'number',
    default: 'undefined',
    description: 'Overrides the provider delay for this tooltip.',
  },
]

const contentProps = [
  { name: 'placement', type: 'string', default: '"top"', description: 'Preferred side.' },
  { name: 'offset', type: 'number', default: '8', description: 'Main-axis offset.' },
  { name: 'sideOffset', type: 'number', default: 'undefined', description: 'Overrides offset.' },
  {
    name: 'forceMount',
    type: 'boolean',
    default: 'false',
    description: 'Keep the content mounted while closed.',
  },
]

const triggerSlots = [
  {
    name: 'props',
    type: 'object',
    description: 'ref, id, aria-describedby, data-state, mouse and focus handlers.',
  },
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Primitive</p>
    <h1>Tooltip</h1>
    <p class="hk-lead">
      A description that appears on hover and focus. Wrap tooltips in a single
      <code>TooltipProvider</code> so moving between siblings skips the opening delay.
    </p>

    <h2>Usage</h2>
    <DemoBlock title="Grouped tooltips" :source="basicSource" align="center">
      <TooltipBasic />
    </DemoBlock>

    <div class="hk-callout">
      <code>aria-describedby</code> is only present while the tooltip is open, so assistive
      technology never points at a hidden node.
    </div>

    <h2>API</h2>
    <h3>TooltipProvider</h3>
    <PropTable :rows="providerProps" />
    <h3>TooltipRoot</h3>
    <PropTable :rows="rootProps" />
    <h3>TooltipContent</h3>
    <PropTable :rows="contentProps" />
    <h3>TooltipTrigger</h3>
    <SlotTable :items="triggerSlots" />
  </div>
</template>
