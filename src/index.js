/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-31 15:56:11
 * @Description: 
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, NavLink, useRoutes } from './react-router-dom'
import routesConfig from './routesConfig'
const activeStyle = {backgroundColor: 'red'}
const LazyFoo = React.lazy(() => import('./components/Foo'))
// const LazyFoo = lazy(() => import ('./components/Foo'))

function lazy(dynamicImport) {
  return function() {
    let [Component, setComponent] = React.useState(null)
    React.useEffect(() => {
      dynamicImport().then(result => {
        let LazyComponent = result.default
        setComponent(LazyComponent)
      })
    }, [])
    return Component && <Component />
  }
}

/**
 * @description: 1, 配置式路由，动态添加路由，懒加载式路由组件
 * @return {*}
 */
function App() {
  let [routes, setRoutes] = React.useState(routesConfig)
  const addRoutes = () => {
    setRoutes([
      ...routes,
      { path: '/foo', element: <React.Suspense fallback={<div>loading....</div>}>
        <LazyFoo />
      </React.Suspense> }
    ])
  }
  return (
    <div>
      {useRoutes(routes)}
      <button onClick={addRoutes}>addRoutes</button>
    </div>
  )
}

ReactDOM.render(
  <BrowserRouter>
    <ul>
      <li><NavLink to='/' style={({isActive}) => isActive ? activeStyle : {}} className={({isActive}) => isActive ? 'active' : ''}>首页</NavLink></li>
      <li><NavLink to='/user' style={({isActive}) => isActive ? activeStyle : {}} className={({isActive}) => isActive ? 'active' : ''}>用户管理</NavLink></li>
      <li><NavLink to='/profile' style={({isActive}) => isActive ? activeStyle : {}} className={({isActive}) => isActive ? 'active' : ''}>个人中心</NavLink></li>
    </ul>
    <App />
  </BrowserRouter>
  , document.getElementById('root'))
