/*
 * @Author: shimingxia
 * @Date: 2022-08-31 15:29:39
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-31 15:59:02
 * @Description: 
 */
import React from 'react'
import Home from './components/Home'
import User from './components/User'
import UserAdd from './components/UserAdd'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'

const routesConfig = [
  {path: '/', element: <Home />, index: 0},
  {
    path: '/user/*',
    element: <User />,
    index: 1,
    children: [
      {path: 'add', element: <UserAdd />, index: 0},
      {path: 'list', element: <UserList />, index: 1},
      {path: 'detail/:id', element: <UserDetail />, index: 2},
    ]
  }
]

export default routesConfig