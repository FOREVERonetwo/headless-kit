import { computed, defineComponent, h, ref, toRef, unref } from 'vue'
import { collectComponents } from '../../internal/collectComponents.js'
import { computePosition, usePosition } from '../../internal/usePosition.js'
import { createContext } from '../../utils/createContext.js'
import { useControllableState } from '../../utils/useControllableState.js'
import { useDismiss } from '../../utils/useDismiss.js'
import { useId } from '../../utils/useId.js'
import { useTypeahead } from '../../utils/useTypeahead.js'
import { Presence } from '../presence/index.js'
import { Portal } from '../portal/index.js'

export const [provideSelectContext, useSelectContext] = createContext('Select')

export const SelectRoot = defineComponent({
  name: 'SelectRoot',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number, Object, null], default: undefined },
    defaultValue: { type: [String, Number, Object, null], default: undefined },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    placement: { type: String, default: 'bottom' },
    offset: { type: Number, default: 4 },
    closeOnEscape: { type: Boolean, default: true },
    closeOnOutsideClick: { type: Boolean, default: true },
  },
  emits: ['update:modelValue', 'update:open', 'change'],
  setup(props, { slots, emit, attrs }) {
    const uid = useId('select')

    const [selected, isControlled] = useControllableState({
      prop: toRef(props, 'modelValue'),
      defaultProp: props.defaultValue,
      onChange: (value) => {
        emit('update:modelValue', value)
        emit('change', { value })
      },
    })

    const [open, isOpenControlled] = useControllableState({
      prop: toRef(props, 'open'),
      defaultProp: props.defaultOpen,
      onChange: (value) => emit('update:open', value),
    })

    const triggerRef = ref(null)
    const contentRef = ref(null)
    const position = ref(
      computePosition(null, null, { placement: props.placement, offset: props.offset }),
    )
    const registry = new Map()
    const registryVersion = ref(0)

    const triggerId = `${uid}-trigger`
    const contentId = `${uid}-content`

    const createEntry = (value) => ({
      value,
      id: `${contentId}-item-${String(value)}`,
      textValue: undefined,
      dynamicText: undefined,
      disabledProp: false,
      get text() {
        return this.textValue ?? this.dynamicText ?? String(value)
      },
      get disabled() {
        return this.disabledProp
      },
    })

    const ensureEntry = (value) => {
      let entry = registry.get(value)
      if (!entry) {
        entry = createEntry(value)
        registry.set(value, entry)
      }
      return entry
    }

    let registrySignature = ''

    const syncRegistry = (nodes) => {
      const next = new Map()
      let signature = ''
      nodes.forEach((node) => {
        const value = node.props?.value
        if (value === undefined || value === null) return
        const entry = ensureEntry(value)
        const textValue = node.props?.textValue
        const disabledProp = Boolean(node.props?.disabled)
        entry.textValue = textValue
        entry.disabledProp = disabledProp
        if (node.key !== undefined && node.key !== null) {
          entry.id = `${contentId}-item-${String(node.key)}`
        }
        next.set(value, entry)
        signature += `${String(value)}|${entry.id}|${textValue ?? ''}|${disabledProp}|`
      })
      for (const key of Array.from(registry.keys())) {
        if (!next.has(key)) registry.delete(key)
      }
      if (signature === registrySignature) return
      registrySignature = signature
      registryVersion.value += 1
    }

    const selectedItem = computed(() => {
      registryVersion.value
      return registry.get(selected.value) ?? null
    })

    const setOpen = (value) => {
      open.value = value
    }

    const select = (value) => {
      selected.value = value
      setOpen(false)
    }

    usePosition(
      triggerRef,
      contentRef,
      { placement: toRef(props, 'placement'), offset: toRef(props, 'offset') },
      position,
    )

    provideSelectContext({
      uid,
      selected,
      isControlled,
      open,
      isOpenControlled,
      disabled: toRef(props, 'disabled'),
      required: toRef(props, 'required'),
      name: toRef(props, 'name'),
      closeOnEscape: toRef(props, 'closeOnEscape'),
      closeOnOutsideClick: toRef(props, 'closeOnOutsideClick'),
      triggerRef,
      contentRef,
      position,
      registry,
      ensureEntry,
      syncRegistry,
      triggerId,
      contentId,
      selectedItem,
      select,
      setOpen,
      toggle: () => setOpen(!open.value),
      close: () => setOpen(false),
      show: () => setOpen(true),
    })

    return () =>
      slots.default?.({
        modelValue: selected.value,
        open: open.value,
        disabled: props.disabled,
        isControlled: isControlled.value,
        attrs,
      })
  },
})

