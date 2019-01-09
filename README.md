# React Hookx

## Installing
React Hookx requires React 16.7.0-alpha.0 and React Dom 16.7.0-alpha.0 or later.

Using npm:
```shell
npm install --save react-hookx
```
Using yarn:
```shell
yarn add react-hookx
```

## Example
```javascript
// store/index.js
import Hookx from 'react-hookx'

const state = {
  name: '',
  age: 0,
}

const action = {
  SetUser({ setState }, data) {
    setState({
      name: data.name,
      age: data.age,
    })
  },
  SetUserSync({ setState }, data) {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          const nextState = setState({
            name: data.name,
            age: data.age,
          })
          resolve(nextState)
        }, 1000)
      } catch (err) {
        reject(err)
      }
    })
  },
}

const storage = {
  mode: 'session',
  reducer: state => ({
    name: state.name,
    age: state.age,
  }),
}

export default new Hookx({
  state,
  action,
  storage,
})

```

```javascript
// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './store'
import './index.css'

const { StoreProvider } = store
ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById('root')
)
```

```javascript
import React from 'react'
import store from '../store'

function TestComponent(props) {
  const { useDispatch, useStoreState } = store
  const dispatch = useDispatch()
  const { name, age } = useStoreState()

  return (
    <>
      <div onClick={() => dispatch('SetUser', { name: 'zhang', age: 21 })}>
        name: {name}
        age: {age}
      </div>
      <button
        onClick={() =>
          dispatch('SetUserSync', { name: 'huang', age: 20 }).then(state => {
            console.log(state)
          })
        }
      >
        sync
      </button>
    </>
  )
}

export default TestComponent

```

## API
#### state
Initialization data.

#### action
The only way to modify the state.

#### storage
##### mode
choose webStorage:
* session
* local

##### reducer
choose which state wanna to storage.


#### StoreProvider

#### useStoreState
customize hook
get react hookx state in component
```javascript
const { useStoreState } = hookx
const { name, age } = useStoreState()
```

#### useDispatch
customize hook
get react hookx dispatch in component
```javascript
const { useDispatch } = hookx
const dispatch = useDispatch()
```


## License
ISC