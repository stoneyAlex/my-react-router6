/*
 * @Author: shimingxia
 * @Date: 2022-08-30 19:32:48
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-31 14:33:00
 * @Description: 
 */
import React from 'react';
import {useLocation, useParams} from '../react-router-dom'
import {UserAPI} from '../utils'

function UserDetail(props) {
  const [user, setUser] = React.useState({})
  let location = useLocation()
  let params = useParams()
  React.useEffect(() => {
    let user = location.state
    if(!user) {
      let id = params.id
      user = UserAPI.find(id)
    }
    if(user) setUser(user)
  }, [])
  return (
    <div>{user.id}: {user.username}</div>
  )
}

export default UserDetail