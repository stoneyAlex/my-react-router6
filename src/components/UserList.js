/*
 * @Author: shimingxia
 * @Date: 2022-08-30 19:32:30
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-31 14:32:48
 * @Description: 
 */
import React from 'react';
import {UserAPI} from '../utils'
import {Link} from '../react-router-dom'

function UserList(props) {
  const [users, setUsers] = React.useState([])
  React.useEffect(() => {
    let users = UserAPI.list()
    setUsers(users)
  }, [])
  return (
    <ul>
      {
        users.map(user => (
          <li key={user.id}>
            <Link to={{pathname: `/user/detail/${user.id}`, state: user}}>{user.username}</Link>
          </li>
        ))
      }
    </ul>
  )
}

export default UserList