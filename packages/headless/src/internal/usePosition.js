import { onBeforeUnmount, ref, toValue, watch } from 'vue'

const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max))

const resolvePlacement = (placement) => String(toValue(placement) ?? 'bottom')

export function computePosition(
  reference,
  floating,
  { placement = 'bottom', offset = 8, padding = 8, arrowSize = 8 } = {},
) {
  const fallback = {
    x: 0,
    y: 0,
    side: resolvePlacement(placement).split('-')[0],
    align: 'center',
    arrowX: null,
    arrowY: null,
    ready: false,
  }
  if (!reference || !floating || typeof reference.getBoundingClientRect !== 'function') {
    return fallback
  }

  const rect = reference.getBoundingClientRect()
  const box = floating.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const [preferredSide, preferredAlign = 'center'] = resolvePlacement(placement).split('-')

  const fits = {
    top: rect.top - box.height - offset >= padding,
    bottom: rect.bottom + box.height + offset <= viewportHeight - padding,
    left: rect.left - box.width - offset >= padding,
    right: rect.right + box.width + offset <= viewportWidth - padding,
  }

  let side = preferredSide
  if (!fits[side] && fits[OPPOSITE[side]]) side = OPPOSITE[side]

  let x = rect.left + rect.width / 2 - box.width / 2
  let y = rect.top + rect.height / 2 - box.height / 2
  let align = preferredAlign

  if (side === 'top') y = rect.top - box.height - offset
  else if (side === 'bottom') y = rect.bottom + offset
  else if (side === 'left') x = rect.left - box.width - offset
  else x = rect.right + offset

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') x = rect.left
    else if (align === 'end') x = rect.right - box.width
    x = clamp(x, padding, Math.max(padding, viewportWidth - box.width - padding))
  } else {
    if (align === 'start') y = rect.top
    else if (align === 'end') y = rect.bottom - box.height
    y = clamp(y, padding, Math.max(padding, viewportHeight - box.height - padding))
  }

  const centreX = rect.left + rect.width / 2 - x
  const centreY = rect.top + rect.height / 2 - y
  const arrowX =
    side === 'top' || side === 'bottom'
      ? clamp(centreX - arrowSize / 2, arrowSize, Math.max(arrowSize, box.width - arrowSize))
      : null
  const arrowY =
    side === 'left' || side === 'right'
      ? clamp(centreY - arrowSize / 2, arrowSize, Math.max(arrowSize, box.height - arrowSize))
      : null

  return { x, y, side, align, arrowX, arrowY, ready: true }
}

export function usePosition(referenceRef, floatingRef, options = {}, target) {
  const position = target ?? ref(computePosition(null, null, options))

  const update = () => {
    position.value = computePosition(referenceRef.value, floatingRef.value, options)
  }

  const onViewportChange = () => update()

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true)
  }

  watch([referenceRef, floatingRef], () => update(), { immediate: true, flush: 'post' })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('scroll', onViewportChange, true)
  })

  return { position, update }
}
