import {createContext, useContext, createElement, PureComponent} from 'react'
import ReactIs from 'react-is'
import {isFn, isObj, isStr} from 'istp'
import {observer} from 'mobx-react-lite'


export const StoreContext = createContext()
export const StoreProvider = StoreContext.Provider

export function select(Component, ...selectors) {
  const lastArg = selectors[selectors.length - 1]
  const options = isObj(lastArg) ? selectors.splice(-1, 1)[0] : {}

  let {
    name = componentName(Component),
    warnNonFunction = true,
  } = options
  const functional = isFunctional(Component)

  if (isMemo(Component) || isPure(Component)) {
    warnNonFunction = false
  }

  let nonFunctionWarnShowed = false

  const Selector = (props, ...args) => {
    const store = useContext(StoreContext)

    const finalProps = selectors.reduce((props, selector) => (
      Object.assign(props, selector(store, props))
    ), Object.assign({}, props))

    if (functional) {
      return Component(finalProps, ...args)
    }

    if (warnNonFunction && !nonFunctionWarnShowed) {
      console.warn(
        `You are trying to use select() with non-function component ${name}. ` +
        "Keep in mind that access to all observable values inside component " +
        "will not be tracked. So you need to get all necessary fields in " +
        "selector and pass it as scalar (!) values. Pass " +
        "`warnNonFunction: false` option as last argument to hide this warning."
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
  if (isStr(Component)) {
    return Component
  }

  if (isFn(Component)) {
    return (
      Component.displayName ||
      Component.name ||
      Component.constructor?.name ||
      "Unknown"
    )
  }

  if (isObj(Component)) {
    // memo
    if (Component.type) {
      return componentName(Component.type)
    }
  }

  return "Unknown"
}

function isFunctional(Component) {
  return (
    isFn(Component) &&
    !Component.prototype?.isReactComponent
  )
}

function isMemo(Component) {
  return Component.$$typeof === ReactIs.Memo
}

function isPure(Component) {
  return Component.prototype instanceof PureComponent
}
