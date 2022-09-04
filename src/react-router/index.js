/*
 * @Author: shimingxia
 * @Date: 2022-08-30 09:57:35
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-31 17:06:56
 * @Description: 
 */
import React from 'react'
const NavigationContext = React.createContext()
const LocationContext = React.createContext()
const RouteContext = React.createContext({
  outlet: null,
  matches: []
})

export function Outlet() {
  return useOutlet()
}

export function useOutlet() {
  let outlet = React.useContext(RouteContext).outlet
  return outlet
}

function Router({ children, navigator, location }) {
  return (
    <NavigationContext.Provider value={{navigator}}>
      <LocationContext.Provider value={{location}}>
        {children}
      </LocationContext.Provider>
    </NavigationContext.Provider>
  )
}

export function useLocation() {
  return React.useContext(LocationContext).location
}

export function useParams() {
  let { matches } = React.useContext(RouteContext)
  let routeMatch = matches[matches.length - 1]
  return routeMatch ? routeMatch.params : {}
}

function Routes({children}) {
  let routes = createRoutesFromChildren(children)
  console.log("routes: ", routes)
  return useRoutes(routes)
}

export function useRoutes(routes) {
  let location = useLocation()
  let pathname = location.pathname || '/'
  let matches = matchRoutes(routes, {pathname})
  console.log(matches)
  return _renderMatches(matches)
}

function _renderMatches(matches) {
  if(matches === null) return null
  return matches.reduceRight((outlet, match, index) => {
    return (
      <RouteContext.Provider value={{
        outlet,
        matches: matches.slice(0, index + 1)
      }}>
        {match.route.element}
      </RouteContext.Provider>
    )
  }, null)
}

function matchRoutes(routes, location) {
  let pathname = location.pathname || '/'
  console.log(routes)
  let branches = flattenRoutes(routes)
  rankRouteBranches(branches)
  console.log("branches: ", branches)
  let matches = null
  for(let i = 0; matches === null && i < branches.length; i++) {
    matches = matchRoutesBranch(branches[i], pathname)
  }
  return matches
}

function rankRouteBranches(branches) {
  branches.sort((a, b) => {
    if(a.score === b.score) {
      return compareIndexes(
        a.routesMeta.map(meta => meta.childrenIndex),
        b.routesMeta.map(meta => meta.childrenIndex)
      )
    } else {
      return b.score - a.score
    }
  })
}

function compareIndexes(a, b) {
  let siblings =
    a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);

  return siblings
}

function matchRoutesBranch(branch, pathname) {
  let {routesMeta} = branch
  let matchedParams = {}
  let matchedPathname = '/'
  let matches = []
  for (let i = 0; i < routesMeta.length; i++) {
    let meta = routesMeta[i]
    let end = i === routesMeta.length - 1
    let remainingPathname = matchedPathname === '/' ? pathname : pathname.slice(matchedPathname.length) || '/'
    console.log(remainingPathname)
    let match = matchPath({path: meta.relativePath, end}, remainingPathname)
    if(!match) return null
    Object.assign(matchedParams, match.params)
    let route = meta.route
    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(
        joinPaths([matchedPathname, match.pathnameBase])
      ),
      route
    })
    if(match.pathnameBase !== '/') {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase])
    }
  }
  return matches
}

function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = '') {
  routes.forEach(route => {
    let meta = {
      relativePath: route.path || '',
      childrenIndex: route.index,
      route
    }
    let path = joinPaths([parentPath, meta.relativePath])
    let routesMeta = parentsMeta.concat(meta)
    if(route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routesMeta, path)
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    })
  })
  return branches
}

const splatPenalty = -2
const indexRouteValue = 2
const isSplat = s => s === '*'
const paramRe = /^:\w+$/
const dynamicSegmentValue = 3
const emptySegmentValue = 1
const staticSegmentValue = 10

function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }

  if (typeof index !== 'undefined') {
    initialScore += indexRouteValue;
  }

  return segments.filter(s => !isSplat(s)).reduce((score, segment) => {
    let currentScope = 0
    if(paramRe.test(segment)) {
      currentScope += dynamicSegmentValue
    } else {
      if(segment === '') {
        currentScope += emptySegmentValue
      } else {
        currentScope += staticSegmentValue
      }
    }
    score += currentScope
    return score
  }, initialScore)
}

function joinPaths(paths) {
  return paths.join('/').replace(/\/\/+/g, '/')
}

export const normalizePathname = (pathname) =>
  pathname.replace(/\/+$/, "").replace(/^\/*/, "/");

function matchPath(pattern, pathname) {
  let [matcher, paramNames] = compilePath(pattern.path, pattern.end)
  console.log(matcher)
  console.log(paramNames)
  let match = pathname.match(matcher)
  if(!match) return null
  let matchedPathname = match[0]
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, '$1')
  let values = match.slice(1)
  let captureGroups = match.slice(1)
  let params = paramNames.reduce((memo, paramName, index) => {
    if(paramName === '*') {
      let value = captureGroups[index] || ""
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - value.length)
        .replace(/(.)\/+$/, '$1')
    }
    memo[paramName] = values[index]
    return memo
  }, {})
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  }
}

function compilePath(path, end) {
  let paramNames = []
  let regexpSource = "^" + path
    .replace(/\/*\*?$/, '')
    .replace(/^\/*/, '/')
    .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&")
    .replace(/:(\w+)/g, (_, key) => {
      paramNames.push(key)
      return "([^\\/]+)"
    })
  if(path.endsWith('*')) {
    paramNames.push('*')
    regexpSource += "(?:\\/(.+)|\\/*)$"
  } else {
    regexpSource += end ? "\\/*$" : "(?:\\b|\\/|$)"
  }
  let matcher = new RegExp(regexpSource)
  return [matcher, paramNames]
}

function createRoutesFromChildren(children) {
  let routes = []
  React.Children.forEach(children, (child) => {
    let route = {
      path: child.props.path,
      index: child.index,
      element: child.props.element
    }
    if(child.props.children) {
      route.children = createRoutesFromChildren(child.props.children)
    }
    routes.push(route)
  })
  return routes
}

function Route() {

}

export {
  Router,
  Routes,
  Route
}

export function useNavigate() {
  let { navigator } = React.useContext(NavigationContext)
  let navigate = React.useCallback((to) => {
    navigator.push(to)
  }, [navigator])
  return navigate
}

export function Navigate({to}) {
  let navigate = useNavigate()
  React.useEffect(() => {
    navigate(to)
  })
  return null
}