import { nextTick, unref, watch } from 'vue'
import { getTabbable } from './dom.js'
import { useEventListener } from './useEventListener.js'

function focusElement(element) {
  if (!element || typeof element.focus !== 'function') return
  element.focus({ preventScroll: true })
}

export function useFocusTrap(containerRef, active = true, { initialFocus } = {}) {
  let previouslyFocused = null

  const resolveInitial = (container) => {
    if (!initialFocus) return undefined
    if (typeof initialFocus === 'function') return initialFocus()
    const value = unref(initialFocus)
    if (typeof value === 'string') return container.querySelector(value)
    return value ?? undefined
  }

  const onKeydown = (event) => {
    if (event.key !== 'Tab' || event.defaultPrevented) return
    const container = unref(containerRef)
    if (!container) return
    const tabbable = getTabbable(container)
    if (tabbable.length === 0) {
      event.preventDefault()
      focusElement(container)
      return
    }
    const first = tabbable[0]
    const last = tabbable[tabbable.length - 1]
    const current = document.activeElement
    const inside = container.contains(current)

    if (event.shiftKey && (current === first || !inside)) {
      event.preventDefault()
      focusElement(last)
    } else if (!event.shiftKey && (current === last || !inside)) {
      event.preventDefault()
      focusElement(first)
    }
  }

  const activate = async () => {
    previouslyFocused = document.activeElement
    await nextTick()
    const container = unref(containerRef)
    if (!container) return
    const tabbable = getTabbable(container)
    const target =
      resolveInitial(container) ??
      tabbable.find((element) => element.hasAttribute('data-hk-autofocus')) ??
      tabbable[0]
    focusElement(target ?? container)
  }

  const deactivate = () => {
    if (!previouslyFocused) return
    const target = previouslyFocused
    previouslyFocused = null
    if (typeof target.isConnected === 'boolean' && !target.isConnected) return
    focusElement(target)
  }

  useEventListener(() => unref(containerRef), 'keydown', onKeydown)

  watch(
    () => unref(active),
    (value) => {
      if (value) activate()
      else deactivate()
    },
    { immediate: true, flush: 'post' },
  )

  return { activate, deactivate }
}
