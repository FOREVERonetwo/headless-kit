import { computed, defineComponent, h, ref, toRef } from 'vue'
import { createContext } from '../../utils/createContext.js'
import { useControllableState } from '../../utils/useControllableState.js'
import { useDismiss } from '../../utils/useDismiss.js'
import { useFocusTrap } from '../../utils/useFocusTrap.js'
import { useId } from '../../utils/useId.js'
import { useScrollLock } from '../../utils/useScrollLock.js'
import { Presence } from '../presence/index.js'
import { Portal } from '../portal/index.js'

export const [provideDialogContext, useDialogContext] = createContext('Dialog')

export const DialogRoot = defineComponent({
  name: 'DialogRoot',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    modal: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    closeOnOutsideClick: { type: Boolean, default: true },
  },
  emits: ['update:open'],
  setup(props, { slots, emit, attrs }) {
    const uid = useId('dialog')

    const [open, isControlled] = useControllableState({
      prop: toRef(props, 'open'),
      defaultProp: props.defaultOpen,
      onChange: (value) => emit('update:open', value),
    })

    const triggerRef = ref(null)
    const contentRef = ref(null)

    const setOpen = (value) => {
      open.value = value
    }

    const context = {
      open,
      isControlled,
      modal: toRef(props, 'modal'),
      closeOnEscape: toRef(props, 'closeOnEscape'),
      closeOnOutsideClick: toRef(props, 'closeOnOutsideClick'),
      triggerRef,
      contentRef,
      triggerId: `${uid}-trigger`,
      contentId: `${uid}-content`,
      titleId: `${uid}-title`,
      descriptionId: `${uid}-description`,
      setOpen,
      trigger: () => setOpen(true),
      dismiss: () => setOpen(false),
    }

    provideDialogContext(context)

    return () =>
      slots.default?.({
        open: open.value,
        modal: props.modal,
        isControlled: isControlled.value,
        attrs,
      })
  },
})

export const DialogTrigger = defineComponent({
  name: 'DialogTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useDialogContext('DialogTrigger')

    const props = computed(() => ({
      ref: context.triggerRef,
      id: context.triggerId,
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': context.open.value,
      'aria-controls': context.contentId,
      'data-state': context.open.value ? 'open' : 'closed',
      onClick: () => context.trigger(),
    }))

    return () => slots.default?.({ open: context.open.value, props: props.value, attrs })
  },
})

export const DialogOverlay = defineComponent({
  name: 'DialogOverlay',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useDialogContext('DialogOverlay')

    return () =>
      h(
        Presence,
        { present: context.open.value },
        {
          default: (presence) =>
            slots.default?.({
              open: context.open.value,
              state: presence.state,
              isPresent: presence.isPresent,
              onAfterLeave: presence.onAfterLeave,
              props: {
                'data-state': context.open.value ? 'open' : 'closed',
                style: { position: 'fixed', inset: '0' },
              },
              attrs,
            }),
        },
      )
  },
})

export const DialogContent = defineComponent({
  name: 'DialogContent',
  inheritAttrs: false,
  props: {
    initialFocus: { type: [String, Object, Function], default: undefined },
    forceMount: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const context = useDialogContext('DialogContent')

    useScrollLock(computed(() => context.open.value && context.modal.value))

    useFocusTrap(context.contentRef, context.open, {
      initialFocus: () => props.initialFocus,
    })

    useDismiss(
      computed(() => context.open.value),
      {
        ignore: [context.triggerRef, context.contentRef],
        onDismiss: (reason) => {
          if (reason === 'escape-key' && !context.closeOnEscape.value) return
          if (reason === 'outside-press' && !context.closeOnOutsideClick.value) return
          context.dismiss()
        },
      },
    )

    const contentProps = computed(() => ({
      ref: context.contentRef,
      id: context.contentId,
      role: 'dialog',
      tabindex: -1,
      'aria-modal': context.modal.value ? 'true' : undefined,
      'aria-labelledby': context.titleId,
      'aria-describedby': context.descriptionId,
      'data-state': context.open.value ? 'open' : 'closed',
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
              onAfterLeave: presence.onAfterLeave,
              props: contentProps.value,
              attrs,
            }),
        },
      )
  },
})

export const DialogPortal = defineComponent({
  name: 'DialogPortal',
  inheritAttrs: false,
  props: {
    to: { type: [String, Object, Function], default: undefined },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        Portal,
        { to: props.to, disabled: props.disabled },
        { default: () => slots.default?.({ attrs }) },
      )
  },
})

export const DialogTitle = defineComponent({
  name: 'DialogTitle',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useDialogContext('DialogTitle')
    return () => slots.default?.({ props: { id: context.titleId }, attrs })
  },
})

export const DialogDescription = defineComponent({
  name: 'DialogDescription',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useDialogContext('DialogDescription')
    return () => slots.default?.({ props: { id: context.descriptionId }, attrs })
  },
})

export const DialogClose = defineComponent({
  name: 'DialogClose',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useDialogContext('DialogClose')
    const props = computed(() => ({
      type: 'button',
      onClick: () => context.dismiss(),
    }))
    return () => slots.default?.({ open: context.open.value, props: props.value, attrs })
  },
})

export default DialogRoot
