/*
 * @Author: shimingxia
 * @Date: 2022-08-30 14:57:04
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-30 15:09:47
 * @Description: 
 */
import React from 'react';
import { useLocation, useNavigate } from '../react-router-dom'

function Login(props) {
  let navigate = useNavigate()
  let location = useLocation()
  const login = () => {
    localStorage.setItem('login', true)
    let to = '/'
    if(location.state) {
      to = location.state.from || '/'
    }
    navigate(to)
  }
  return (
    <button onClick={login}>登录</button>
  )
}

export default Login