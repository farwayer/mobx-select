import {createContext, useContext, createElement, PureComponent} from 'react'
import ReactIs from 'react-is'
import {isFn, isObj, isStr, isUndef} from 'istp'
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

  const Selector = (props, ref) => {
    const store = useContext(StoreContext)

    if (isUndef(store)) {
      console.warn(
        "You are trying to use store that was not defined. " +
        "Did you forget to wrap the app with <StoreProvider>? " +
        "If you initialize the store later then pass null as default value " +
        "to provider to hide this warning."
      )
    }

    let finalProps = selectors.reduce((prevProps, selector) => (
      Object.assign({}, prevProps, selector(store, prevProps))
    ), props)

    if (functional) {
      return Component(finalProps, ref)
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

    finalProps = Object.assign({ref}, finalProps)
    return createElement(Component, finalProps)
  }

  Selector.displayName = `select(${name})`

  return observer(Selector, {forwardRef: true})
}

// TODO: other React component types (Context, etc.)
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

    // forwardRef
    if (Component.render) {
      const innerName = componentName(Component.render)
      return `ForwardRef(${innerName})`
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