export const SelectTrigger = defineComponent({
  name: 'SelectTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useSelectContext('SelectTrigger')

    const props = computed(() => ({
      ref: context.triggerRef,
      id: context.triggerId,
      type: 'button',
      role: 'combobox',
      'aria-haspopup': 'listbox',
      'aria-expanded': context.open.value,
      'aria-controls': context.contentId,
      'aria-required': context.required.value ? 'true' : undefined,
      'aria-disabled': context.disabled.value ? 'true' : undefined,
      'data-state': context.open.value ? 'open' : 'closed',
      disabled: context.disabled.value,
      onClick: () => {
        if (context.disabled.value) return
        context.toggle()
      },
      onKeydown: (event) => {
        if (context.disabled.value) return
        if (!['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) return
        event.preventDefault()
        context.show()
      },
    }))

    return () =>
      slots.default?.({
        open: context.open.value,
        selected: context.selected.value,
        disabled: context.disabled.value,
        props: props.value,
        attrs,
      })
  },
})

export const SelectValue = defineComponent({
  name: 'SelectValue',
  inheritAttrs: false,
  props: { placeholder: { type: String, default: '' } },
  setup(props, { slots, attrs }) {
    const context = useSelectContext('SelectValue')

    const display = computed(() => context.selectedItem.value?.text ?? props.placeholder)

    return () =>
      slots.default?.({
        selected: context.selected.value,
        value: display.value,
        placeholder: props.placeholder,
        hasSelection: context.selected.value !== undefined,
        props: {},
        attrs,
      })
  },
})

export const SelectIcon = defineComponent({
  name: 'SelectIcon',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => slots.default?.({ props: { 'aria-hidden': 'true' }, attrs })
  },
})

export const SelectPortal = defineComponent({
  name: 'SelectPortal',
  inheritAttrs: false,
  props: {
    to: { type: [String, Object, Function], default: undefined },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () =>
      h(Portal, { to: props.to, disabled: props.disabled }, { default: () => slots.default?.() })
  },
})

