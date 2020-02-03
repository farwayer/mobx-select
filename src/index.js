import React, {createContext, useContext} from 'react'
import {observer} from 'mobx-react-lite'


export const StoreContext = createContext()
export const StoreProvider = StoreContext.Provider

export function select(Component, selector) {
  const Selector = props => {
    const store = useContext(StoreContext)
    const finalProps = Object.assign({}, props, selector?.(store, props))
    return <Component {...finalProps}/>
  }
  Selector.displayName = selectorName(Component)

  return observer(Selector)
}

function selectorName(component) {
  const componentName =
    component.displayName ||
    component.name ||
    component.constructor?.name ||
    "Unknown"
  return `select(${componentName})`
}
