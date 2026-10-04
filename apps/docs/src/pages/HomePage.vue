<script setup>
import { computed } from 'vue'
import { navigation } from '../router.js'

const primitives = computed(() =>
  navigation.find((group) => group.title === 'Primitives').links.map((link) => link.label),
)

const stats = [
  { value: '11', label: 'primitive families' },
  { value: '0 kB', label: 'runtime CSS shipped' },
  { value: '1', label: 'peer dependency (vue)' },
  { value: '91', label: 'tests in CI' },
]
</script>

<template>
  <div>
    <p class="hk-eyebrow">Unstyled · Accessible · Vue 3</p>
    <h1>headless-kit</h1>
    <p class="hk-lead">
      Behaviour and accessibility for the widgets every product needs — dialogs, popovers, selects,
      tabs, accordions — with no markup and no styles imposed on you.
    </p>

    <div class="hk-install" style="margin-top: 22px">
      <span style="color: var(--hk-muted)">$</span>
      <span>npm install @headless-kit/vue</span>
    </div>

    <h2>Why</h2>
    <p>
      Most component libraries make two promises that fight each other:
      <strong>easy to use</strong> and <strong>easy to restyle</strong>. The second one usually
      loses. headless-kit only makes the first promise, and it makes it properly — every part emits
      the ARIA attributes, ids and keyboard handling it is responsible for, then hands you a
      <code>props</code> object to spread onto whatever element you want.
    </p>

    <div class="hk-cards">
      <div v-for="item in stats" :key="item.label" class="hk-card">
        <h4>{{ item.value }}</h4>
        <p>{{ item.label }}</p>
      </div>
    </div>

    <h2>What you get</h2>
    <div class="hk-cards">
      <div class="hk-card">
        <h4>Correct by default</h4>
        <p>
          Focus trapping, focus restoration, roving tabindex, typeahead and Escape/outside-press
          dismissal are implemented once, tested once, and reused by every primitive.
        </p>
      </div>
      <div class="hk-card">
        <h4>Controlled or uncontrolled</h4>
        <p>
          Every stateful primitive accepts a <code>v-model</code> and falls back to internal state
          when you do not pass one.
        </p>
      </div>
      <div class="hk-card">
        <h4>Escape-friendly composition</h4>
        <p>
          Overlays register in a shared layer stack so nested dialogs dismiss one at a time, and
          scroll locking is reference counted.
        </p>
      </div>
      <div class="hk-card">
        <h4>Composition APIs</h4>
        <p>
          Prefer building your own? The same primitives are available as composables
          (<code>useControllableState</code>, <code>useRovingFocus</code>,
          <code>useFocusTrap</code>, …).
        </p>
      </div>
    </div>

    <h2>Primitives</h2>
    <div class="hk-cards">
      <div v-for="name in primitives" :key="name" class="hk-card">
        <h4>{{ name }}</h4>
        <p style="font-size: 12.5px">See the docs for props, slot props and keyboard behaviour.</p>
      </div>
    </div>

    <h2>Design principles</h2>
    <ul>
      <li><strong>No markup.</strong> Components render only their default slot.</li>
      <li>
        <strong>No globals.</strong> No CSS reset, no injected stylesheet, no CSS-in-JS runtime.
      </li>
      <li>
        <strong>No magic ids.</strong> Ids are generated per instance and always paired through
        <code>aria-controls</code> / <code>aria-labelledby</code>.
      </li>
      <li>
        <strong>Explicit transitions.</strong> Nothing animates unless you wrap a content part in a
        Vue <code>&lt;Transition&gt;</code>.
      </li>
      <li>
        <strong>Small surface.</strong> One peer dependency, tree-shakeable ES and CJS builds.
      </li>
    </ul>
  </div>
</template>
