export const focusableSelector = [
  'a[href]',
  'area[href]',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',')

function isVisible(element) {
  if (element.hidden) return false
  if (element.getAttribute('aria-hidden') === 'true') return false
  return true
}

export function isDisabled(element) {
  return (
    element.hasAttribute('disabled') ||
    element.getAttribute('aria-disabled') === 'true' ||
    element.closest('[inert]') !== null
  )
}

export function getFocusable(container) {
  if (!container) return []
  return Array.from(container.querySelectorAll(focusableSelector)).filter(
    (element) => isVisible(element) && !isDisabled(element) && element.tabIndex !== -1,
  )
}

export function getTabbable(container) {
  return getFocusable(container).filter((element) => element.tabIndex >= 0)
}
