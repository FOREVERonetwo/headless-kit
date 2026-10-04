export function mergeRefs(...refs) {
  return (value) => {
    for (const target of refs) {
      if (typeof target === 'function') target(value)
      else if (target && typeof target === 'object') target.value = value
    }
  }
}

export function composeEventHandlers(...handlers) {
  return (event, ...rest) => {
    for (const handler of handlers) handler?.(event, ...rest)
  }
}
