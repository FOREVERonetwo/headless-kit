import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  SelectContent,
  SelectHiddenInput,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@headless-kit/vue'
import { defineComponent, nextTick } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.useRealTimers()
})

const findIn = (selector) => document.body.querySelector(selector)

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms))

const SelectHarness = defineComponent({
  components: {
    SelectRoot,
    SelectTrigger,
    SelectValue,
    SelectIcon,
    SelectContent,
    SelectItem,
    SelectItemText,
    SelectHiddenInput,
  },
  props: {
    modelValue: { type: String, default: undefined },
    disabledValues: { type: Array, default: () => [] },
    name: { type: String, default: 'framework' },
  },
  emits: ['update:modelValue'],
  data: () => ({ options: ['Vue', 'React', 'Svelte'] }),
  template: `
    <SelectRoot
      :model-value="modelValue"
      :name="name"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <SelectTrigger v-slot="{ props: triggerProps }">
        <button v-bind="triggerProps" data-test="trigger">
          <SelectValue v-slot="{ value, hasSelection }" placeholder="Pick one">
            <span data-test="value">{{ value }}</span>
            <span v-if="!hasSelection" data-test="placeholder">Pick one</span>
          </SelectValue>
          <SelectIcon v-slot="{ props: iconProps }">
            <span v-bind="iconProps" data-test="icon">v</span>
          </SelectIcon>
        </button>
      </SelectTrigger>
      <SelectContent v-slot="{ props: contentProps }">
        <div v-bind="contentProps" data-test="content">
          <SelectItem
            v-for="option in options"
            :key="option"
            :value="option"
            :disabled="disabledValues.includes(option)"
            v-slot="{ props: itemProps, selected }"
          >
            <div v-bind="itemProps" :data-test="'item-' + option" :data-selected="selected">
              <SelectItemText v-slot="{ attrs }"><span v-bind="attrs">{{ option }}</span></SelectItemText>
            </div>
          </SelectItem>
        </div>
      </SelectContent>
      <SelectHiddenInput />
    </SelectRoot>
  `,
})

