import { defineComponent, toRef } from 'vue'
import { usePresence } from '../../utils/usePresence.js'

export const Presence = defineComponent({
  name: 'Presence',
  props: {
    present: { type: Boolean, default: false },
    forceMount: { type: Boolean, default: false },
  },
  emits: ['afterLeave'],
  setup(props, { slots, emit }) {
    const { state, shouldRender, completeExit } = usePresence(toRef(props, 'present'))

    return () => {
      if (!shouldRender.value && !props.forceMount) return null
      return slots.default?.({
        state: state.value,
        present: props.present,
        isPresent: state.value === 'mounted',
        onAfterLeave: () => {
          completeExit()
          emit('afterLeave')
        },
      })
    }
  },
})

export default Presence
