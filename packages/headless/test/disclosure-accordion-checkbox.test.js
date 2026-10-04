import { describe, expect, it } from 'vitest'
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
  CheckboxIndicator,
  CheckboxInput,
  CheckboxRoot,
  DisclosureContent,
  DisclosureRoot,
  DisclosureTrigger,
  SwitchRoot,
  SwitchThumb,
} from '@headless-kit/vue'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

const DisclosureHarness = defineComponent({
  components: { DisclosureRoot, DisclosureTrigger, DisclosureContent },
  props: {
    open: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  template: `
    <DisclosureRoot
      :open="open"
      :disabled="disabled"
      @update:open="$emit('update:open', $event)"
    >
      <DisclosureTrigger v-slot="{ open: isOpen, props: triggerProps }">
        <button v-bind="triggerProps" data-test="trigger">{{ isOpen ? 'Hide' : 'Show' }}</button>
      </DisclosureTrigger>
      <DisclosureContent v-slot="{ props: contentProps, state }">
        <div v-bind="contentProps" data-test="content" :data-presence="state">Body</div>
      </DisclosureContent>
    </DisclosureRoot>
  `,
})

const AccordionHarness = defineComponent({
  components: {
    AccordionRoot,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionContent,
  },
  props: {
    modelValue: { type: [String, Array], default: undefined },
    type: { type: String, default: 'single' },
    collapsible: { type: Boolean, default: true },
  },
  emits: ['update:modelValue'],
  template: `
    <AccordionRoot
      :type="type"
      :collapsible="collapsible"
      :model-value="modelValue"
      :orientation="'vertical'"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <AccordionItem v-for="name in ['one', 'two']" :key="name" :value="name">
        <AccordionHeader v-slot="{ props: headerProps }">
          <h3 v-bind="headerProps">
            <AccordionTrigger v-slot="{ props: triggerProps }">
              <button v-bind="triggerProps" :data-test="'trigger-' + name">{{ name }}</button>
            </AccordionTrigger>
          </h3>
        </AccordionHeader>
        <AccordionContent v-slot="{ props: contentProps }">
          <div v-bind="contentProps" :data-test="'content-' + name">{{ name }} body</div>
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  `,
})

const flushFrames = async (frames = 3) => {
  for (let index = 0; index < frames; index += 1) {
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await nextTick()
  }
}

describe('Disclosure', () => {
  it('starts closed and links trigger to content with aria attributes', () => {
    const wrapper = mount(DisclosureHarness)
    const trigger = wrapper.get('[data-test="trigger"]')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('data-state')).toBe('closed')
    expect(wrapper.find('[data-test="content"]').exists()).toBe(false)

    const controls = trigger.attributes('aria-controls')
    expect(controls).toMatch(/-content$/)
  })

  it('opens on click and wires aria-controls to the rendered content', async () => {
    const wrapper = mount(DisclosureHarness)
    await wrapper.get('[data-test="trigger"]').trigger('click')
    const trigger = wrapper.get('[data-test="trigger"]')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const content = wrapper.get('[data-test="content"]')
    expect(content.attributes('id')).toBe(trigger.attributes('aria-controls'))
    expect(content.attributes('role')).toBe('region')
    expect(content.attributes('aria-labelledby')).toBe(trigger.attributes('id'))
    expect(content.attributes('data-state')).toBe('open')
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(DisclosureHarness, { props: { disabled: true } })
    const trigger = wrapper.get('[data-test="trigger"]')
    expect(trigger.attributes('aria-disabled')).toBe('true')
    await trigger.trigger('click')
    expect(wrapper.get('[data-test="trigger"]').attributes('aria-expanded')).toBe('false')
  })

  it('honours the controlled prop', async () => {
    const wrapper = mount(DisclosureHarness, { props: { open: false } })
    await wrapper.setProps({ open: true })
    expect(wrapper.get('[data-test="trigger"]').attributes('aria-expanded')).toBe('true')
    await wrapper.get('[data-test="trigger"]').trigger('click')
    expect(wrapper.get('[data-test="trigger"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('update:open').at(-1)).toEqual([false])
  })

  it('toggles back to closed', async () => {
    const wrapper = mount(DisclosureHarness)
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await flushFrames()
    expect(wrapper.get('[data-test="trigger"]').attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[data-test="content"]').exists()).toBe(false)
  })
})

describe('Accordion', () => {
  it('opens a single item at a time in single mode', async () => {
    const wrapper = mount(AccordionHarness)
    await wrapper.get('[data-test="trigger-one"]').trigger('click')
    expect(wrapper.get('[data-test="trigger-one"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[data-test="content-one"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="content-two"]').exists()).toBe(false)

    await wrapper.get('[data-test="trigger-two"]').trigger('click')
    await flushFrames()
    expect(wrapper.find('[data-test="content-one"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="content-two"]').exists()).toBe(true)
  })

  it('collapses the active item when collapsible', async () => {
    const wrapper = mount(AccordionHarness)
    await wrapper.get('[data-test="trigger-one"]').trigger('click')
    await wrapper.get('[data-test="trigger-one"]').trigger('click')
    await flushFrames()
    expect(wrapper.find('[data-test="content-one"]').exists()).toBe(false)
  })

  it('keeps the active item open when collapsible is false', async () => {
    const wrapper = mount(AccordionHarness, { props: { collapsible: false } })
    await wrapper.get('[data-test="trigger-one"]').trigger('click')
    await wrapper.get('[data-test="trigger-one"]').trigger('click')
    expect(wrapper.find('[data-test="content-one"]').exists()).toBe(true)
  })

  it('allows multiple open items in multiple mode', async () => {
    const wrapper = mount(AccordionHarness, { props: { type: 'multiple' } })
    await wrapper.get('[data-test="trigger-one"]').trigger('click')
    await wrapper.get('[data-test="trigger-two"]').trigger('click')
    expect(wrapper.find('[data-test="content-one"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="content-two"]').exists()).toBe(true)
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([['one', 'two']])
  })

  it('moves focus with arrow keys', async () => {
    const wrapper = mount(AccordionHarness, { attachTo: document.body })
    const first = wrapper.get('[data-test="trigger-one"]')
    await first.trigger('click')
    await first.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-test="trigger-two"]').element)
    await wrapper.get('[data-test="trigger-two"]').trigger('keydown', { key: 'End' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-test="trigger-two"]').element)
    wrapper.unmount()
  })
})

const CheckboxHarness = defineComponent({
  components: { CheckboxRoot, CheckboxIndicator, CheckboxInput },
  props: {
    modelValue: { type: [Boolean, Array], default: undefined },
    indeterminate: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  template: `
    <CheckboxRoot
      :model-value="modelValue"
      :indeterminate="indeterminate"
      :value="'vue'"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template #default="{ state, toggle }">
        <button type="button" role="checkbox" :data-state="state" data-test="control" @click="toggle">
          <CheckboxIndicator v-slot="{ state: indicatorState }">
            <span data-test="indicator" :data-state="indicatorState" />
          </CheckboxIndicator>
        </button>
        <CheckboxInput value="vue" />
      </template>
    </CheckboxRoot>
  `,
})

describe('Checkbox', () => {
  it('exposes checked state and only renders the indicator when checked', async () => {
    const wrapper = mount(CheckboxHarness)
    expect(wrapper.find('[data-test="indicator"]').exists()).toBe(false)
    await wrapper.get('[data-test="control"]').trigger('click')
    expect(wrapper.get('[data-test="control"]').attributes('data-state')).toBe('checked')
    expect(wrapper.get('[data-test="indicator"]').attributes('data-state')).toBe('checked')
  })

  it('reports the indeterminate state and emits false when clicked', async () => {
    const wrapper = mount(CheckboxHarness, {
      props: { indeterminate: true, modelValue: true },
    })
    expect(wrapper.get('[data-test="control"]').attributes('data-state')).toBe('indeterminate')
    expect(wrapper.get('[data-test="indicator"]').exists()).toBe(true)
    await wrapper.get('[data-test="control"]').trigger('click')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([false])
    expect(wrapper.get('[data-test="control"]').attributes('data-state')).toBe('indeterminate')
  })

  it('toggles array values for multi-select usage', async () => {
    const wrapper = mount(CheckboxHarness, { props: { modelValue: ['vue'] } })
    await wrapper.get('[data-test="control"]').trigger('click')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([[]])
  })

  it('keeps the hidden input in sync', async () => {
    const wrapper = mount(CheckboxHarness)
    await wrapper.get('[data-test="control"]').trigger('click')
    await nextTick()
    expect(wrapper.get('input[type="checkbox"]').element.checked).toBe(true)
  })
})

describe('Switch integration', () => {
  it('throws when SwitchThumb is used outside SwitchRoot', () => {
    const Orphan = defineComponent({
      components: { SwitchThumb },
      template: '<SwitchThumb v-slot="{ attrs }"><span v-bind="attrs" /></SwitchThumb>',
    })
    expect(() => mount(Orphan, { global: { config: { errorHandler: () => {} } } })).toThrow(
      /SwitchThumb/,
    )
  })

  it('throws when SwitchRoot is used outside a provider consumer', () => {
    const Orphan = defineComponent({
      components: { SwitchRoot },
      template: '<SwitchRoot />',
    })
    expect(() => mount(Orphan)).not.toThrow()
  })
})
