import { defineComponent, h } from 'vue'

const baseStyle = {
  position: 'absolute',
  border: 0,
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
}

export const VisuallyHidden = defineComponent({
  name: 'VisuallyHidden',
  inheritAttrs: false,
  props: {
    as: { type: [String, Object, Function], default: 'span' },
    feature: {
      type: String,
      default: 'not-intractable',
      validator: (value) => ['focusable', 'not-intractable'].includes(value),
    },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          'data-hk-visually-hidden': props.feature,
          style: [
            baseStyle,
            props.feature === 'focusable' ? { overflow: 'visible' } : null,
            attrs.style,
          ],
        },
        slots.default?.(),
      )
  },
})

export default VisuallyHidden
