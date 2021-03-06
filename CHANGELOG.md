## Changelog

### 2.3.1

- remove istp dep (now the lib has no deps)
- reduce lib size to 814 bytes

### 2.3.0

- forward refs
- correct displayName for forwardRef components
- warn store is undefined
- do not use react-is to reduce lib size
- limit size to 877 bytes

### 2.2.1

- assign props to new object each selector call

### 2.2.0

- can pass several selectors as args

### 2.1.3

- sideEffects: false

### 2.1.2

- fix wrong memo check

### 2.1.1

- do not warn non-function for memo and PureComponent

### 2.1.0

- back behaviour with calling function component to track observable changes
- warn for non-function components (can be disabled with
`warnNonFunction: false` option)

### 2.0.0

- use `observer` instead `useObserver`
- component can be class or `memo`'ized 

### 1.1.1

- selector can be omitted

### 1.1.0

- export context as StoreContext

### 1.0.1

- initial version
