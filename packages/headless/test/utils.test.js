import { describe, expect, it, vi } from 'vitest'
import { collectComponents, useControllableState, useId, useTypeahead } from '@headless-kit/vue'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'

const runOutsideRender = (fn) => {
  const host = defineComponent({
    setup() {
      fn()
      return () => null
    },
  })
  mount(host)
}

describe('useControllableState', () => {
  it('falls back to the internal value when uncontrolled', () => {
    let handle = null
    mount(
      defineComponent({
        setup() {
          const [value, isControlled] = useControllableState({ defaultProp: 'a' })
          handle = { value, isControlled }
          return () => null
        },
      }),
    )
    expect(handle.isControlled.value).toBe(false)
    expect(handle.value.value).toBe('a')
    handle.value.value = 'b'
    expect(handle.value.value).toBe('b')
  })

  it('ignores writes while controlled but still notifies', () => {
    const onChange = vi.fn()
    mount(
      defineComponent({
        props: { modelValue: { type: String, default: 'controlled' } },
        setup(props) {
          const [value, isControlled] = useControllableState({
            prop: () => props.modelValue,
            onChange,
          })
          runOutsideRender(() => {
            expect(isControlled.value).toBe(true)
            value.value = 'next'
          })
          expect(value.value).toBe('controlled')
          expect(onChange).toHaveBeenCalledWith('next')
          return () => null
        },
      }),
    )
  })

  it('invokes onChange once per distinct transition', () => {
    const onChange = vi.fn()
    let handle = null
    mount(
      defineComponent({
        setup() {
          const [value] = useControllableState({ defaultProp: 0, onChange })
          handle = value
          return () => null
        },
      }),
    )
    handle.value = 1
    handle.value = 1
    handle.value = 2
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenNthCalledWith(1, 1)
    expect(onChange).toHaveBeenNthCalledWith(2, 2)
  })

  it('supports updater functions', () => {
    let handle = null
    mount(
      defineComponent({
        setup() {
          handle = useControllableState({ defaultProp: 10 })[0]
          return () => null
        },
      }),
    )
    handle.value = (current) => current + 5
    expect(handle.value).toBe(15)
  })

  it('reacts to prop changes', async () => {
    const wrapper = mount(
      defineComponent({
        props: { modelValue: { type: Boolean, default: false } },
        setup(props) {
          const [value] = useControllableState({ prop: () => props.modelValue })
          return () => h('span', String(value.value))
        },
      }),
      { props: { modelValue: false } },
    )
    expect(wrapper.text()).toBe('false')
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.text()).toBe('true')
  })
})

describe('useId', () => {
  it('produces stable prefixed ids per component instance', () => {
    const ids = []
    const Child = defineComponent({
      setup() {
        ids.push(useId('demo'))
        return () => null
      },
    })
    const Root = defineComponent({ setup: () => () => h('div', [h(Child), h(Child)]) })
    mount(Root)
    expect(ids).toHaveLength(2)
    expect(ids[0]).toMatch(/^demo-\d+$/)
    expect(ids[0]).not.toBe(ids[1])
  })
})

describe('useTypeahead', () => {
  it('matches the first item starting with the typed prefix', () => {
    const onMatch = vi.fn()
    let handle = null
    mount(
      defineComponent({
        setup() {
          handle = useTypeahead({
            values: () => ['Apple', 'Apricot', 'Banana'],
            onMatch,
          }).handleTypeahead
          return () => null
        },
      }),
    )
    handle('a')
    expect(onMatch).toHaveBeenCalledWith('Apple', 0)
    handle('p')
    expect(onMatch).toHaveBeenLastCalledWith('Apricot', 1)
  })

  it('cycles through items that share the same first letter', () => {
    const onMatch = vi.fn()
    let handle = null
    mount(
      defineComponent({
        setup() {
          handle = useTypeahead({ values: () => ['Apple', 'Apricot'], onMatch }).handleTypeahead
          return () => null
        },
      }),
    )
    handle('a')
    handle('a')
    handle('a')
    expect(onMatch.mock.calls.map((call) => call[0])).toEqual(['Apple', 'Apricot', 'Apple'])
  })

  it('ignores keys that match nothing', () => {
    const onMatch = vi.fn()
    let handle = null
    mount(
      defineComponent({
        setup() {
          handle = useTypeahead({ values: () => ['Apple'], onMatch }).handleTypeahead
          return () => null
        },
      }),
    )
    handle('z')
    expect(onMatch).not.toHaveBeenCalled()
  })
})

describe('collectComponents', () => {
  it('finds component vnodes nested inside elements and fragments', () => {
    const Target = defineComponent({ name: 'Target', render: () => null })
    const nodes = [h(Target), h('div', [h('span'), h(Target)])]
    expect(collectComponents(nodes, 'Target')).toHaveLength(2)
  })

  it('does not descend into unrendered slots', () => {
    const Target = defineComponent({ name: 'Target', render: () => null })
    const Wrapper = defineComponent({ name: 'Wrapper', render: () => null })
    const nodes = [h(Wrapper, null, { default: () => h(Target) })]
    expect(collectComponents(nodes, 'Target')).toHaveLength(0)
  })
})

describe('ref utility', () => {
  it('keeps refs usable across renders', async () => {
    const value = ref(0)
    const host = defineComponent({
      setup() {
        return () => h('span', String(value.value))
      },
    })
    const wrapper = mount(host)
    value.value = 1
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('1')
  })
})
