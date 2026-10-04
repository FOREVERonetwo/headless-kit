# headless-kit

> Unstyled, accessible Vue 3 primitives for building design systems.

`@headless-kit/vue` gives you the behaviour and the ARIA semantics of the widgets every product
needs — dialogs, popovers, selects, tabs, accordions — without deciding what they should look like.

- **No markup.** Components render only their default slot; you choose the element.
- **No CSS.** Zero bytes of runtime stylesheet, no CSS-in-JS, no global reset.
- **No plugin.** Nothing to install into your app.
- **One peer dependency.** `vue@^3.3`.

```
npm install @headless-kit/vue
```

## Quick start

```vue
<script setup>
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@headless-kit/vue'
</script>

<template>
  <DialogRoot>
    <DialogTrigger v-slot="{ props: triggerProps }">
      <button v-bind="triggerProps">Delete project</button>
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay v-slot="{ props: overlayProps }">
        <div v-bind="overlayProps" class="backdrop" />
      </DialogOverlay>

      <DialogContent v-slot="{ props: contentProps }">
        <div v-bind="contentProps" class="modal">
          <DialogTitle v-slot="{ props: titleProps }">
            <h2 v-bind="titleProps">Delete project?</h2>
          </DialogTitle>
          <DialogClose v-slot="{ props: closeProps }">
            <button v-bind="closeProps">Cancel</button>
          </DialogClose>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 60%);
}
.modal {
  position: fixed;
  inset: 20% auto auto 50%;
  translate: -50% 0;
  min-width: 320px;
  padding: 24px;
  border-radius: 12px;
  background: white;
}
</style>
```

That is the whole integration. `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trapping,
focus restoration, body scroll locking, Escape handling and outside-press dismissal are already
handled — the only thing left for you is CSS.

## API shape

Every part follows the same three rules.

1. **Parts are composed, not configured.** `<DialogRoot>` + `<DialogTrigger>` + `<DialogContent>`
   instead of `<Dialog :title="…">`.
2. **Slot props carry the DOM contract.** Each part exposes a `props` object designed to be spread
   with `v-bind`, plus an `attrs` object holding anything you passed through.
3. **State is controlled or uncontrolled.** Pass `v-model` when you need to; ignore it otherwise.

```vue
<AccordionRoot v-model="open" type="multiple">
  <AccordionItem v-for="item in items" :key="item.id" :value="item.id">
    <AccordionTrigger v-slot="{ props: triggerProps, open }">
      <button v-bind="triggerProps">{{ open ? '−' : '+' }} {{ item.title }}</button>
    </AccordionTrigger>
    <AccordionContent v-slot="{ props: contentProps }">
      <div v-bind="contentProps">{{ item.body }}</div>
    </AccordionContent>
  </AccordionItem>
</AccordionRoot>
```

## Primitives

| Family      | Parts                                                                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disclosure  | `Root`, `Trigger`, `Content`                                                                                                                              |
| Accordion   | `Root`, `Item`, `Header`, `Trigger`, `Content`                                                                                                            |
| Tabs        | `Root`, `List`, `Trigger`, `Content`                                                                                                                      |
| Dialog      | `Root`, `Trigger`, `Portal`, `Overlay`, `Content`, `Title`, `Description`, `Close`                                                                           |
| Popover     | `Root`, `Trigger`, `Portal`, `Content`, `Arrow`                                                                                                            |
| Select      | `Root`, `Trigger`, `Value`, `Icon`, `Portal`, `Content`, `Item`, `ItemText`, `HiddenInput`                                                                  |
| Tooltip     | `Provider`, `Root`, `Trigger`, `Portal`, `Content`, `Arrow`                                                                                                |
| Switch      | `Root`, `Thumb`, `Input`                                                                                                                                  |
| Checkbox    | `Root`, `Indicator`, `Input`                                                                                                                              |
| Presence    | `Presence`                                                                                                                                                 |
| Portal      | `Portal`                                                                                                                                                   |
| Utilities   | `VisuallyHidden`                                                                                                                                           |

## Composables

The primitives are thin wrappers over composables, and the composables are exported so you can adopt
the behaviour without the markup.

| Composable                | Responsibility                                                      |
| ------------------------- | ------------------------------------------------------------------- |
| `useControllableState`    | Backs every `v-model`; works controlled or uncontrolled             |
| `useRovingFocus`          | One tab stop for a group, with orientation and looping              |
| `useFocusTrap`            | Tab cycling, initial focus, focus restoration                        |
| `useDismiss`              | Escape / outside-press with a global layer stack                    |
| `useTypeahead`            | Multi-character search with native-style cycling                    |
| `useScrollLock`           | Reference-counted body lock with scrollbar compensation             |
| `usePresence`             | Mount/unmount state machine that respects CSS animations             |
| `usePortal`               | Mount-time teleport target resolution (SSR safe)                    |
| `useEventListener`        | Reactive targets with scope-aware cleanup                           |
| `createContext`           | `provide`/`inject` pair with actionable error messages              |
| `computePosition`         | Pure flip + clamp positioning math                                   |

```js
import { useRovingFocus } from '@headless-kit/vue'

const roving = useRovingFocus({ orientation: 'horizontal', loop: true })
```

```vue
<div :ref="roving.containerRef" role="toolbar">
  <button v-for="item in items" :key="item.id" v-bind="roving.itemProps(item.id)">
    {{ item.label }}
  </button>
</div>
```

## Accessibility

Accessibility is the product, not a feature toggle.

- Roles, `aria-*` attributes and generated ids are emitted by the primitives and covered by tests.
- Focus management: trapping, initial focus, and restoration to the trigger on close.
- Keyboard support follows the WAI-ARIA Authoring Practices, including roving tabindex and both
  automatic and manual tab activation.
- Overlay dismissal is layered — nested dialogs close one at a time.
- `data-state`, `data-side`, `data-highlighted` and `data-disabled` are emitted so styling never has
  to duplicate state.

Testing is done against real DOM assertions in jsdom (`vitest` + `@vue/test-utils`), covering roles,
aria wiring, keyboard interaction and focus movement.

## Repository layout

```
packages/headless      the published package
  src/primitives/*     one folder per primitive family
  src/utils/*          composables
  src/internal/*       positioning math and vnode collection
  test/*               vitest suites
apps/docs              Vite + Vue documentation site
```

## Development

```bash
npm install
npm run dev          # docs site on http://localhost:5173
npm run test         # vitest
npm run coverage     # vitest + v8 coverage
npm run lint         # eslint (flat config)
npm run format       # prettier
npm run build        # library then docs
npm run check        # lint + format check + test + build
```

## Contributing

Bug reports, accessibility findings and pull requests are welcome. Please read
[CONTRIBUTING.md](./CONTRIBUTING.md) first — it describes the commit convention, the test
requirements for behaviour changes, and how to reproduce an accessibility issue so it can be verified.

Security reports should go through [SECURITY.md](./SECURITY.md), not public issues.

## License

[MIT](./LICENSE)