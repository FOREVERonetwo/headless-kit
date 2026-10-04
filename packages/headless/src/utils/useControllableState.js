import { computed, ref, toValue } from 'vue'

export function useControllableState({ prop, defaultProp, onChange } = {}) {
  const isControlled = computed(() => toValue(prop) !== undefined)
  const internalValue = ref(toValue(defaultProp))

  const value = computed({
    get() {
      return isControlled.value ? toValue(prop) : internalValue.value
    },
    set(next) {
      const resolved = typeof next === 'function' ? next(value.value) : next
      if (Object.is(resolved, value.value)) return
      if (!isControlled.value) internalValue.value = resolved
      onChange?.(resolved)
    },
  })

  return [value, isControlled]
}
