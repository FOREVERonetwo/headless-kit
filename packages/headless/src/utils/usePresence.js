import { computed, nextTick, onBeforeUnmount, ref, unref, watch } from 'vue'

const raf =
  typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame
    : (callback) => setTimeout(() => callback(Date.now()), 16)

function hasRunningAnimations() {
  if (typeof document === 'undefined') return false
  if (typeof document.getAnimations !== 'function') return false
  return document.getAnimations().some((animation) => animation.playState === 'running')
}

export function usePresence(present, { autoExit = true } = {}) {
  const state = ref(unref(present) ? 'mounted' : 'unmounted')

  const completeExit = () => {
    if (state.value === 'unmounting') state.value = 'unmounted'
  }

  watch(
    () => unref(present),
    (value) => {
      if (value) {
        state.value = 'mounted'
        return
      }
      if (state.value !== 'mounted') return
      state.value = 'unmounting'
      if (!autoExit) return
      nextTick(() => {
        raf(() => {
          raf(() => {
            if (!hasRunningAnimations()) completeExit()
          })
        })
      })
    },
    { flush: 'post' },
  )

  onBeforeUnmount(() => {
    state.value = 'unmounted'
  })

  const shouldRender = computed(() => state.value !== 'unmounted')

  return { state, shouldRender, completeExit }
}
