/*
 * @Author: shimingxia
 * @Date: 2022-08-30 10:38:28
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-30 13:42:12
 * @Description: 
 */
function createHashHistory() {
  let historyStack = [];
  let historyIndex = -1
  let action = 'POP'
  let state
  let listeners = [];

  function go(N) {
    action = 'POP'
    historyIndex += N
    let nextLocation = historyStack[historyIndex]
    state = nextLocation.state
    window.location.hash = nextLocation.pathname
  }

  function goBack() {
    go(-1)
  }

  function goForward() {
    go(1)
  }

  function push(pathname, nextState) {
    action = 'PUSH'
    if(typeof pathname === 'object') {
      state = pathname.state
      pathname = pathname.pathname
    } else {
      state = nextState
    }
    window.location.hash = pathname
  }

  function hashchangeHandler() {
    let pathname = window.location.hash.slice(1)
    Object.assign(history, {action, location: {pathname, state}})
    if(action === 'PUSH') {
      historyStack[++historyIndex] = history.location
    }
    listeners.forEach(listener => listener({location: history.location, action: history.action}))
  }

  window.addEventListener('hashchange', hashchangeHandler)

  function listen(listener) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(item => item !== listener)
    }
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

  if(window.location.hash) {
    action = 'PUSH'
    hashchangeHandler()
  } else {
    window.location.hash = '/'
  }

  return history
}

export default createHashHistory