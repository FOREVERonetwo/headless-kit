export function collectComponents(vnodes, name, out = []) {
  if (vnodes === null || vnodes === undefined) return out
  const list = Array.isArray(vnodes) ? vnodes : [vnodes]

  for (const vnode of list) {
    if (!vnode || typeof vnode !== 'object') continue

    const children = vnode.children
    if (Array.isArray(children)) {
      collectComponents(children, name, out)
      continue
    }

    const type = vnode.type
    if (typeof type === 'object' && type !== null) {
      const resolved = type.name ?? type.__name ?? type.__file
      if (resolved === name) out.push(vnode)
    }
  }

  return out
}
