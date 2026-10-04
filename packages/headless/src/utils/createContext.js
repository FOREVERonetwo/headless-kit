import { inject, provide } from 'vue'

export function createContext(name, { optional = false } = {}) {
  const key = Symbol(`headless-kit:${name}`)

  const provideContext = (context) => {
    provide(key, context)
    return context
  }

  const useContext = (componentName = name) => {
    const context = inject(key, null)
    if (context === null && !optional) {
      throw new Error(
        `[headless-kit] \`${componentName}\` must be used inside a matching provider. ` +
          `Wrap it in the corresponding \`${name}Root\` component.`,
      )
    }
    return context
  }

  return [provideContext, useContext]
}
