/*
 * @Author: shimingxia
 * @Date: 2022-08-30 14:56:46
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-30 15:09:43
 * @Description: 
 */
import React from 'react';
import { Navigate } from '../react-router-dom'
function Protected(props) {
  let {component: RouteComponent, path} = props
  return (
    localStorage.getItem('login') ? <RouteComponent /> : <Navigate to={{
      pathname: '/login',
      state: {from: path}
    }} />
  )
}

export default Protected