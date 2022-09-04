/*
 * @Author: shimingxia
 * @Date: 2022-08-30 09:53:22
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-31 15:24:46
 * @Description: 
 */
import React from 'react';
import {Link, Outlet} from '../react-router-dom'

function User(props) {
  return (
    <div>
      <ul>
        <li><Link to="/user/list">用户列表</Link></li>
        <li><Link to="/user/add">新增用户</Link></li>
      </ul>
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default User