describe('Select', () => {
  it('shows the placeholder until a value is chosen', () => {
    const wrapper = mount(SelectHarness, { attachTo: document.body })
    expect(wrapper.get('[data-test="placeholder"]').exists()).toBe(true)
    expect(findIn('[data-test="content"]')).toBeNull()
  })

  it('exposes combobox semantics on the trigger', () => {
    const wrapper = mount(SelectHarness, { attachTo: document.body })
    const trigger = wrapper.get('[data-test="trigger"]')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-haspopup')).toBe('listbox')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('resolves the label of the selected option before the list is opened', async () => {
    const wrapper = mount(SelectHarness, {
      props: { modelValue: 'React' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.get('[data-test="value"]').text()).toBe('React')
  })

  it('opens the listbox and renders options', async () => {
    const wrapper = mount(SelectHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    const content = findIn('[data-test="content"]')
    expect(content.getAttribute('role')).toBe('listbox')
    expect(content.getAttribute('aria-labelledby')).toBe(
      wrapper.get('[data-test="trigger"]').attributes('id'),
    )
    expect(findIn('[data-test="item-Vue"]').getAttribute('role')).toBe('option')
  })

  it('selects an option on click and closes the list', async () => {
    const wrapper = mount(SelectHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    findIn('[data-test="item-Svelte"]').click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['Svelte'])
  })

  it('marks the selected option with aria-selected', async () => {
    const wrapper = mount(SelectHarness, { props: { modelValue: 'Vue' }, attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    expect(findIn('[data-test="item-Vue"]').getAttribute('aria-selected')).toBe('true')
    expect(findIn('[data-test="item-React"]').getAttribute('aria-selected')).toBe('false')
  })

  it('ignores clicks on disabled options', async () => {
    const wrapper = mount(SelectHarness, {
      props: { disabledValues: ['React'] },
      attachTo: document.body,
    })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    expect(findIn('[data-test="item-React"]').getAttribute('aria-disabled')).toBe('true')
    findIn('[data-test="item-React"]').click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('opens with keyboard and closes on Escape', async () => {
    const wrapper = mount(SelectHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(findIn('[data-test="content"]')).not.toBeNull()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    const root = wrapper.findComponent({ name: 'SelectRoot' })
    expect(root.emitted('update:open').at(-1)).toEqual([false])
  })

  it('moves aria-activedescendant with arrow keys', async () => {
    const wrapper = mount(SelectHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    const content = findIn('[data-test="content"]')
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    expect(content.getAttribute('aria-activedescendant')).toBe(findIn('[data-test="item-Vue"]').id)
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    expect(content.getAttribute('aria-activedescendant')).toBe(
      findIn('[data-test="item-React"]').id,
    )
  })

  it('selects with typeahead', async () => {
    const wrapper = mount(SelectHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    const content = findIn('[data-test="content"]')
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['Svelte'])
  })

  it('syncs the hidden input used for form submission', async () => {
    const wrapper = mount(SelectHarness, { props: { modelValue: 'Vue' }, attachTo: document.body })
    const hidden = wrapper.get('input[type="hidden"]')
    expect(hidden.attributes('name')).toBe('framework')
    expect(hidden.element.value).toBe('Vue')
  })
})

const TooltipHarness = defineComponent({
  components: { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent },
  props: { delayDuration: { type: Number, default: undefined } },
  template: `
    <TooltipProvider>
      <TooltipRoot :delay-duration="delayDuration">
        <TooltipTrigger v-slot="{ props: triggerProps }">
          <button v-bind="triggerProps" data-test="trigger">Hover me</button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent v-slot="{ props: contentProps }">
            <div v-bind="contentProps" data-test="content">Helpful text</div>
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  `,
})

const tooltipRoot = (wrapper) => wrapper.findComponent({ name: 'TooltipRoot' })

describe('Tooltip', () => {
  it('stays hidden until hover or focus', async () => {
    const wrapper = mount(TooltipHarness, { props: { delayDuration: 0 }, attachTo: document.body })
    expect(findIn('[data-test="content"]')).toBeNull()
    await wrapper.get('[data-test="trigger"]').trigger('mouseenter')
    await wait(5)
    expect(findIn('[data-test="content"]')).not.toBeNull()
  })

  it('links the trigger with aria-describedby only while open', async () => {
    const wrapper = mount(TooltipHarness, { props: { delayDuration: 0 }, attachTo: document.body })
    const trigger = wrapper.get('[data-test="trigger"]')
    expect(trigger.attributes('aria-describedby')).toBeUndefined()
    await trigger.trigger('mouseenter')
    await wait(5)
    const content = findIn('[data-test="content"]')
    expect(content.getAttribute('role')).toBe('tooltip')
    expect(trigger.attributes('aria-describedby')).toBe(content.id)
  })

  it('closes on mouseleave', async () => {
    const wrapper = mount(TooltipHarness, { props: { delayDuration: 0 }, attachTo: document.body })
    const trigger = wrapper.get('[data-test="trigger"]')
    await trigger.trigger('mouseenter')
    await wait(5)
    await trigger.trigger('mouseleave')
    await nextTick()
    expect(tooltipRoot(wrapper).emitted('update:open').at(-1)).toEqual([false])
  })

  it('opens on focus and closes on blur', async () => {
    const wrapper = mount(TooltipHarness, { props: { delayDuration: 0 }, attachTo: document.body })
    const trigger = wrapper.get('[data-test="trigger"]')
    await trigger.trigger('focus')
    await wait(5)
    expect(findIn('[data-test="content"]')).not.toBeNull()
    await trigger.trigger('blur')
    await nextTick()
    expect(tooltipRoot(wrapper).emitted('update:open').at(-1)).toEqual([false])
  })

  it('honours the configured delay', async () => {
    vi.useFakeTimers()
    const wrapper = mount(TooltipHarness, {
      props: { delayDuration: 400 },
      attachTo: document.body,
    })
    await wrapper.get('[data-test="trigger"]').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(200)
    expect(findIn('[data-test="content"]')).toBeNull()
    await vi.advanceTimersByTimeAsync(400)
    expect(findIn('[data-test="content"]')).not.toBeNull()
  })

  it('skips the delay for the second tooltip in a group', async () => {
    vi.useFakeTimers()
    const harness = defineComponent({
      components: { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent },
      template: `
        <TooltipProvider :delay-duration="300" :skip-delay-duration="300">
          <TooltipRoot v-for="index in 2" :key="index">
            <TooltipTrigger v-slot="{ props: triggerProps }">
              <button v-bind="triggerProps" :data-test="'trigger-' + index">t</button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent v-slot="{ props: contentProps }">
                <div v-bind="contentProps" :data-test="'content-' + index">c</div>
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </TooltipProvider>
      `,
    })
    const wrapper = mount(harness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger-1"]').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(300)
    expect(findIn('[data-test="content-1"]')).not.toBeNull()

    await wrapper.get('[data-test="trigger-1"]').trigger('mouseleave')
    await nextTick()
    await wrapper.get('[data-test="trigger-2"]').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(0)
    expect(findIn('[data-test="content-2"]')).not.toBeNull()
  })

  it('closes on Escape', async () => {
    const wrapper = mount(TooltipHarness, { props: { delayDuration: 0 }, attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('focus')
    await wait(5)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(tooltipRoot(wrapper).emitted('update:open').at(-1)).toEqual([false])
  })
})
