<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import PresenceBasic from '../../examples/PresenceBasic.vue'
import basicSource from '../../examples/PresenceBasic.vue?raw'

const presenceProps = [
  {
    name: 'present',
    type: 'boolean',
    default: 'false',
    description: 'Whether the content should exist.',
  },
  {
    name: 'forceMount',
    type: 'boolean',
    default: 'false',
    description: 'Keep rendering even while fully unmounted.',
  },
]

const presenceSlots = [
  {
    name: 'state',
    type: '"mounted" | "unmounting" | "unmounted"',
    description: 'Expose this as data-state to drive CSS.',
  },
  { name: 'present', type: 'boolean', description: 'The raw prop.' },
  { name: 'isPresent', type: 'boolean', description: 'True while entering or fully mounted.' },
  {
    name: 'onAfterLeave',
    type: '() => void',
    description: 'Call from <Transition @after-leave> to release the node.',
  },
]

const portalProps = [
  {
    name: 'to',
    type: 'string | Element | (() => Element)',
    default: 'document.body',
    description: 'Teleport target, resolved on mount.',
  },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Render inline instead.' },
  {
    name: 'defer',
    type: 'boolean',
    default: 'true',
    description: 'Resolve the target after mounting.',
  },
]

const visuallyHiddenProps = [
  {
    name: 'as',
    type: 'string | Component',
    default: '"span"',
    description: 'Element or component rendered by this part.',
  },
  {
    name: 'feature',
    type: '"focusable" | "not-intractable"',
    default: '"not-intractable"',
    description: 'focusable keeps the node on screen for screen readers that move focus.',
  },
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Utility</p>
    <h1>Presence &amp; Portal</h1>
    <p class="hk-lead">
      The two infrastructure parts every overlay is built on. Both are exported so you can reuse
      them for your own components.
    </p>

    <h2>Presence</h2>
    <p>
      Presence keeps a node mounted while it exits, so Vue <code>&lt;Transition&gt;</code> has
      something to animate. When no CSS animation is running it releases the node after two
      animation frames, which keeps uncontrolled usage leak-free.
    </p>

    <DemoBlock title="Presence state" :source="basicSource">
      <PresenceBasic />
    </DemoBlock>

    <h3>Props</h3>
    <PropTable :rows="presenceProps" />
    <h3>Slot props</h3>
    <table class="hk-table">
      <thead>
        <tr>
          <th>Slot prop</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in presenceSlots" :key="row.name">
          <td>
            <code>{{ row.name }}</code>
          </td>
          <td>
            <code>{{ row.type }}</code>
          </td>
          <td>{{ row.description }}</td>
        </tr>
      </tbody>
    </table>

    <h2>Portal</h2>
    <p>
      Teleports its subtree to a target resolved on mount. Because the target is empty during server
      rendering, the content is rendered inline on the server and moved on the client.
    </p>
    <PropTable :rows="portalProps" />

    <h2>VisuallyHidden</h2>
    <p>
      Hides content visually while keeping it available to assistive technology. Use
      <code>feature="focusable"</code> when the node itself must remain focusable.
    </p>
    <PropTable :rows="visuallyHiddenProps" />
  </div>
</template>
