## mobx-select

_MobX and MobX-State-Tree store selector for using with [mobx-react-lite](https://github.com/mobxjs/mobx-react-lite)_

[![NPM version](https://img.shields.io/npm/v/mobx-select.svg)](https://www.npmjs.com/package/mobx-select)

## How to use

```bash
yarn add mobx-select
```

**asset.js**
```js
import {select} from 'mobx-select'

function assetSelector(app, props) {
  const {asset} = app.assets.get(props.id)
  return {asset}
}

function removeAssetSelector(app, prop) {
  const {id} = props
  const onRemove = useCallback(() => {
    app.removeAsset(id)
  }, [id])

  return {onRemove}
}

export default select(Asset,
  assetSelector,
  removeAssetSelector,
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

// creating MobX or MobX-State-Tree store
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
selector but not in component you can use `memo` or `PureComponent`
to prevent unnecessary re-rendering.

```js
import {memo} from 'react'

export default select(memo(Title), (app, props) => {
  const asset = app.assets.get(props.id)
  const title = asset?.title
  return {title}
})

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
export default select(Title, (app, props) => {
  const asset = app.assets.get(props.id)
  const title = asset?.title
  // asset is mobx observable object, title is scalar
  return {asset, title}
}, {warnNonFunction: false})

class Title extends React.Component {
  render() {
    const {title} = this.props

    // (!) WARN: access to price will not be tracked!
    // (!) changing its value will not trigger component re-render 
    const price = this.props.asset?.price

    return (
      <span>{title} {price}</span>
    )
  }
}
```
