import { getUserInfo, getUsers } from "@/api/personnel-management";
import { UserInfo } from "@/api/types";
import { message } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useState, useEffect } from "react";

export function useGetUsers() {
  const [usersLoading, setUsersLoading] = useState(false)
  const [users, setUsers] = useState<DefaultOptionType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserInfo>()

  useEffect(() => {
    setUsersLoading(true)


    Promise.all([getUsers({ isLogout: false }), getUserInfo()]).then((res) => {
      const [allUsersRes, currentUserRes] = res;
      setUsers(allUsersRes.users.map((item => ({
        value: item.username,
        label: item.name
      }))))

      setCurrentUser(currentUserRes.usersInfo)
    }, err => {
      message.error(err.message || '网络异常稍后重试！')
    }).finally(() => {
      setUsersLoading(false)
    })
  }, [])
  
  
  return {
    usersLoading,
    users,
    currentUser,
  }
}