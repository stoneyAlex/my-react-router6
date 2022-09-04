/*
 * @Author: shimingxia
 * @Date: 2022-08-30 09:56:34
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-30 14:37:37
 * @Description: 
 */
import React from 'react'
import { Router, useNavigate, useLocation } from '../react-router'
import { createBrowserHistory, createHashHistory } from '../history'
export * from '../react-router'

function BrowserRouter({ children }) {
  let historyRef = React.useRef(null)
  if(historyRef.current === null) {
    historyRef.current = createBrowserHistory()
  }
  let history = historyRef.current
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location
  })
  React.useLayoutEffect(() => history.listen(({location, action}) => {
    setState({location, action})
  }), [history])
  return (
    <Router
      children={children}
      location={state.location}
      navigator={history}
      navagationType={state.action}
    />
  )
}

function HashRouter({ children }) {
  let historyRef = React.useRef(null)
  if(historyRef.current === null) {
    historyRef.current = createHashHistory()
  }
  let history = historyRef.current
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location
  })
  React.useLayoutEffect(() => history.listen(setState), [history])
  return (
    <Router
      children={children}
      location={state.location}
      navigator={history}
      navagationType={state.action}
    />
  )
}

export {
  BrowserRouter,
  HashRouter
}

export function Link({to, ...rest}) {
  let navigate = useNavigate()
  function handleClick(event) {
    event.preventDefault()
    navigate(to)
  }
  return (
    <a {...rest} href={to} onClick={handleClick} />
  )
}

export function NavLink({
  className: classNameProps = '',
  end = false,
  style: styleProp = {},
  to,
  children,
  ...rest
}) {
  let location = useLocation()
  let pathname = location.pathname
  let isActive = pathname === to || (!end && pathname.startsWith(to))
  let className
  if(typeof classNameProps === 'function') {
    className = classNameProps({isActive})
  } else {
    className = classNameProps
  }
  let style = typeof styleProp === 'function' ? styleProp({isActive}) : styleProp
  return (
    <Link {...rest} className={className} style={style} to={to}>{children}</Link>
  )
}