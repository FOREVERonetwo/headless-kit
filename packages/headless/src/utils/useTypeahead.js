import { onScopeDispose, ref } from 'vue'

const resetSearch = (state) => {
  state.search.value = ''
  state.lastIndex = -1
  if (state.timer) {
    clearTimeout(state.timer)
    state.timer = null
  }
}

export function useTypeahead({ values, onMatch, timeout = 1000 } = {}) {
  const search = ref('')
  const state = { search, lastIndex: -1, timer: null }

  const resolveValues = () => {
    const items = typeof values === 'function' ? values() : values
    return Array.isArray(items) ? items.map((item) => String(item)) : []
  }

  const handleTypeahead = (key) => {
    if (typeof key !== 'string' || key.length !== 1) return
    if (key === ' ' && search.value === '') return
    if (key === ' ') return

    const repeated = search.value.length === 1 && search.value[0] === key
    const term = repeated ? key : `${search.value}${key}`
    search.value = term

    if (state.timer) clearTimeout(state.timer)
    state.timer = setTimeout(() => resetSearch(state), timeout)

    const items = resolveValues()
    if (items.length === 0) return

    const matches = []
    items.forEach((item, index) => {
      if (item.toLowerCase().startsWith(term.toLowerCase())) matches.push(index)
    })
    if (matches.length === 0) {
      if (!repeated) return
      resetSearch(state)
      return
    }

    const position = matches.indexOf(state.lastIndex)
    const index = position === -1 ? matches[0] : matches[(position + 1) % matches.length]
    state.lastIndex = index
    onMatch?.(items[index], index)
  }

  onScopeDispose(() => {
    if (state.timer) clearTimeout(state.timer)
  })

  return { search, handleTypeahead, resetSearch: () => resetSearch(state) }
}
