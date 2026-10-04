import { computed, defineComponent, h, toRef, watch } from 'vue'
import { createContext } from '../../utils/createContext.js'
import { useControllableState } from '../../utils/useControllableState.js'
import { useId } from '../../utils/useId.js'
import { useRovingFocus } from '../../utils/useRovingFocus.js'
import { composeEventHandlers } from '../../utils/mergeRefs.js'
import { Presence } from '../presence/index.js'

export const [provideTabsContext, useTabsContext] = createContext('Tabs')
export const [provideTabsListContext, useTabsListContext] = createContext('TabsList')

export const TabsRoot = defineComponent({
  name: 'TabsRoot',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number], default: undefined },
    defaultValue: { type: [String, Number], default: undefined },
    orientation: {
      type: String,
      default: 'horizontal',
      validator: (v) => ['horizontal', 'vertical'].includes(v),
    },
    activationMode: {
      type: String,
      default: 'automatic',
      validator: (v) => ['automatic', 'manual'].includes(v),
    },
    dir: { type: String, default: 'ltr' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit, attrs }) {
    const uid = useId('tabs')
    const registry = new Map()

    const triggerId = (value) => `${uid}-trigger-${String(value)}`
    const contentId = (value) => `${uid}-content-${String(value)}`

    const [value, isControlled] = useControllableState({
      prop: toRef(props, 'modelValue'),
      defaultProp: props.defaultValue,
      onChange: (next) => emit('update:modelValue', next),
    })

    const select = (next) => {
      if (value.value === next) return
      value.value = next
    }

    const valueFromId = (id) => {
      for (const [item, itemId] of registry) {
        if (itemId === id) return item
      }
      return undefined
    }

    provideTabsContext({
      baseId: uid,
      value,
      isControlled,
      orientation: toRef(props, 'orientation'),
      activationMode: toRef(props, 'activationMode'),
      dir: toRef(props, 'dir'),
      select,
      triggerId,
      contentId,
      valueFromId,
      registry,
    })

    return () =>
      slots.default?.({
        value: value.value,
        orientation: props.orientation,
        activationMode: props.activationMode,
        isControlled: isControlled.value,
        attrs,
      })
  },
})

export const TabsList = defineComponent({
  name: 'TabsList',
  inheritAttrs: false,
  props: { loop: { type: Boolean, default: true } },
  setup(props, { slots, attrs }) {
    const root = useTabsContext('TabsList')

    const roving = useRovingFocus({
      orientation: root.orientation,
      loop: props.loop,
      defaultActiveId: root.value.value === undefined ? null : root.triggerId(root.value.value),
      onActiveIdChange: (id) => {
        if (root.activationMode.value !== 'automatic') return
        const next = root.valueFromId(id)
        if (next !== undefined) root.select(next)
      },
    })

    watch(
      () => root.value.value,
      (next) => {
        if (next === undefined || root.activationMode.value !== 'automatic') return
        roving.activeId.value = root.triggerId(next)
      },
    )

    const focusedValue = computed(() => root.valueFromId(roving.activeId.value))

    provideTabsListContext({ roving, focusedValue })

    return () =>
      slots.default?.({
        props: {
          role: 'tablist',
          'aria-orientation': root.orientation.value,
          'data-orientation': root.orientation.value,
          ref: roving.containerRef,
        },
        attrs,
      })
  },
})

export const TabsTrigger = defineComponent({
  name: 'TabsTrigger',
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const root = useTabsContext('TabsTrigger')
    const list = useTabsListContext('TabsTrigger')

    const id = computed(() => {
      root.registry.set(props.value, root.triggerId(props.value))
      return root.triggerId(props.value)
    })
    const selected = computed(() => root.value.value === props.value)

    const onKeydown = (event) => {
      if (!['Enter', ' '].includes(event.key)) return
      event.preventDefault()
      root.select(props.value)
    }

    const triggerProps = computed(() => ({
      ...list.roving.itemProps(id.value, { disabled: props.disabled }),
      type: 'button',
      role: 'tab',
      'aria-selected': selected.value,
      'aria-controls': root.contentId(props.value),
      'data-state': selected.value ? 'active' : 'inactive',
      'data-value': String(props.value),
      disabled: props.disabled,
      onClick: () => {
        if (props.disabled) return
        root.select(props.value)
      },
      onKeydown: composeEventHandlers(list.roving.onKeydown, onKeydown),
    }))

    return () =>
      slots.default?.({
        selected: selected.value,
        focused: list.focusedValue.value === props.value,
        props: triggerProps.value,
        attrs,
      })
  },
})

export const TabsContent = defineComponent({
  name: 'TabsContent',
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], required: true },
    forceMount: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const root = useTabsContext('TabsContent')
    const selected = computed(() => root.value.value === props.value)

    return () =>
      h(
        Presence,
        { present: selected.value, forceMount: props.forceMount },
        {
          default: (presence) =>
            slots.default?.({
              selected: selected.value,
              state: presence.state,
              isPresent: presence.isPresent,
              onAfterLeave: presence.onAfterLeave,
              props: {
                role: 'tabpanel',
                id: root.contentId(props.value),
                'aria-labelledby': root.triggerId(props.value),
                'data-state': selected.value ? 'active' : 'inactive',
                tabindex: 0,
              },
              attrs,
            }),
        },
      )
  },
})

export default TabsRoot
