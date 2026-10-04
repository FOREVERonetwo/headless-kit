import { onScopeDispose, unref, watch } from 'vue'

function resolveTargets(target) {
  const value = unref(target)
  if (!value) return []
  if (Array.isArray(value)) return value.flatMap((entry) => resolveTargets(entry))
  if (typeof value === 'function') return resolveTargets(value())
  if (typeof window !== 'undefined' && value === window) return [window]
  return [value]
}

export function useEventListener(target, event, handler, options) {
  if (typeof window === 'undefined') return () => {}

  let targets = []

  const events = Array.isArray(event) ? event : [event]

  const detach = () => {
    for (const element of targets) {
      for (const name of events) element.removeEventListener(name, handler, options)
    }
    targets = []
  }

  const attach = () => {
    detach()
    targets = resolveTargets(target)
    for (const element of targets) {
      for (const name of events) element.addEventListener(name, handler, options)
    }
  }

  if (typeof unref(target) === 'function' || (unref(target) && 'value' in unref(target))) {
    watch(() => resolveTargets(target), attach, { immediate: true, flush: 'post' })
  } else {
    attach()
  }

  onScopeDispose(detach)

  return () => detach()
}
