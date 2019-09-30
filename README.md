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
