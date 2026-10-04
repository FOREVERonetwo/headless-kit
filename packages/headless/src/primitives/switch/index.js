import { computed, defineComponent, h, toRef, unref } from 'vue'
import { createContext } from '../../utils/createContext.js'
import { useControllableState } from '../../utils/useControllableState.js'
import { useId } from '../../utils/useId.js'

export const [provideSwitchContext, useSwitchContext] = createContext('Switch')

export const SwitchRoot = defineComponent({
  name: 'SwitchRoot',
  inheritAttrs: false,
  props: {
    modelValue: { type: Boolean, default: undefined },
    defaultValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    id: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { slots, emit, attrs }) {
    const [checked, isControlled] = useControllableState({
      prop: toRef(props, 'modelValue'),
      defaultProp: props.defaultValue,
      onChange: (value) => emit('update:modelValue', value),
    })

    const toggle = () => {
      if (unref(props.disabled)) return
      checked.value = !checked.value
      emit('change', { checked: checked.value })
    }

    const inputId = props.id ?? useId('switch')

    const context = {
      checked,
      isControlled,
      disabled: toRef(props, 'disabled'),
      required: toRef(props, 'required'),
      name: toRef(props, 'name'),
      inputId,
      toggle,
    }

    provideSwitchContext(context)

    const state = computed(() => (checked.value ? 'checked' : 'unchecked'))

    return () =>
      slots.default?.({
        checked: checked.value,
        disabled: props.disabled,
        required: props.required,
        toggle,
        id: inputId,
        attrs,
        state: state.value,
      })
  },
})

export const SwitchThumb = defineComponent({
  name: 'SwitchThumb',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    const context = useSwitchContext('SwitchThumb')
    return () =>
      slots.default?.({
        checked: context.checked.value,
        disabled: unref(context.disabled),
        attrs,
      })
  },
})

export const SwitchInput = defineComponent({
  name: 'SwitchInput',
  inheritAttrs: false,
  props: { value: { type: String, default: 'on' } },
  setup(_, { attrs }) {
    const context = useSwitchContext('SwitchInput')
    return () =>
      h('input', {
        ...attrs,
        type: 'checkbox',
        role: 'switch',
        id: context.inputId,
        name: unref(context.name),
        checked: context.checked.value,
        disabled: unref(context.disabled),
        required: unref(context.required),
        value: attrs.value ?? 'on',
        tabindex: '-1',
        'aria-hidden': 'true',
        style: {
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: '0',
          margin: '0px',
          pointerEvents: 'none',
        },
        onChange: () => context.toggle(),
      })
  },
})

export default SwitchRoot
