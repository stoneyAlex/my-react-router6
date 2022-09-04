/*
 * @Author: shimingxia
 * @Date: 2022-08-24 18:57:31
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-30 20:03:39
 * @Description: 
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import Home from './components/Home'
import User from './components/User'
import Profile from './components/Profile'
import Post from './components/Post'
import Protected from './components/Protected'
import UserAdd from './components/UserAdd'
import UserList from './components/UserList'
import UserDetail from './components/UserDetail'
import Login from './components/Login'
const activeStyle = {backgroundColor: 'red'}

ReactDOM.render(
  <BrowserRouter>
    <ul>
      <li><NavLink to='/' style={({isActive}) => isActive ? activeStyle : {}} className={({isActive}) => isActive ? 'active' : ''}>首页</NavLink></li>
      <li><NavLink to='/user' style={({isActive}) => isActive ? activeStyle : {}} className={({isActive}) => isActive ? 'active' : ''}>用户管理</NavLink></li>
      <li><NavLink to='/profile' style={({isActive}) => isActive ? activeStyle : {}} className={({isActive}) => isActive ? 'active' : ''}>个人中心</NavLink></li>
    </ul>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/user/*' element={<User />}>
        <Route path='add' element={<UserAdd />} />
        <Route path='list' element={<UserList />} />
        <Route path='detail/:id' element={<UserDetail />} />
      </Route>
      <Route path='/profile' element={<Protected component={Profile} path='/profile' />} />
      <Route path='/post/:id' element={<Post />} />
      <Route path='/login' element={<Login />} />
      <Route path='/home' element={<Navigate to='/' />} />
    </Routes>
  </BrowserRouter>
  , document.getElementById('root'))
