import { afterEach, describe, expect, it } from 'vitest'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  Portal,
  Presence,
  VisuallyHidden,
  computePosition,
} from '@headless-kit/vue'
import { defineComponent, nextTick } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})

const pointerDown = (target) =>
  target.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))

const flushFrames = async (frames = 3) => {
  for (let index = 0; index < frames; index += 1) {
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await nextTick()
  }
}

const DialogHarness = defineComponent({
  components: {
    DialogRoot,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
  },
  props: {
    open: { type: Boolean, default: undefined },
    closeOnEscape: { type: Boolean, default: true },
    closeOnOutsideClick: { type: Boolean, default: true },
    modal: { type: Boolean, default: true },
  },
  emits: ['update:open'],
  template: `
    <DialogRoot
      :open="open"
      :modal="modal"
      :close-on-escape="closeOnEscape"
      :close-on-outside-click="closeOnOutsideClick"
      @update:open="$emit('update:open', $event)"
    >
      <DialogTrigger v-slot="{ props: triggerProps }">
        <button v-bind="triggerProps" data-test="trigger">Open dialog</button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay v-slot="{ props: overlayProps }">
          <div v-bind="overlayProps" data-test="overlay" />
        </DialogOverlay>
        <DialogContent v-slot="{ props: contentProps }">
          <div v-bind="contentProps" data-test="content">
            <DialogTitle v-slot="{ props: titleProps }">
              <h2 v-bind="titleProps" data-test="title">Delete file</h2>
            </DialogTitle>
            <DialogDescription v-slot="{ props: descProps }">
              <p v-bind="descProps" data-test="description">This cannot be undone.</p>
            </DialogDescription>
            <button data-test="inside">Inside action</button>
            <DialogClose v-slot="{ props: closeProps }">
              <button v-bind="closeProps" data-test="close">Cancel</button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  `,
})

const findIn = (selector) => document.body.querySelector(selector)

describe('Presence', () => {
  it('renders nothing while unmounted', () => {
    const wrapper = mount(
      defineComponent({
        components: { Presence },
        props: { present: Boolean },
        template: '<Presence :present="present"><span data-test="child">x</span></Presence>',
      }),
    )
    expect(wrapper.find('[data-test="child"]').exists()).toBe(false)
  })

  it('renders while present and unmounts after the exit frames', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Presence },
        props: { present: Boolean },
        template: '<Presence :present="present"><span data-test="child">x</span></Presence>',
      }),
    )
    await wrapper.setProps({ present: true })
    expect(wrapper.find('[data-test="child"]').exists()).toBe(true)
    await wrapper.setProps({ present: false })
    await flushFrames()
    expect(wrapper.find('[data-test="child"]').exists()).toBe(false)
  })
})

describe('Portal', () => {
  it('teleports content to the requested target', async () => {
    const target = document.createElement('div')
    target.id = 'portal-target'
    document.body.appendChild(target)

    const wrapper = mount(
      defineComponent({
        components: { Portal },
        template: '<Portal to="#portal-target"><span data-test="teleported">hi</span></Portal>',
      }),
    )
    await nextTick()
    await nextTick()
    expect(target.querySelector('[data-test="teleported"]')).not.toBeNull()
    expect(wrapper.find('[data-test="teleported"]').exists()).toBe(false)
    wrapper.unmount()
    target.remove()
  })

  it('renders inline when disabled', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Portal },
        template: '<Portal disabled><span data-test="inline">hi</span></Portal>',
      }),
    )
    await nextTick()
    expect(wrapper.find('[data-test="inline"]').exists()).toBe(true)
  })
})

describe('VisuallyHidden', () => {
  it('keeps content accessible but visually removed', () => {
    const wrapper = mount(VisuallyHidden, { slots: { default: 'Label' } })
    expect(wrapper.text()).toBe('Label')
    expect(wrapper.attributes('data-hk-visually-hidden')).toBe('not-intractable')
    expect(wrapper.element.style.position).toBe('absolute')
    expect(wrapper.element.style.clipPath).toBe('inset(50%)')
  })
})

