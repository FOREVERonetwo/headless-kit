import { computed, defineComponent, h, toRef, unref } from 'vue'
import { createContext } from '../../utils/createContext.js'
import { useControllableState } from '../../utils/useControllableState.js'
import { useId } from '../../utils/useId.js'

export const [provideCheckboxContext, useCheckboxContext] = createContext('Checkbox')

export const CheckboxRoot = defineComponent({
  name: 'CheckboxRoot',
  inheritAttrs: false,
  props: {
    modelValue: { type: [Boolean, Array], default: undefined },
    defaultValue: { type: [Boolean, Array], default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
    name: { type: String, default: undefined },
    id: { type: String, default: undefined },
    value: { type: String, default: 'on' },
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
      if (props.indeterminate) {
        checked.value = false
        emit('change', { checked: false })
        return
      }
      const current = checked.value
      if (Array.isArray(current)) {
        const next = current.includes(props.value)
          ? current.filter((entry) => entry !== props.value)
          : [...current, props.value]
        checked.value = next
        emit('change', { checked: next })
        return
      }
      checked.value = !current
      emit('change', { checked: checked.value })
    }

    const inputId = props.id ?? useId('checkbox')

    const state = computed(() => {
      if (props.indeterminate) return 'indeterminate'
      return checked.value ? 'checked' : 'unchecked'
    })

    provideCheckboxContext({
      checked,
      isControlled,
      disabled: toRef(props, 'disabled'),
      required: toRef(props, 'required'),
      indeterminate: toRef(props, 'indeterminate'),
      inputId,
      toggle,
      state,
    })

    return () =>
      slots.default?.({
        checked: checked.value,
        state: state.value,
        disabled: props.disabled,
        indeterminate: props.indeterminate,
        toggle,
        id: inputId,
        attrs,
      })
  },
})

export const CheckboxIndicator = defineComponent({
  name: 'CheckboxIndicator',
  inheritAttrs: false,
  props: { forceMount: { type: Boolean, default: false } },
  setup(props, { slots, attrs }) {
    const context = useCheckboxContext('CheckboxIndicator')
    const visible = computed(() => props.forceMount || context.state.value !== 'unchecked')
    return () =>
      visible.value
        ? slots.default?.({
            checked: context.checked.value,
            state: context.state.value,
            disabled: unref(context.disabled),
            indeterminate: unref(context.indeterminate),
            attrs,
          })
        : null
  },
})

export const CheckboxInput = defineComponent({
  name: 'CheckboxInput',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const context = useCheckboxContext('CheckboxInput')
    return () =>
      h('input', {
        ...attrs,
        type: 'checkbox',
        id: context.inputId,
        checked: Array.isArray(context.checked.value)
          ? context.checked.value.includes(attrs.value ?? 'on')
          : context.checked.value,
        disabled: unref(context.disabled),
        required: unref(context.required),
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

export default CheckboxRoot
