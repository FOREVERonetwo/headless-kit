import { computed, defineComponent, h, nextTick, toRef, unref } from 'vue'
import { createContext } from '../../utils/createContext.js'
import { useControllableState } from '../../utils/useControllableState.js'
import { useId } from '../../utils/useId.js'
import { Presence } from '../presence/index.js'

export const [provideAccordionContext, useAccordionContext] = createContext('Accordion')
export const [provideAccordionItemContext, useAccordionItemContext] = createContext('AccordionItem')

const triggerSelector = '[data-hk-accordion-trigger]:not([disabled])'

const normalise = (value) => {
  if (Array.isArray(value)) return value
  return value === undefined || value === null || value === '' ? [] : [value]
}

export const AccordionRoot = defineComponent({
  name: 'AccordionRoot',
  inheritAttrs: false,
  props: {
    type: { type: String, default: 'single', validator: (v) => ['single', 'multiple'].includes(v) },
    collapsible: { type: Boolean, default: true },
    orientation: {
      type: String,
      default: 'vertical',
      validator: (v) => ['vertical', 'horizontal'].includes(v),
    },
    modelValue: { type: [String, Array], default: undefined },
    defaultValue: { type: [String, Array], default: undefined },
    disabled: { type: Boolean, default: false },
    dir: { type: String, default: 'ltr' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit, attrs }) {
    const [value, isControlled] = useControllableState({
      prop: toRef(props, 'modelValue'),
      defaultProp: props.defaultValue,
      onChange: (next) => emit('update:modelValue', next),
    })

    const expanded = computed(() => normalise(value.value))

    const isItemDisabled = (itemDisabled) => Boolean(unref(props.disabled) || itemDisabled)

    const isExpanded = (itemValue) => expanded.value.includes(itemValue)

    const toggle = (itemValue, itemDisabled = false) => {
      if (isItemDisabled(itemDisabled)) return
      const current = expanded.value
      if (props.type === 'multiple') {
        value.value = current.includes(itemValue)
          ? current.filter((entry) => entry !== itemValue)
          : [...current, itemValue]
        return
      }
      if (current.includes(itemValue)) {
        if (props.collapsible) value.value = null
        return
      }
      value.value = itemValue
    }

    const context = {
      isControlled,
      type: toRef(props, 'type'),
      orientation: toRef(props, 'orientation'),
      dir: toRef(props, 'dir'),
      disabled: toRef(props, 'disabled'),
      expanded,
      isExpanded,
      toggle,
      isItemDisabled,
    }

    provideAccordionContext(context)

    return () =>
      slots.default?.({
        value: value.value,
        expanded: expanded.value,
        type: props.type,
        orientation: props.orientation,
        disabled: props.disabled,
        attrs,
      })
  },
})

export const AccordionItem = defineComponent({
  name: 'AccordionItem',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const root = useAccordionContext('AccordionItem')
    const uid = useId('accordion')

    const open = computed(() => root.isExpanded(props.value))
    const disabled = computed(() => root.isItemDisabled(props.disabled, props.value))

    const context = {
      value: toRef(props, 'value'),
      disabled,
      open,
      triggerId: `${uid}-trigger`,
      contentId: `${uid}-content`,
    }

    provideAccordionItemContext(context)

    return () =>
      slots.default?.({
        open: open.value,
        disabled: disabled.value,
        value: props.value,
        attrs,
      })
  },
})

export const AccordionHeader = defineComponent({
  name: 'AccordionHeader',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const item = useAccordionItemContext('AccordionHeader')

    return () =>
      slots.default?.({
        props: {
          'data-state': item.open.value ? 'open' : 'closed',
          'data-disabled': item.disabled.value ? '' : undefined,
        },
        attrs,
      })
  },
})

export const AccordionTrigger = defineComponent({
  name: 'AccordionTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const root = useAccordionContext('AccordionTrigger')
    const item = useAccordionItemContext('AccordionTrigger')

    const onKeydown = async (event) => {
      const isVertical = root.orientation.value === 'vertical'
      const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'
      const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
      if (![prevKey, nextKey, 'Home', 'End'].includes(event.key)) return

      const container = event.currentTarget?.closest('[data-hk-accordion]') ?? document
      const triggers = Array.from(container.querySelectorAll(triggerSelector))
      const index = triggers.indexOf(event.currentTarget)
      if (index === -1) return
      event.preventDefault()

      let target
      if (event.key === 'Home') target = triggers[0]
      else if (event.key === 'End') target = triggers[triggers.length - 1]
      else if (event.key === nextKey) target = triggers[(index + 1) % triggers.length]
      else target = triggers[(index - 1 + triggers.length) % triggers.length]

      await nextTick()
      target?.focus({ preventScroll: true })
    }

    const props = computed(() => ({
      id: item.triggerId,
      type: 'button',
      'data-hk-accordion-trigger': '',
      'data-state': item.open.value ? 'open' : 'closed',
      'data-disabled': item.disabled.value ? '' : undefined,
      'aria-expanded': item.open.value,
      'aria-controls': item.contentId,
      'aria-disabled': item.disabled.value ? 'true' : undefined,
      disabled: item.disabled.value,
      onClick: () => root.toggle(item.value.value, item.disabled.value),
      onKeydown,
    }))

    return () =>
      slots.default?.({
        open: item.open.value,
        disabled: item.disabled.value,
        props: props.value,
        attrs,
      })
  },
})

export const AccordionContent = defineComponent({
  name: 'AccordionContent',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const item = useAccordionItemContext('AccordionContent')

    return () =>
      h(
        Presence,
        { present: item.open.value },
        {
          default: (presence) =>
            slots.default?.({
              open: item.open.value,
              state: presence.state,
              isPresent: presence.isPresent,
              onAfterLeave: presence.onAfterLeave,
              props: {
                id: item.contentId,
                role: 'region',
                'aria-labelledby': item.triggerId,
                'data-state': item.open.value ? 'open' : 'closed',
              },
              attrs,
            }),
        },
      )
  },
})

export default AccordionRoot
