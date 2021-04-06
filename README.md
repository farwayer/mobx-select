## mobx-select

_MobX and MobX-State-Tree store selectors
(like Redux `mapStateToProps` and `mapDispatchToProps`)
for using with [mobx-react-lite](https://github.com/mobxjs/mobx-react-lite)_

[![NPM version](https://img.shields.io/npm/v/mobx-select.svg)](https://www.npmjs.com/package/mobx-select)

Lib is small and it size [limited](https://github.com/ai/size-limit)
to **877 bytes** (all deps, minified and gzipped).

## How to use

```bash
yarn add mobx-select
```

**asset.js**
```js
import {select} from 'mobx-select'

function getAsset(app, props) {
  const asset = app.assets.get(props.id)
  return {asset}
}

function onRemoveAsset(app, prop) {
  const {id} = props
  
  const onRemove = useCallback(() => {
    app.removeAsset(id)
  }, [id])

  return {onRemove}
}

export default select(
  Asset,
  getAsset,
  onRemoveAsset,
  // ...other
)

function Asset({
  asset = {},
  onRemove,
}) {
  return (
    <div>
      <span>{asset.name}</span>
      <button onClick={onRemove}>Remove</button>
    </div>
  )
}
```

**app.js**
```js
import {StoreProvider} from 'mobx-select'
import Asset from './asset'

// create MobX or MobX-State-Tree store
const app = createStore()

export default function App() {
  return (
    <StoreProvider value={app}>
      <Asset id='1'/>
    </StoreProvider>
  )
}
```

## Render optimization

If you access nested observable values (MobX objects, maps, arrays) only inside
selectors but not in component you can use `memo` or `PureComponent`
to prevent unnecessary extra renderings.

```js
import {memo} from 'react'

function getAssetTitle(app, props) {
  const title = app.assets.get(props.id)?.title
  return {title}
}

export default select(
  memo(Title),
  getAssetTitle,
)

function Title({
  title,
}) {
  return (
    <span>{title}</span>
  )
}
```

## Using with non-function components

You can use `select()` with non-function components. But keep in mind that
access to all nested observable values (MobX objects, maps, arrays) inside
component will not be tracked. So you need to get all necessary fields in
selector and pass it as **(!)** scalar values.

Use `warnNonFunction: false` option to hide warning about it. Warning for `memo`
and `PureComponent` will be omitted automatically (assumed that you know what
you're doing). 

```js
function getUserId(app) {
  const userId = app.userId
  return {userId}
}

export default select(
  Title,
  getAsset,
  getUserId,
{warnNonFunction: false})

class Title extends React.Component {
  render() {
    const {userId, asset} = this.props

    // (!) WARN: access to price will not be tracked!
    // (!) changing its value will not trigger component re-render 
    const price = asset?.price

    return (
      <span>user={userId} {price}</span>
    )
  }
}
```

## References

References will be automatically passed to components:

```js
function UserName({
  name,
}, ref) {
  return (
    <input ref={ref} value={name}/>
  )
}

class UserSignInCount extends React.Component {
  render() {
    return (
      <span>{this.props.count}</span>
    )
  }
  
  log() {
    console.log(this.props.count)
  }
}

function App() {
  const nameRef = useRef()
  const signInCountRef = useRef()
  
  const tadam = useCallback(() => {
    nameRef.current.value = "User TADAM!"
    signInCountRef.current.log()
  })
  
  return (
    <>
      <UserName ref={nameRef}/>
      <UserSignInCount ref={signInCountRef}/>
      <button onClick={tadam}>TADAM!</button>
    </>
  )
}
```
