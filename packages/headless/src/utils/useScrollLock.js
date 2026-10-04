import { onBeforeUnmount, ref, unref, watch } from 'vue'

let lockCount = 0
let restoreStyles = null

function applyLock() {
  if (lockCount === 0) {
    const body = document.body
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const previous = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    }
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
    }
    restoreStyles = () => {
      body.style.overflow = previous.overflow
      body.style.paddingRight = previous.paddingRight
    }
  }
  lockCount += 1
}

function releaseLock() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0 && restoreStyles) {
    restoreStyles()
    restoreStyles = null
  }
}

export function useScrollLock(locked) {
  let acquired = false

  const sync = (value) => {
    if (value && !acquired) {
      if (typeof document !== 'undefined') {
        applyLock()
        acquired = true
      }
    } else if (!value && acquired) {
      releaseLock()
      acquired = false
    }
  }

  watch(() => unref(locked), sync, { immediate: true })

  onBeforeUnmount(() => {
    if (acquired) {
      releaseLock()
      acquired = false
    }
  })

  return { isLocked: ref(() => acquired) }
}
