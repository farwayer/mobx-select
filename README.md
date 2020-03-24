## mobx-select

_Inject analog for using with mobx-react-lite_

[![NPM version](https://img.shields.io/npm/v/mobx-select.svg)](https://www.npmjs.com/package/mobx-select)

## How to use

```bash
yarn add mobx-select
```

```js
import {StoreProvider, select} from 'mobx-select'

function AssetView({
  asset = {},
}) {
  return (
    <span>{asset.name}</span>
  )
}

const Asset = select(AssetView, (app, props) => {
  const asset = app.assets.get(props.id)
  return {asset}
})

const app = createStore()

function App() {
  <StoreProvider value={app}>
    <Asset id={1}/>
  </StoreProvider>
}
```

## Using with non-function components

You can use `select()` with non-function components. But keep in mind that
access to all observable values inside component will not be tracked. So you
need to get all necessary fields in selector and pass it as scalar (!) values.
Use `warnNonFunction: false` option to hide warning about it.

```js
select(Title, (app, props) => {
  const asset = app.assets.get(props.id)
  const title = asset?.title 
  // asset is mobx observable object, title is scalar
  return {asset, title}
}, {warnNonFunction: false})

class Title extends React.Component {
  render() {
    const {title} = this.props

    // (!) WARN: access to price will not be tracked!
    // (!) its change will not cause component render 
    const price = this.props.asset?.price

    return (
      <span>{title} {price}</span>
    )
  }
}
```
