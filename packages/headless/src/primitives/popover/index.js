import { computed, defineComponent, h, ref, toRef, unref, watch } from 'vue'
import { computePosition, usePosition } from '../../internal/usePosition.js'
import { getTabbable } from '../../utils/dom.js'
import { createContext } from '../../utils/createContext.js'
import { useControllableState } from '../../utils/useControllableState.js'
import { useDismiss } from '../../utils/useDismiss.js'
import { useId } from '../../utils/useId.js'
import { Presence } from '../presence/index.js'
import { Portal } from '../portal/index.js'

export const [providePopoverContext, usePopoverContext] = createContext('Popover')

const defaultPlacement = 'bottom'

export const PopoverRoot = defineComponent({
  name: 'PopoverRoot',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    placement: {
      type: String,
      default: defaultPlacement,
      validator: (value) =>
        ['top', 'right', 'bottom', 'left'].some((side) => value.startsWith(side)),
    },
    offset: { type: Number, default: 8 },
    closeOnEscape: { type: Boolean, default: true },
    closeOnOutsideClick: { type: Boolean, default: true },
  },
  emits: ['update:open'],
  setup(props, { slots, emit, attrs }) {
    const uid = useId('popover')

    const [open, isControlled] = useControllableState({
      prop: toRef(props, 'open'),
      defaultProp: props.defaultOpen,
      onChange: (value) => emit('update:open', value),
    })

    const triggerRef = ref(null)
    const contentRef = ref(null)
    const position = ref(computePosition(null, null, { placement: props.placement }))

    const setOpen = (value) => {
      open.value = value
    }

    const context = {
      open,
      isControlled,
      triggerRef,
      contentRef,
      position,
      placement: toRef(props, 'placement'),
      offset: toRef(props, 'offset'),
      closeOnEscape: toRef(props, 'closeOnEscape'),
      closeOnOutsideClick: toRef(props, 'closeOnOutsideClick'),
      triggerId: `${uid}-trigger`,
      contentId: `${uid}-content`,
      setOpen,
      toggle: () => setOpen(!open.value),
      close: () => setOpen(false),
      show: () => setOpen(true),
    }

    providePopoverContext(context)

    watch(open, (value) => {
      if (!value) unref(triggerRef)?.focus?.({ preventScroll: true })
    })

    return () =>
      slots.default?.({
        open: open.value,
        isControlled: isControlled.value,
        placement: props.placement,
        attrs,
      })
  },
})

export const PopoverTrigger = defineComponent({
  name: 'PopoverTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = usePopoverContext('PopoverTrigger')

    const props = computed(() => ({
      ref: context.triggerRef,
      id: context.triggerId,
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': context.open.value,
      'aria-controls': context.contentId,
      'data-state': context.open.value ? 'open' : 'closed',
      onClick: () => context.toggle(),
      onKeydown: (event) => {
        if (!['Enter', ' '].includes(event.key)) return
        event.preventDefault()
        context.toggle()
      },
    }))

    return () => slots.default?.({ open: context.open.value, props: props.value, attrs })
  },
})

export const PopoverPortal = defineComponent({
  name: 'PopoverPortal',
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

export const PopoverContent = defineComponent({
  name: 'PopoverContent',
  inheritAttrs: false,
  props: { forceMount: { type: Boolean, default: false } },
  setup(props, { slots, attrs }) {
    const context = usePopoverContext('PopoverContent')

    const { position } = usePosition(
      context.triggerRef,
      context.contentRef,
      {
        placement: context.placement,
        offset: context.offset,
      },
      context.position,
    )

    useDismiss(
      computed(() => context.open.value),
      {
        ignore: [context.triggerRef, context.contentRef],
        onDismiss: (reason) => {
          if (reason === 'escape-key' && !context.closeOnEscape.value) return
          if (reason === 'outside-press' && !context.closeOnOutsideClick.value) return
          context.close()
        },
      },
    )

    const contentProps = computed(() => ({
      ref: context.contentRef,
      id: context.contentId,
      role: 'dialog',
      tabindex: -1,
      'data-state': context.open.value ? 'open' : 'closed',
      'data-side': position.value.side,
      'data-align': position.value.align,
      style: {
        position: 'fixed',
        top: `${position.value.y}px`,
        left: `${position.value.x}px`,
      },
    }))

    const onKeydown = (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      event.preventDefault()
      const target = getTabbable(unref(context.contentRef))[0] ?? unref(context.contentRef)
      target?.focus?.({ preventScroll: true })
    }

    return () =>
      h(
        Presence,
        { present: context.open.value, forceMount: props.forceMount },
        {
          default: (presence) =>
            slots.default?.({
              open: context.open.value,
              state: presence.state,
              isPresent: presence.isPresent,
              position: position.value,
              onAfterLeave: presence.onAfterLeave,
              props: { ...contentProps.value, onKeydown },
              attrs,
            }),
        },
      )
  },
})

export const PopoverArrow = defineComponent({
  name: 'PopoverArrow',
  inheritAttrs: false,
  props: { size: { type: Number, default: 8 } },
  setup(props, { slots, attrs }) {
    const context = usePopoverContext('PopoverArrow')
    const position = context.position

    const arrowProps = computed(() => {
      const vertical = position.value.side === 'top' || position.value.side === 'bottom'
      return {
        'data-side': position.value.side,
        'data-align': position.value.align,
        'aria-hidden': 'true',
        style: {
          position: 'absolute',
          width: `${props.size}px`,
          height: `${props.size}px`,
          ...(vertical
            ? {
                left: `${position.value.arrowX ?? 0}px`,
                ...(position.value.side === 'top' ? { bottom: '0px' } : { top: '0px' }),
              }
            : {
                top: `${position.value.arrowY ?? 0}px`,
                ...(position.value.side === 'left' ? { right: '0px' } : { left: '0px' }),
              }),
        },
      }
    })

    return () => slots.default?.({ position: position.value, props: arrowProps.value, attrs })
  },
})

export default PopoverRoot
