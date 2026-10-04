<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import PresenceBasic from '../../examples/PresenceBasic.vue'
import basicSource from '../../examples/PresenceBasic.vue?raw'

const composables = [
  {
    name: 'useControllableState',
    signature: 'useControllableState({ prop, defaultProp, onChange }) => [value, isControlled]',
    description:
      'Backs every v-model in the kit. Pass a ref, a getter or a plain value as prop; the setter works in both modes and notifies through onChange.',
  },
  {
    name: 'useRovingFocus',
    signature:
      'useRovingFocus({ orientation, loop, activeId, defaultActiveId, onActiveIdChange }) => {...}',
    description:
      'One tab stop for a group of items. Returns itemProps for spreadable bindings plus containerRef for the group element.',
  },
  {
    name: 'useFocusTrap',
    signature: 'useFocusTrap(containerRef, active, { initialFocus }) => { activate, deactivate }',
    description:
      'Cycles Tab inside a container, focuses the first tabbable node on activation and restores the previously focused element on teardown.',
  },
  {
    name: 'useDismiss',
    signature: 'useDismiss(active, { onDismiss, ignore })',
    description:
      'Escape and outside-press handling backed by a global layer stack, so only the top-most overlay reacts.',
  },
  {
    name: 'useTypeahead',
    signature: 'useTypeahead({ values, onMatch, timeout }) => { handleTypeahead, resetSearch }',
    description:
      'Multi-character search with native-style cycling when the same letter is repeated.',
  },
  {
    name: 'useScrollLock',
    signature: 'useScrollLock(locked) => { isLocked }',
    description:
      'Reference counted body scroll lock that also compensates for the scrollbar width.',
  },
  {
    name: 'usePresence',
    signature: 'usePresence(present) => { state, shouldRender, completeExit }',
    description:
      'Mount / unmounting state machine that waits for running CSS animations before removing a node.',
  },
  {
    name: 'usePortal',
    signature: 'usePortal(target) => host',
    description: 'Resolves a teleport target on mount so SSR renders inline markup.',
  },
  {
    name: 'useEventListener',
    signature: 'useEventListener(target, events, handler, options) => stop',
    description:
      'Attaches listeners to a reactive target and detaches automatically when the scope is disposed.',
  },
  {
    name: 'createContext',
    signature: 'createContext(name, { optional }) => [provideContext, useContext]',
    description:
      'Typed provide / inject pair. useContext throws a message naming the component when the provider is missing.',
  },
]

const positionRows = [
  {
    name: 'placement',
    type: 'string',
    default: '"bottom"',
    description: 'Side plus optional -start / -end alignment.',
  },
  { name: 'offset', type: 'number', default: '8', description: 'Main-axis gap in pixels.' },
  {
    name: 'padding',
    type: 'number',
    default: '8',
    description: 'Viewport padding used when flipping and clamping.',
  },
  {
    name: 'arrowSize',
    type: 'number',
    default: '8',
    description: 'Assumed arrow size when clamping its offset.',
  },
]

const positionReturn = [
  { name: 'x / y', type: 'number', description: 'Viewport coordinates for position: fixed.' },
  { name: 'side', type: 'string', description: 'Resolved side after flipping.' },
  { name: 'align', type: 'string', description: 'Resolved cross-axis alignment.' },
  {
    name: 'arrowX / arrowY',
    type: 'number',
    description: 'Clamped arrow offset inside the content box.',
  },
  { name: 'ready', type: 'boolean', description: 'False until both elements have been measured.' },
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Utility</p>
    <h1>Composables</h1>
    <p class="hk-lead">
      Every behaviour the primitives use is a plain composable. Import them directly when the
      primitives do not fit your markup but the behaviour still does.
    </p>

    <DemoBlock title="Presence + VisuallyHidden" :source="basicSource">
      <PresenceBasic />
    </DemoBlock>

    <h2>Available composables</h2>
    <table class="hk-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Signature</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in composables" :key="entry.name">
          <td>
            <code>{{ entry.name }}</code>
          </td>
          <td>
            <code>{{ entry.signature }}</code>
          </td>
          <td>{{ entry.description }}</td>
        </tr>
      </tbody>
    </table>

    <h2>Positioning</h2>
    <p>
      <code>computePosition(reference, floating, options)</code> is a pure function: give it two
      elements and it returns coordinates. <code>usePosition</code> wraps it with resize and scroll
      listeners.
    </p>
    <PropTable :rows="positionRows" />
    <table class="hk-table">
      <thead>
        <tr>
          <th>Returned field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in positionReturn" :key="row.name">
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

    <h2>Example: a custom toolbar</h2>
    <pre class="hk-code"><code>import { useRovingFocus } from '@headless-kit/vue'

const roving = useRovingFocus({ orientation: 'horizontal', loop: true })

// in the template
// &lt;div :ref="roving.containerRef" role="toolbar" @keydown="roving.onKeydown"&gt;
//   &lt;button
//     v-for="item in items"
//     :key="item.id"
//     v-bind="roving.itemProps(item.id)"
//     @click="item.run()"
//   &gt;
//     {{ item.label }}
//   &lt;/button&gt;
// &lt;/div&gt;</code></pre>
  </div>
</template>
