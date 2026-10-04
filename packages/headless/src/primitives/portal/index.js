import { Teleport, defineComponent, h } from 'vue'
import { usePortal } from '../../utils/usePortal.js'

export const Portal = defineComponent({
  name: 'Portal',
  props: {
    to: { type: [String, Object, Function], default: undefined },
    disabled: { type: Boolean, default: false },
    defer: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    const host = usePortal(() => props.to)

    return () => {
      if (props.disabled) return slots.default?.({ mounted: true })
      const target = host.value
      if (!target) return null
      return h(Teleport, { to: target, defer: props.defer }, slots.default?.({ mounted: true }))
    }
  },
})

export default Portal
