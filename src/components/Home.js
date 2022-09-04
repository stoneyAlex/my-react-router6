/*
 * @Author: shimingxia
 * @Date: 2022-08-30 09:53:15
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-31 14:33:09
 * @Description: 
 */
import React from 'react';
import { useNavigate } from '../react-router'

function Home(props) {
  let navigate = useNavigate()
  function navigateTo() {
    navigate('/profile')
  }
  return (
    <div>
      <div>Home</div>
      <button onClick={navigateTo}>跳转到/profile</button>
    </div>
  )
}

export default Home