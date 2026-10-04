import { onMounted, shallowRef, unref } from 'vue'

export function usePortal(target) {
  const host = shallowRef(null)

  const resolve = () => {
    const value = typeof target === 'function' ? target() : unref(target)
    if (value) return value
    return typeof document === 'undefined' ? null : document.body
  }

  onMounted(() => {
    host.value = resolve()
  })

  return host
}
