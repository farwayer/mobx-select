import {createContext, useContext} from 'react'
import {useObserver} from 'mobx-react-lite'


export const StoreContext = createContext()
export const StoreProvider = StoreContext.Provider

export function select(Component, selector) {
  const Selector = props => {
    const store = useContext(StoreContext)

    return useObserver(() => {
      const finalProps = Object.assign({}, props, selector?.(store, props))
      return Component(finalProps)
    })
  }

  Selector.displayName = selectorName(Component)
  return Selector
}

function selectorName(component) {
  const componentName =
    component.displayName ||
    component.name ||
    component.constructor?.name ||
    "Unknown"
  return `select(${componentName})`
}
