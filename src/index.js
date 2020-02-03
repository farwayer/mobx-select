import React, {createContext, useContext} from 'react'
import {observer} from 'mobx-react-lite'


export const StoreContext = createContext()
export const StoreProvider = StoreContext.Provider

export function select(Component, selector) {
  return observer(props => {
    const store = useContext(StoreContext)
    const finalProps = Object.assign({}, props, selector?.(store, props))
    return <Component {...finalProps}/>
  })
}
