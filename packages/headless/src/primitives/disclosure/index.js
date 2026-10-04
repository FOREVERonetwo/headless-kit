import { computed, defineComponent, h, toRef } from 'vue'
import { createContext } from '../../utils/createContext.js'
import { useControllableState } from '../../utils/useControllableState.js'
import { useId } from '../../utils/useId.js'
import { Presence } from '../presence/index.js'

export const [provideDisclosureContext, useDisclosureContext] = createContext('Disclosure')

export const DisclosureRoot = defineComponent({
  name: 'DisclosureRoot',
  inheritAttrs: false,
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:open', 'toggle'],
  setup(props, { slots, emit }) {
    const [open, isControlled] = useControllableState({
      prop: toRef(props, 'open'),
      defaultProp: props.defaultOpen,
      onChange: (value) => {
        emit('update:open', value)
        emit('toggle', value)
      },
    })

    const uid = useId('disclosure')
    const context = {
      open,
      isControlled,
      disabled: toRef(props, 'disabled'),
      triggerId: `${uid}-trigger`,
      contentId: `${uid}-content`,
      setOpen: (value) => {
        open.value = value
      },
      toggle: () => {
        if (props.disabled) return
        open.value = !open.value
      },
    }

    provideDisclosureContext(context)

    return () =>
      slots.default?.({
        open: open.value,
        disabled: props.disabled,
        isControlled: isControlled.value,
        toggle: context.toggle,
        setOpen: context.setOpen,
      })
  },
})

export const DisclosureTrigger = defineComponent({
  name: 'DisclosureTrigger',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useDisclosureContext('DisclosureTrigger')

    const props = computed(() => ({
      id: context.triggerId,
      type: attrs.type ?? 'button',
      'aria-expanded': context.open.value,
      'aria-controls': context.contentId,
      'aria-disabled': context.disabled.value ? 'true' : undefined,
      'data-state': context.open.value ? 'open' : 'closed',
      'data-disabled': context.disabled.value ? '' : undefined,
      disabled: context.disabled.value,
      onClick: (event) => {
        if (context.disabled.value) {
          event.preventDefault()
          return
        }
        context.toggle()
      },
    }))

    return () => slots.default?.({ open: context.open.value, props: props.value, attrs })
  },
})

export const DisclosureContent = defineComponent({
  name: 'DisclosureContent',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useDisclosureContext('DisclosureContent')

    return () =>
      h(
        Presence,
        { present: context.open.value },
        {
          default: (presence) => {
            const props = {
              id: context.contentId,
              role: 'region',
              'aria-labelledby': context.triggerId,
              'data-state': context.open.value ? 'open' : 'closed',
            }
            return slots.default?.({
              open: context.open.value,
              state: presence.state,
              isPresent: presence.isPresent,
              onAfterLeave: presence.onAfterLeave,
              props,
              attrs,
            })
          },
        },
      )
  },
})

export default DisclosureRoot
