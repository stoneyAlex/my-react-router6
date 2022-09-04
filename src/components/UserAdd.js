/*
 * @Author: shimingxia
 * @Date: 2022-08-30 19:32:13
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-31 14:32:55
 * @Description: 
 */
import React from 'react';
import {UserAPI} from '../utils'
import {useNavigate} from '../react-router-dom'

function UserAdd(props) {
  const usernameRef = React.useRef()
  const navigate = useNavigate()
  const handleSubmit = (event) => {
    event.preventDefault();
    let username = usernameRef.current.value
    UserAPI.add({id: Date.now() + '', username})
    navigate('/user/list')
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type='text' ref={usernameRef} />
      <button type='submit'>提交</button>
    </form>
  )
}

export default UserAdd