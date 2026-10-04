import { getCurrentInstance } from 'vue'

export function useId(prefix = 'hk') {
  const instance = getCurrentInstance()
  const uid = instance ? instance.uid : Math.floor(Math.random() * 1e9)
  return `${prefix}-${uid}`
}
