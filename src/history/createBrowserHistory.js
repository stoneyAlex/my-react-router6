/*
 * @Author: shimingxia
 * @Date: 2022-08-30 10:38:20
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-30 11:23:36
 * @Description: 
 */
function createBrowserHistory() {
  let golobalHistory = window.history
  let state
  let listeners = []

  function go(N) {
    golobalHistory.go(N)
  }

  function goBack() {
    golobalHistory.back()
  }

  function goForward() {
    golobalHistory.forward()
  }

  function push(pathname, nextState) {
    const action = 'PUSH'
    if(typeof pathname === 'object') {
      state = pathname.state
      pathname = pathname.pathname
    } else {
      state = nextState
    }
    golobalHistory.pushState(state, null, pathname)
    notify({location: {pathname, state}, action})
  }

  function listen(listener) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(item => item !== listener)
    }
  }

  window.onpopstate = () => {
    let location = {pathname: window.location.pathname, state: golobalHistory.state}
    notify({location, action: 'POP'})
  }

  function notify(nextState) {
    Object.assign(history, nextState)
    history.length = golobalHistory.length
    listeners.forEach(listener => listener({location:history.location}))
  }

  const history = {
    action: 'POP',
    go,
    goBack,
    goForward,
    push,
    listen,
    location: {pathname: window.location.pathname, state: window.location.state}
  }

  return history
}

export default createBrowserHistory