export const SelectContent = defineComponent({
  name: 'SelectContent',
  inheritAttrs: false,
  props: { forceMount: { type: Boolean, default: false } },
  setup(props, { slots, attrs }) {
    const root = useSelectContext('SelectContent')

    const activeValue = ref(undefined)

    useDismiss(
      computed(() => root.open.value),
      {
        ignore: [root.triggerRef, root.contentRef],
        onDismiss: (reason) => {
          if (reason === 'escape-key' && !root.closeOnEscape.value) return
          if (reason === 'outside-press' && !root.closeOnOutsideClick.value) return
          root.close()
        },
      },
    )

    const { handleTypeahead, resetSearch } = useTypeahead({
      values: () => Array.from(root.registry.values()).map((entry) => entry.text),
      onMatch: (_, index) => {
        const keys = Array.from(root.registry.keys())
        const key = keys[index]
        const entry = root.registry.get(key)
        if (!entry) return
        activeValue.value = key
        if (entry.disabled) return
        root.select(key)
      },
    })

    const moveActive = (direction) => {
      const keys = Array.from(root.registry.keys())
      if (keys.length === 0) return
      const current = keys.indexOf(activeValue.value)
      const next = current === -1 ? (direction > 0 ? 0 : keys.length - 1) : current + direction
      activeValue.value = keys[Math.min(Math.max(next, 0), keys.length - 1)]
    }

    const onKeydown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        moveActive(1)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        moveActive(-1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        activeValue.value = Array.from(root.registry.keys())[0]
      } else if (event.key === 'End') {
        event.preventDefault()
        const keys = Array.from(root.registry.keys())
        activeValue.value = keys[keys.length - 1]
      } else if (event.key === 'Tab') {
        event.preventDefault()
        root.close()
      } else {
        handleTypeahead(event.key)
      }
    }

    const contentProps = computed(() => ({
      ref: root.contentRef,
      id: root.contentId,
      role: 'listbox',
      tabindex: -1,
      'aria-labelledby': root.triggerId,
      'aria-activedescendant': root.registry.get(activeValue.value)?.id,
      'data-state': root.open.value ? 'open' : 'closed',
      'data-side': root.position.value.side,
      style: {
        position: 'fixed',
        top: `${root.position.value.y}px`,
        left: `${root.position.value.x}px`,
      },
      onKeydown,
    }))

    provideSelectContext({ ...root, activeValue, resetSearch })

    return () => {
      const shared = {
        open: root.open.value,
        state: 'mounted',
        isPresent: true,
        activeValue: activeValue.value,
        position: root.position.value,
        onAfterLeave: () => {},
        props: {},
        attrs: {},
      }
      root.syncRegistry(collectComponents(slots.default?.(shared), 'SelectItem'))

      return h(
        Presence,
        { present: root.open.value, forceMount: props.forceMount },
        {
          default: (presence) =>
            slots.default?.({
              ...shared,
              state: presence.state,
              isPresent: presence.isPresent,
              onAfterLeave: presence.onAfterLeave,
              props: contentProps.value,
              attrs,
            }),
        },
      )
    }
  },
})

export const SelectItem = defineComponent({
  name: 'SelectItem',
  inheritAttrs: false,
  props: {
    value: { type: [String, Number, Object], required: true },
    disabled: { type: Boolean, default: false },
    textValue: { type: String, default: undefined },
  },
  setup(props, { slots, attrs }) {
    const context = useSelectContext('SelectItem')
    const entry = context.ensureEntry(props.value)

    const isSelected = computed(() => context.selected.value === props.value)
    const isActive = computed(() => context.activeValue?.value === props.value)

    const itemProps = computed(() => ({
      id: entry.id,
      role: 'option',
      'aria-selected': isSelected.value,
      'aria-disabled': props.disabled ? 'true' : undefined,
      'data-state': isSelected.value ? 'checked' : 'unchecked',
      'data-highlighted': isActive.value ? '' : undefined,
      'data-disabled': props.disabled ? '' : undefined,
      onClick: () => {
        if (props.disabled) return
        context.select(props.value)
      },
      onMousemove: () => {
        if (props.disabled) return
        if (context.activeValue) context.activeValue.value = props.value
      },
    }))

    return () =>
      slots.default?.({
        selected: isSelected.value,
        highlighted: isActive.value,
        disabled: props.disabled,
        setText: (value) => {
          entry.dynamicText = value
        },
        props: itemProps.value,
        attrs,
      })
  },
})

export const SelectItemText = defineComponent({
  name: 'SelectItemText',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => slots.default?.({ props: {}, attrs })
  },
})

export const SelectHiddenInput = defineComponent({
  name: 'SelectHiddenInput',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const context = useSelectContext('SelectHiddenInput')
    return () =>
      h('input', {
        ...attrs,
        type: 'hidden',
        name: unref(context.name),
        value: context.selected.value ?? '',
        required: unref(context.required),
        disabled: unref(context.disabled),
      })
  },
})

export default SelectRoot
