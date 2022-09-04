/*
 * @Author: shimingxia
 * @Date: 2022-08-30 19:44:34
 * @LastEditors: shimingxia
 * @LastEditTime: 2022-08-30 19:47:24
 * @Description: 
 */
export const UserAPI = {
  list() {
    let userStr = localStorage.getItem('users')
    let users = userStr ? JSON.parse(userStr) : []
    return users
  },
  add(user) {
    let users = UserAPI.list()
    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))
  },
  find(id) {
    let users = UserAPI.list()
    return users.find(user => user.id === id)
  }
}