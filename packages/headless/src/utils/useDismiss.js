import { onBeforeUnmount, unref, watch } from 'vue'
import { useEventListener } from './useEventListener.js'

const layerStack = []

function pushLayer(token) {
  const index = layerStack.indexOf(token)
  if (index !== -1) layerStack.splice(index, 1)
  layerStack.push(token)
}

function removeLayer(token) {
  const index = layerStack.indexOf(token)
  if (index !== -1) layerStack.splice(index, 1)
}

function isTopLayer(token) {
  return layerStack.length > 0 && layerStack[layerStack.length - 1] === token
}

export function useDismiss(active, { onDismiss, ignore = [] } = {}) {
  const token = Symbol('headless-layer')
  let registered = false

  const sync = (value) => {
    if (value && !registered) {
      pushLayer(token)
      registered = true
    } else if (!value && registered) {
      removeLayer(token)
      registered = false
    }
  }

  watch(() => unref(active), sync, { immediate: true })

  onBeforeUnmount(() => {
    if (registered) {
      removeLayer(token)
      registered = false
    }
  })

  useEventListener(
    () => (typeof document === 'undefined' ? null : document),
    'keydown',
    (event) => {
      if (event.key !== 'Escape' || !registered || !isTopLayer(token)) return
      event.preventDefault()
      onDismiss?.('escape-key')
    },
    { capture: true },
  )

  useEventListener(
    () => (typeof document === 'undefined' ? null : document),
    'pointerdown',
    (event) => {
      if (!registered || !isTopLayer(token)) return
      const ignored = ignore.map((entry) => unref(entry)).filter(Boolean)
      const isIgnored = ignored.some(
        (node) => node === event.target || node?.contains?.(event.target),
      )
      if (isIgnored) return
      onDismiss?.('outside-press')
    },
    { capture: true },
  )

  return { token }
}

export const layerStackDepth = () => layerStack.length
