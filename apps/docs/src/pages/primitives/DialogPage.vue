<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import PropTable from '../../components/PropTable.vue'
import SlotTable from '../../components/SlotTable.vue'
import DialogBasic from '../../examples/DialogBasic.vue'
import DialogFormFocus from '../../examples/DialogFormFocus.vue'
import basicSource from '../../examples/DialogBasic.vue?raw'
import formSource from '../../examples/DialogFormFocus.vue?raw'

const rootProps = [
  { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state.' },
  {
    name: 'modal',
    type: 'boolean',
    default: 'true',
    description: 'Traps focus and locks body scroll while open.',
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
    description: 'Dismiss when pressing outside the content.',
  },
]

const contentProps = [
  {
    name: 'initialFocus',
    type: 'string | HTMLElement | (() => HTMLElement)',
    default: 'undefined',
    description: 'Overrides the element that receives focus on open.',
  },
  {
    name: 'forceMount',
    type: 'boolean',
    default: 'false',
    description: 'Keep the subtree mounted while closed.',
  },
]

const contentSlots = [
  {
    name: 'props',
    type: 'object',
    description:
      'ref, id, role="dialog", tabindex="-1", aria-modal, aria-labelledby, aria-describedby, data-state.',
  },
  { name: 'open', type: 'boolean', description: 'Current open state.' },
  { name: 'onAfterLeave', type: '() => void', description: 'Forward to <Transition>.' },
]

const keyboard = [
  ['Tab / Shift+Tab', 'Cycle focus inside the content'],
  ['Escape', 'Close the top-most layer only'],
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Primitive</p>
    <h1>Dialog</h1>
    <p class="hk-lead">
      A modal dialog with focus trapping, scroll locking, focus restoration and layered dismissal.
      Nested dialogs close one at a time because every overlay registers in a shared layer stack.
    </p>

    <h2>Usage</h2>
    <DemoBlock title="Confirmation" :source="basicSource" align="center">
      <DialogBasic />
    </DemoBlock>

    <DemoBlock title="Autofocus inside a form" :source="formSource" align="center">
      <DialogFormFocus />
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
      Add <code>data-hk-autofocus</code> to any focusable element inside the content to receive
      initial focus, or pass <code>initial-focus</code> with a selector.
    </div>

    <h2>API</h2>
    <h3>DialogRoot</h3>
    <PropTable :rows="rootProps" />
    <h3>DialogContent</h3>
    <PropTable :rows="contentProps" />
    <SlotTable :items="contentSlots" />
    <h3>Other parts</h3>
    <ul>
      <li><code>DialogTrigger</code> — button props with <code>aria-haspopup="dialog"</code>.</li>
      <li><code>DialogPortal</code> — teleports overlay and content to a target.</li>
      <li><code>DialogOverlay</code> — rendered while open, with <code>data-state</code>.</li>
      <li><code>DialogTitle</code> / <code>DialogDescription</code> — ids wired via ARIA.</li>
      <li><code>DialogClose</code> — button that closes the dialog.</li>
    </ul>
  </div>
</template>
