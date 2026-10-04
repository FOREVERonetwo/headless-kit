<script setup>
import DisclosureControlled from '../examples/DisclosureControlled.vue'
import disclosureBasic from '../examples/DisclosureBasic.vue?raw'
import disclosureControlled from '../examples/DisclosureControlled.vue?raw'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <div>
    <p class="hk-eyebrow">Introduction</p>
    <h1>Getting started</h1>
    <p class="hk-lead">
      Install the package, register nothing, and compose primitives from parts. There is no plugin
      and no provider to mount.
    </p>

    <h2>Install</h2>
    <div class="hk-install">
      <span style="color: var(--hk-muted)">$</span>
      <span>npm install @headless-kit/vue</span>
    </div>
    <p>
      Vue <code>^3.3</code> is the only peer dependency. The package ships ESM, CJS and type
      declarations.
    </p>

    <h2>Anatomy of a part</h2>
    <p>
      Every part exposes its slot props. The convention is the same everywhere: a
      <code>props</code> object you spread with <code>v-bind</code>, plus a convenience
      <code>attrs</code> object that carries any attributes you passed to the part.
    </p>

    <DemoBlock title="Disclosure" :source="disclosureBasic">
      <DisclosureControlled />
    </DemoBlock>

    <h2>Controlled and uncontrolled</h2>
    <p>
      Stateful roots accept <code>:open</code> / <code>v-model:open</code> and
      <code>:model-value</code> / <code>v-model</code>. When the prop is omitted the primitive keeps
      the state internally and still emits the update event, so you can start uncontrolled and opt
      into control later without rewriting anything.
    </p>

    <DemoBlock title="Controlled disclosure" :source="disclosureControlled">
      <DisclosureControlled />
    </DemoBlock>

    <h2>Styling</h2>
    <p>
      Primitives emit <code>data-state</code> (<code>open</code>/<code>closed</code>,
      <code>checked</code>/<code>unchecked</code>, <code>active</code>/<code>inactive</code>),
      <code>data-disabled</code>, <code>data-side</code> and <code>data-highlighted</code>. Style
      from those attributes instead of tracking state in your own components.
    </p>

    <div class="hk-callout">
      Overlay primitives (<code>Dialog</code>, <code>Popover</code>, <code>Select</code>,
      <code>Tooltip</code>) render in place. Wrap their content parts in the matching
      <code>*Portal</code> component to teleport to <code>document.body</code> and escape overflow
      contexts.
    </div>

    <h2>Animations</h2>
    <p>
      Exit animations need an explicit hook. Wrap the content part in a Vue
      <code>&lt;Transition&gt;</code> and forward <code>onAfterLeave</code> from the slot props:
    </p>

    <pre class="hk-code"><code>&lt;DialogContent v-slot="{ props, onAfterLeave }"&gt;
  &lt;Transition name="fade" @after-leave="onAfterLeave"&gt;
    &lt;div v-bind="props" v-if="open" /&gt;
  &lt;/Transition&gt;
&lt;/DialogContent&gt;</code></pre>
    <p>
      Without a transition, <code>Presence</code> unmounts the node after two animation frames, so
      you never leak a detached subtree.
    </p>

    <h2>TypeScript</h2>
    <p>
      The package is authored in JavaScript and ships generated declarations. Component props are
      inferred from runtime prop definitions; composables are typed through JSDoc annotations in the
      source.
    </p>
  </div>
</template>
