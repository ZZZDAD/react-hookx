import React, { createContext, useContext, useState } from 'react'

export default class ReactHookx {
  constructor(options) {
    this.state = options.state || {}
    this.action = options.action || {}
    this.storage = options.storage || {}
    this.Context = createContext(null)
  }

  initState = () => {
    let storageState

    switch (this.storage.mode) {
      case 'session':
        storageState = JSON.parse(window.sessionStorage.getItem('hookx')) || {}
        break
      case 'local':
        storageState = JSON.parse(window.localStorage.getItem('hookx')) || {}
        break
      default:
        break
    }
    return { ...this.state, ...storageState }
  }

  storageState = state => {
    if (this.storage.reducer && typeof this.storage.reducer != 'function') {
      throw Error('storage.reducer must be a function')
    }
    switch (this.storage.mode) {
      case 'session':
        window.sessionStorage.setItem('hookx', JSON.stringify(this.storage.reducer(state)))
        break
      case 'local':
        window.localStorage.setItem('hookx', JSON.stringify(this.storage.reducer(state)))
        break
      default:
        break
    }
  }

  StoreProvider = props => {
    let [state, setState] = useState(this.initState())

    const dispatch = (action, data) => {
      const fn = this.action[action](
        {
          state,
          setState: data => {
            const nextState = {
              ...state,
              ...data,
            }
            setState(nextState)
            return nextState
          },
        },
        data
      )

      if (fn instanceof Promise) {
        return new Promise((resolve, reject) => {
          fn.then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      }
    }

    const getState = () => {
      return state
    }

    this.storageState(state)

    const Provider = this.Context.Provider

    return <Provider value={{ dispatch, getState }}>{props.children}</Provider>
  }

  useDispatch = () => {
    const store = useContext(this.Context)
    return store.dispatch
  }

  useStoreState = () => {
    const store = useContext(this.Context)
    return store.getState()
  }
}
