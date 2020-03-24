import {createContext, useContext, createElement} from 'react'
import {observer} from 'mobx-react-lite'


export const StoreContext = createContext()
export const StoreProvider = StoreContext.Provider

export function select(Component, selector, options = {}) {
  const {
    name = componentName(Component),
    warnNonFunction = true,
  } = options
  const functional = isFunctional(Component)

  let nonFunctionWarnShowed = false

  const Selector = (props, ...args) => {
    const store = useContext(StoreContext)
    const finalProps = Object.assign({}, props, selector?.(store, props))

    if (functional) {
      return Component(finalProps, ...args)
    }

    if (warnNonFunction && !nonFunctionWarnShowed) {
      console.warn(
        `You are trying to use select() with non-function component ${name}. ` +
        "Keep in mind that access to all observable values inside component " +
        "will not be tracked. So you need to get all necessary fields in " +
        "selector and pass it as scalar (!) values. Set " +
        "`warnNonFunction: false` to hide this warning."
      )
      nonFunctionWarnShowed = true
    }

    return createElement(Component, finalProps)
  }

  Selector.displayName = `select(${name})`

  return observer(Selector)
}

// TODO: other React component types (ForwardRef, Context, etc.)
// TODO: move to external package
function componentName(Component) {
  if (typeof Component === 'string') {
    return Component
  }

  if (typeof Component === 'function') {
    return (
      Component.displayName ||
      Component.name ||
      Component.constructor?.name ||
      "Unknown"
    )
  }

  if (typeof Component === 'object') {
    // memo
    if (Component.type) {
      return componentName(Component.type)
    }
  }

  return "Unknown"
}

function isFunctional(Component) {
  return (
    typeof Component === 'function' &&
    !Component.prototype?.isReactComponent
  )
}
