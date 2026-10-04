import { computed, defineComponent, h, onBeforeUnmount, ref, toRef, watch } from 'vue'
import { computePosition, usePosition } from '../../internal/usePosition.js'
import { createContext } from '../../utils/createContext.js'
import { useControllableState } from '../../utils/useControllableState.js'
import { useDismiss } from '../../utils/useDismiss.js'
import { useId } from '../../utils/useId.js'
import { Presence } from '../presence/index.js'
import { Portal } from '../portal/index.js'

export const [provideTooltipProviderContext, useTooltipProviderContext] = createContext(
  'TooltipProvider',
  { optional: true },
)
export const [provideTooltipContext, useTooltipContext] = createContext('Tooltip')

export const TooltipProvider = defineComponent({
  name: 'TooltipProvider',
  props: {
    delayDuration: { type: Number, default: 300 },
    skipDelayDuration: { type: Number, default: 300 },
    disableHoverableContent: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const isOpenDelayed = ref(true)
    let openTimer = null
    let closeTimer = null

    const clearTimers = () => {
      if (openTimer) clearTimeout(openTimer)
      if (closeTimer) clearTimeout(closeTimer)
      openTimer = null
      closeTimer = null
    }

    const onOpen = () =>
      new Promise((resolve) => {
        if (!isOpenDelayed.value) {
          resolve(true)
          return
        }
        openTimer = setTimeout(() => {
          openTimer = null
          isOpenDelayed.value = false
          resolve(true)
        }, props.delayDuration)
      })

    const onClose = () => {
      if (openTimer) {
        clearTimeout(openTimer)
        openTimer = null
      }
      if (props.skipDelayDuration <= 0) return
      if (closeTimer) clearTimeout(closeTimer)
      closeTimer = setTimeout(() => {
        closeTimer = null
        isOpenDelayed.value = true
      }, props.skipDelayDuration)
    }

    onBeforeUnmount(clearTimers)

    provideTooltipProviderContext({
      delayDuration: toRef(props, 'delayDuration'),
      disableHoverableContent: toRef(props, 'disableHoverableContent'),
      isOpenDelayed,
      onOpen,
      onClose,
    })

    return () => slots.default?.({ delayDuration: props.delayDuration })
  },
})

export const TooltipRoot = defineComponent({
  name: 'TooltipRoot',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    delayDuration: { type: Number, default: undefined },
    disableHoverableContent: { type: Boolean, default: undefined },
  },
  emits: ['update:open'],
  setup(props, { slots, emit, attrs }) {
    const provider = useTooltipProviderContext('TooltipRoot')
    const uid = useId('tooltip')

    const [open, isControlled] = useControllableState({
      prop: toRef(props, 'open'),
      defaultProp: props.defaultOpen,
      onChange: (value) => emit('update:open', value),
    })

    const triggerRef = ref(null)
    const contentRef = ref(null)
    const position = ref(computePosition(null, null, {}))
    let pendingTimer = null

    const clearPending = () => {
      if (pendingTimer) clearTimeout(pendingTimer)
      pendingTimer = null
    }

    const show = () => {
      open.value = true
    }

    const showWithDelay = () => {
      clearPending()
      if (props.delayDuration !== undefined) {
        pendingTimer = setTimeout(() => {
          pendingTimer = null
          show()
        }, props.delayDuration)
        return
      }
      if (!provider) {
        show()
        return
      }
      provider.onOpen().then((ready) => {
        if (ready) show()
      })
    }

    const hide = () => {
      clearPending()
      provider?.onClose()
      open.value = false
    }

    watch(open, (value) => {
      if (!value) clearPending()
    })

    onBeforeUnmount(clearPending)

    provideTooltipContext({
      open,
      isControlled,
      triggerRef,
      contentRef,
      position,
      triggerId: `${uid}-trigger`,
      contentId: `${uid}-content`,
      disableHoverableContent: computed(
        () => props.disableHoverableContent ?? provider?.disableHoverableContent.value ?? false,
      ),
      show,
      showWithDelay,
      hide,
      setOpen: (value) => {
        open.value = value
      },
    })

    return () =>
      slots.default?.({
        open: open.value,
        isControlled: isControlled.value,
        attrs,
      })
  },
})

export const TooltipTrigger = defineComponent({
  name: 'TooltipTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useTooltipContext('TooltipTrigger')

    const props = computed(() => ({
      ref: context.triggerRef,
      id: context.triggerId,
      'aria-describedby': context.open.value ? context.contentId : undefined,
      'data-state': context.open.value ? 'open' : 'closed',
      onMouseenter: () => context.showWithDelay(),
      onMouseleave: () => context.hide(),
      onFocus: () => context.showWithDelay(),
      onBlur: () => context.hide(),
      onClick: () => context.hide(),
    }))

    return () => slots.default?.({ open: context.open.value, props: props.value, attrs })
  },
})

export const TooltipPortal = defineComponent({
  name: 'TooltipPortal',
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

export const TooltipContent = defineComponent({
  name: 'TooltipContent',
  inheritAttrs: false,
  props: {
    placement: { type: String, default: 'top' },
    offset: { type: Number, default: 8 },
    sideOffset: { type: Number, default: undefined },
    forceMount: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const context = useTooltipContext('TooltipContent')

    usePosition(
      context.triggerRef,
      context.contentRef,
      { placement: props.placement, offset: props.sideOffset ?? props.offset },
      context.position,
    )

    useDismiss(
      computed(() => context.open.value),
      {
        ignore: [context.triggerRef, context.contentRef],
        onDismiss: () => context.hide(),
      },
    )

    const contentProps = computed(() => ({
      ref: context.contentRef,
      id: context.contentId,
      role: 'tooltip',
      'data-state': context.open.value ? 'open' : 'closed',
      'data-side': context.position.value.side,
      style: {
        position: 'fixed',
        top: `${context.position.value.y}px`,
        left: `${context.position.value.x}px`,
      },
    }))

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
              position: context.position.value,
              onAfterLeave: presence.onAfterLeave,
              props: contentProps.value,
              attrs,
            }),
        },
      )
  },
})

export const TooltipArrow = defineComponent({
  name: 'TooltipArrow',
  inheritAttrs: false,
  props: { size: { type: Number, default: 6 } },
  setup(props, { slots, attrs }) {
    const context = useTooltipContext('TooltipArrow')

    const arrowProps = computed(() => {
      const { position } = context
      const vertical = position.value.side === 'top' || position.value.side === 'bottom'
      return {
        'data-side': position.value.side,
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

    return () =>
      slots.default?.({ position: context.position.value, props: arrowProps.value, attrs })
  },
})

export default TooltipRoot
