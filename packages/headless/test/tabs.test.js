import { describe, expect, it } from 'vitest'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@headless-kit/vue'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

const TabsHarness = defineComponent({
  components: { TabsRoot, TabsList, TabsTrigger, TabsContent },
  props: {
    modelValue: { type: String, default: undefined },
    orientation: { type: String, default: 'horizontal' },
    activationMode: { type: String, default: 'automatic' },
    disabledValues: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue'],
  template: `
    <TabsRoot
      :model-value="modelValue"
      default-value="overview"
      :orientation="orientation"
      :activation-mode="activationMode"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <TabsList v-slot="{ props: listProps }">
        <div v-bind="listProps" data-test="list">
          <TabsTrigger
            v-for="tab in ['overview', 'usage', 'api']"
            :key="tab"
            :value="tab"
            :disabled="disabledValues.includes(tab)"
            v-slot="{ props: triggerProps, selected }"
          >
            <button v-bind="triggerProps" :data-test="'trigger-' + tab" :data-selected="selected">
              {{ tab }}
            </button>
          </TabsTrigger>
        </div>
      </TabsList>
      <TabsContent
        v-for="tab in ['overview', 'usage', 'api']"
        :key="tab"
        :value="tab"
        v-slot="{ props: contentProps }"
      >
        <div v-bind="contentProps" :data-test="'panel-' + tab">{{ tab }} panel</div>
      </TabsContent>
    </TabsRoot>
  `,
})

describe('Tabs', () => {
  it('renders tablist semantics and selects the default tab', () => {
    const wrapper = mount(TabsHarness)
    const list = wrapper.get('[data-test="list"]')
    expect(list.attributes('role')).toBe('tablist')
    expect(list.attributes('aria-orientation')).toBe('horizontal')

    const trigger = wrapper.get('[data-test="trigger-overview"]')
    expect(trigger.attributes('role')).toBe('tab')
    expect(trigger.attributes('aria-selected')).toBe('true')
    expect(trigger.attributes('tabindex')).toBe('0')
    expect(wrapper.get('[data-test="trigger-usage"]').attributes('tabindex')).toBe('-1')
  })

  it('links triggers and panels with aria-controls / aria-labelledby', () => {
    const wrapper = mount(TabsHarness)
    const trigger = wrapper.get('[data-test="trigger-overview"]')
    const panel = wrapper.get('[data-test="panel-overview"]')
    expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(trigger.attributes('id'))
    expect(panel.attributes('role')).toBe('tabpanel')
    expect(wrapper.find('[data-test="panel-usage"]').exists()).toBe(false)
  })

  it('switches panels on click', async () => {
    const wrapper = mount(TabsHarness)
    await wrapper.get('[data-test="trigger-usage"]').trigger('click')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['usage'])
  })

  it('moves focus and selection with arrow keys in automatic mode', async () => {
    const wrapper = mount(TabsHarness, { attachTo: document.body })
    const first = wrapper.get('[data-test="trigger-overview"]')
    await first.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-test="trigger-usage"]').element)
    expect(wrapper.get('[data-test="trigger-usage"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.get('[data-test="trigger-overview"]').attributes('tabindex')).toBe('-1')

    await wrapper.get('[data-test="trigger-usage"]').trigger('keydown', { key: 'End' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-test="trigger-api"]').element)
    wrapper.unmount()
  })

  it('wraps around at the boundaries', async () => {
    const wrapper = mount(TabsHarness, { attachTo: document.body })
    await wrapper.get('[data-test="trigger-overview"]').trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-test="trigger-api"]').element)
    wrapper.unmount()
  })

  it('only moves focus in manual activation mode', async () => {
    const wrapper = mount(TabsHarness, {
      props: { activationMode: 'manual' },
      attachTo: document.body,
    })
    await wrapper.get('[data-test="trigger-overview"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-test="trigger-usage"]').element)
    expect(wrapper.get('[data-test="trigger-overview"]').attributes('aria-selected')).toBe('true')

    await wrapper.get('[data-test="trigger-usage"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['usage'])
    wrapper.unmount()
  })

  it('skips disabled triggers during keyboard navigation', async () => {
    const wrapper = mount(TabsHarness, {
      props: { disabledValues: ['usage'] },
      attachTo: document.body,
    })
    await wrapper.get('[data-test="trigger-overview"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-test="trigger-api"]').element)
    wrapper.unmount()
  })

  it('does not activate a disabled trigger on click', async () => {
    const wrapper = mount(TabsHarness, { props: { disabledValues: ['usage'] } })
    const trigger = wrapper.get('[data-test="trigger-usage"]')
    expect(trigger.attributes('disabled')).toBeDefined()
    expect(trigger.attributes('aria-disabled')).toBe('true')
    await trigger.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('uses vertical arrow keys when orientation is vertical', async () => {
    const wrapper = mount(TabsHarness, {
      props: { orientation: 'vertical' },
      attachTo: document.body,
    })
    expect(wrapper.get('[data-test="list"]').attributes('aria-orientation')).toBe('vertical')
    await wrapper.get('[data-test="trigger-overview"]').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('[data-test="trigger-usage"]').element)
    wrapper.unmount()
  })

  it('unmounts panels that are not active', async () => {
    const wrapper = mount(TabsHarness)
    expect(wrapper.find('[data-test="panel-usage"]').exists()).toBe(false)
    await wrapper.get('[data-test="trigger-usage"]').trigger('click')
    await nextTick()
    for (let index = 0; index < 3; index += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      await nextTick()
    }
    expect(wrapper.find('[data-test="panel-overview"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="panel-usage"]').exists()).toBe(true)
  })
})