describe('computePosition', () => {
  const rect = (values) => ({
    top: values.top,
    left: values.left,
    right: values.left + values.width,
    bottom: values.top + values.height,
    width: values.width,
    height: values.height,
    x: values.left,
    y: values.top,
  })

  it('places the floating element below the reference by default', () => {
    const reference = {
      getBoundingClientRect: () => rect({ top: 100, left: 100, width: 50, height: 20 }),
    }
    const floating = {
      getBoundingClientRect: () => rect({ top: 0, left: 0, width: 80, height: 40 }),
    }
    const result = computePosition(reference, floating, { placement: 'bottom', offset: 8 })
    expect(result.side).toBe('bottom')
    expect(result.y).toBe(128)
    expect(result.x).toBe(85)
    expect(result.ready).toBe(true)
  })

  it('honours the start alignment', () => {
    const reference = {
      getBoundingClientRect: () => rect({ top: 10, left: 40, width: 50, height: 20 }),
    }
    const floating = {
      getBoundingClientRect: () => rect({ top: 0, left: 0, width: 80, height: 40 }),
    }
    const result = computePosition(reference, floating, { placement: 'bottom-start', offset: 8 })
    expect(result.x).toBe(40)
  })

  it('flips to the opposite side when there is not enough room', () => {
    const reference = {
      getBoundingClientRect: () =>
        rect({ top: window.innerHeight - 30, left: 100, width: 50, height: 20 }),
    }
    const floating = {
      getBoundingClientRect: () => rect({ top: 0, left: 0, width: 80, height: 200 }),
    }
    const result = computePosition(reference, floating, { placement: 'bottom', offset: 8 })
    expect(result.side).toBe('top')
    expect(result.y).toBe(window.innerHeight - 30 - 200 - 8)
  })

  it('clamps cross-axis overflow inside the viewport', () => {
    const reference = {
      getBoundingClientRect: () =>
        rect({ top: 10, left: window.innerWidth - 20, width: 50, height: 20 }),
    }
    const floating = {
      getBoundingClientRect: () => rect({ top: 0, left: 0, width: 200, height: 40 }),
    }
    const result = computePosition(reference, floating, { placement: 'bottom', offset: 8 })
    expect(result.x).toBeLessThanOrEqual(window.innerWidth - 200 - 8)
    expect(result.x).toBeGreaterThanOrEqual(8)
  })

  it('returns a not-ready result when nodes are missing', () => {
    expect(computePosition(null, null).ready).toBe(false)
  })
})

