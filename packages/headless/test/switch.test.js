import { describe, expect, it, vi } from 'vitest'
import { SwitchInput, SwitchRoot, SwitchThumb, createContext, mergeRefs } from '@headless-kit/vue'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'

const SwitchHarness = defineComponent({
  components: { SwitchRoot, SwitchThumb, SwitchInput },
  props: {
    modelValue: { type: Boolean, default: undefined },
    name: { type: String, default: 'notifications' },
  },
  emits: ['update:modelValue'],
  template: `
    <SwitchRoot
      :model-value="modelValue"
      :name="name"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template #default="{ checked, toggle }">
        <button type="button" role="switch" :aria-checked="checked" data-test="control" @click="toggle">
          <SwitchThumb v-slot="{ checked: thumbChecked }">
            <span data-test="thumb" :data-state="thumbChecked ? 'checked' : 'unchecked'" />
          </SwitchThumb>
        </button>
        <SwitchInput :value="name" />
      </template>
    </SwitchRoot>
  `,
})

const silence = { global: { config: { errorHandler: () => {} } } }

describe('createContext', () => {
  it('throws a helpful error when the provider is missing', () => {
    const [, use] = createContext('Demo')
    const Orphan = defineComponent({
      name: 'Orphan',
      setup() {
        use('DemoChild')
        return () => null
      },
    })
    expect(() => mount(Orphan, silence)).toThrow(/DemoChild/)
  })

  it('returns the injected context when the provider is present', () => {
    const [provide, use] = createContext('Demo')
    let received = null
    const Child = defineComponent({
      name: 'Child',
      setup() {
        received = use()
        return () => null
      },
    })
    const Root = defineComponent({
      components: { Child },
      setup() {
        provide({ ok: true })
        return () => h(Child)
      },
    })
    mount(Root)
    expect(received).toEqual({ ok: true })
  })
})

describe('mergeRefs', () => {
  it('writes to every ref and calls every function ref', () => {
    const target = ref(null)
    const fn = vi.fn()
    mergeRefs(target, fn, null)('node')
    expect(target.value).toBe('node')
    expect(fn).toHaveBeenCalledWith('node')
  })
})

describe('Switch', () => {
  it('renders unchecked by default and toggles on click', async () => {
    const wrapper = mount(SwitchHarness)
    const control = wrapper.get('[data-test="control"]')
    expect(control.attributes('aria-checked')).toBe('false')
    expect(wrapper.get('[data-test="thumb"]').attributes('data-state')).toBe('unchecked')

    await control.trigger('click')
    expect(control.attributes('aria-checked')).toBe('true')
    expect(wrapper.get('[data-test="thumb"]').attributes('data-state')).toBe('checked')
  })

  it('emits update:modelValue when controlled', async () => {
    const wrapper = mount(SwitchHarness)
    await wrapper.get('[data-test="control"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('reflects the controlled prop', async () => {
    const wrapper = mount(SwitchHarness, { props: { modelValue: false } })
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.get('[data-test="control"]').attributes('aria-checked')).toBe('true')

    await wrapper.get('[data-test="control"]').trigger('click')
    expect(wrapper.get('[data-test="control"]').attributes('aria-checked')).toBe('true')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('renders a hidden native input for form submission', () => {
    const wrapper = mount(SwitchHarness)
    const input = wrapper.get('input[type="checkbox"]')
    expect(input.attributes('role')).toBe('switch')
    expect(input.attributes('name')).toBe('notifications')
    expect(input.attributes('aria-hidden')).toBe('true')
  })

  it('propagates the checked state to the native input', async () => {
    const wrapper = mount(SwitchHarness)
    await wrapper.get('[data-test="control"]').trigger('click')
    await nextTick()
    expect(wrapper.get('input[type="checkbox"]').element.checked).toBe(true)
  })

  it('keeps working when a sibling primitive mutates shared state', async () => {
    const wrapper = mount(SwitchHarness)
    await wrapper.get('[data-test="control"]').trigger('click')
    await nextTick()
    expect(wrapper.get('input[type="checkbox"]').element.checked).toBe(true)
    expect(wrapper.get('[data-test="thumb"]').attributes('data-state')).toBe('checked')
  })
})
