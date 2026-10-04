import { computed, nextTick, ref, unref } from 'vue'
import { useControllableState } from './useControllableState.js'
import { useEventListener } from './useEventListener.js'

export function useRovingFocus({
  orientation = 'horizontal',
  loop = true,
  activeId: controlledId,
  defaultActiveId = null,
  onActiveIdChange,
  disabled = false,
} = {}) {
  const [activeId, isControlled] = useControllableState({
    prop: controlledId,
    defaultProp: defaultActiveId,
    onChange: onActiveIdChange,
  })

  const containerRef = ref(null)

  const orientationKeys = computed(() => {
    const axis = unref(orientation)
    if (axis === 'vertical') return { prev: 'ArrowUp', next: 'ArrowDown' }
    if (axis === 'horizontal') return { prev: 'ArrowLeft', next: 'ArrowRight' }
    return {
      prev: 'ArrowUp',
      next: 'ArrowDown',
      prevSecondary: 'ArrowLeft',
      nextSecondary: 'ArrowRight',
    }
  })

  const getItems = () =>
    Array.from(unref(containerRef)?.querySelectorAll('[data-hk-roving-item]') ?? []).filter(
      (element) =>
        !element.hasAttribute('disabled') && element.getAttribute('aria-disabled') !== 'true',
    )

  const focusId = (id) => {
    const element = getItems().find((node) => node.id === id)
    element?.focus({ preventScroll: true })
  }

  const setActiveId = (id) => {
    if (disabled || !id) return
    activeId.value = id
  }

  const onKeydown = (event) => {
    if (disabled) return
    const items = getItems()
    if (items.length === 0) return

    const ids = items.map((element, index) => element.id || `hk-roving-${index}`)
    const tracked = ids.indexOf(activeId.value)
    const currentIndex = tracked === -1 ? items.indexOf(event.currentTarget) : tracked

    const { prev, next, prevSecondary, nextSecondary } = orientationKeys.value
    const isNext = event.key === next || event.key === nextSecondary
    const isPrev = event.key === prev || event.key === prevSecondary

    const from = currentIndex === -1 ? (isPrev ? items.length : -1) : currentIndex

    let nextIndex
    if (isNext) nextIndex = from + 1
    else if (isPrev) nextIndex = from - 1
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = items.length - 1
    else return

    event.preventDefault()

    const target = loop
      ? (nextIndex + items.length) % items.length
      : Math.min(Math.max(nextIndex, 0), items.length - 1)

    activeId.value = ids[target]
    nextTick(() => focusId(ids[target]))
  }

  const itemProps = (id, { disabled: itemDisabled = false } = {}) => ({
    id,
    tabindex: activeId.value === id && !itemDisabled ? 0 : -1,
    'data-hk-roving-item': '',
    'aria-disabled': itemDisabled ? 'true' : undefined,
    onFocus: () => {
      if (itemDisabled) return
      activeId.value = id
    },
  })

  useEventListener(() => unref(containerRef), 'keydown', onKeydown)

  return {
    activeId,
    isControlled,
    containerRef,
    itemProps,
    onKeydown,
    setActiveId,
    getItems,
    focusId,
  }
}