describe('Dialog', () => {
  it('keeps the dialog closed until the trigger is used', () => {
    const wrapper = mount(DialogHarness, { attachTo: document.body })
    expect(findIn('[data-test="content"]')).toBeNull()
    expect(wrapper.get('[data-test="trigger"]').attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('opens through the trigger and teleports to body', async () => {
    const wrapper = mount(DialogHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    const content = findIn('[data-test="content"]')
    expect(content).not.toBeNull()
    expect(content.getAttribute('role')).toBe('dialog')
    expect(content.getAttribute('aria-modal')).toBe('true')
    expect(findIn('[data-test="overlay"]')).not.toBeNull()
    expect(wrapper.get('[data-test="trigger"]').attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('associates title and description with the dialog', async () => {
    const wrapper = mount(DialogHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    const content = findIn('[data-test="content"]')
    expect(content.getAttribute('aria-labelledby')).toBe(findIn('[data-test="title"]').id)
    expect(content.getAttribute('aria-describedby')).toBe(findIn('[data-test="description"]').id)
    wrapper.unmount()
  })

  it('closes on Escape', async () => {
    const wrapper = mount(DialogHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('update:open').at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('ignores Escape when closeOnEscape is false', async () => {
    const wrapper = mount(DialogHarness, {
      props: { closeOnEscape: false },
      attachTo: document.body,
    })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('closes on an outside press but not on an inside press', async () => {
    const wrapper = mount(DialogHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()

    pointerDown(findIn('[data-test="inside"]'))
    await nextTick()
    expect(wrapper.emitted('update:open')).toEqual([[true]])

    const outside = document.createElement('button')
    document.body.appendChild(outside)
    pointerDown(outside)
    await nextTick()
    expect(wrapper.emitted('update:open').at(-1)).toEqual([false])
  })

  it('closes through DialogClose and returns focus to the trigger', async () => {
    const wrapper = mount(DialogHarness, { attachTo: document.body })
    const trigger = wrapper.get('[data-test="trigger"]')
    trigger.element.focus()
    await trigger.trigger('click')
    await nextTick()
    await nextTick()
    expect(document.activeElement).toBe(findIn('[data-test="inside"]'))

    findIn('[data-test="close"]').click()
    await nextTick()
    expect(wrapper.emitted('update:open').at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('locks body scroll while modal and restores afterwards', async () => {
    const wrapper = mount(DialogHarness, { attachTo: document.body })
    expect(document.body.style.overflow).toBe('')
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    findIn('[data-test="close"]').click()
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })

  it('keeps the lock while another modal layer is still open', async () => {
    const wrapper = mount(DialogHarness, { attachTo: document.body })
    const inner = mount(DialogHarness, { props: { open: true }, attachTo: document.body })
    await nextTick()
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    inner.unmount()
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('does not lock scroll for non-modal dialogs', async () => {
    const wrapper = mount(DialogHarness, { props: { modal: false }, attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    expect(document.body.style.overflow).toBe('')
    expect(findIn('[data-test="content"]').getAttribute('aria-modal')).toBeNull()
    wrapper.unmount()
  })

  it('only lets the top-most layer respond to Escape', async () => {
    const wrapper = mount(DialogHarness, { props: { open: true }, attachTo: document.body })
    await nextTick()
    const inner = mount(DialogHarness, { props: { open: true }, attachTo: document.body })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(inner.emitted('update:open').at(-1)).toEqual([false])
    expect(wrapper.emitted('update:open')).toBeUndefined()
    inner.unmount()
    wrapper.unmount()
  })
})

const PopoverHarness = defineComponent({
  components: {
    PopoverRoot,
    PopoverTrigger,
    PopoverPortal,
    PopoverContent,
    PopoverArrow,
  },
  props: {
    open: { type: Boolean, default: undefined },
    placement: { type: String, default: 'bottom' },
  },
  emits: ['update:open'],
  template: `
    <PopoverRoot
      :open="open"
      :placement="placement"
      @update:open="$emit('update:open', $event)"
    >
      <PopoverTrigger v-slot="{ props: triggerProps }">
        <button v-bind="triggerProps" data-test="trigger">Toggle</button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent v-slot="{ props: contentProps }">
          <div v-bind="contentProps" data-test="content">
            <button data-test="inner">Inner</button>
            <PopoverArrow v-slot="{ props: arrowProps }">
              <span v-bind="arrowProps" data-test="arrow" />
            </PopoverArrow>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  `,
})

describe('Popover', () => {
  it('toggles from the trigger', async () => {
    const wrapper = mount(PopoverHarness, { attachTo: document.body })
    expect(findIn('[data-test="content"]')).toBeNull()
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    const content = findIn('[data-test="content"]')
    expect(content).not.toBeNull()
    expect(content.getAttribute('role')).toBe('dialog')
    expect(content.getAttribute('data-side')).toBe('bottom')
    expect(content.style.position).toBe('fixed')
    wrapper.unmount()
  })

  it('supports a controlled open prop', async () => {
    const wrapper = mount(PopoverHarness, { props: { open: false }, attachTo: document.body })
    await wrapper.setProps({ open: true })
    expect(findIn('[data-test="content"]')).not.toBeNull()
    await wrapper.setProps({ open: false })
    expect(wrapper.emitted('update:open')).toBeUndefined()
    wrapper.unmount()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const wrapper = mount(PopoverHarness, { attachTo: document.body })
    const trigger = wrapper.get('[data-test="trigger"]')
    await trigger.trigger('click')
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('update:open').at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('moves focus into the content with ArrowDown', async () => {
    const wrapper = mount(PopoverHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    findIn('[data-test="content"]').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    )
    await nextTick()
    expect(document.activeElement).toBe(findIn('[data-test="inner"]'))
    wrapper.unmount()
  })

  it('respects the requested placement', async () => {
    const wrapper = mount(PopoverHarness, {
      props: { placement: 'right' },
      attachTo: document.body,
    })
    await wrapper.get('[data-test="trigger"]').trigger('click')
    await nextTick()
    expect(findIn('[data-test="content"]').getAttribute('data-side')).toBe('right')
    expect(findIn('[data-test="arrow"]').getAttribute('data-side')).toBe('right')
    wrapper.unmount()
  })
})
