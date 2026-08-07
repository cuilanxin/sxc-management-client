import { getUserInfo, getUsers } from "@/api/personnel-management";
import { GetTasksParams, Task, UserInfo } from "@/api/types";
import { message, PaginationProps } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useState, useEffect, useRef } from "react";

import { Moment } from "moment";
import { getTasks } from "@/api/task-management";

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


export interface FormValues extends Omit<
  GetTasksParams,
  'createdAt' | 'downAt' | 'deadlineAt'
> {
  createdAt?: [Moment, Moment,],
  downAt?: [Moment, Moment,],
  deadlineAt?: [Moment, Moment,],
}


function farmatAt(at?: [Moment, Moment]) {
  if (at) {
    return [
      at[0].format('YYYY-MM-DD HH:mm:ss'),
      at[1].format('YYYY-MM-DD HH:mm:ss')
    ] as [string, string]
  }

  return undefined
}

function formatGetTasksParams(values: FormValues): GetTasksParams {
  const { createdAt, downAt, deadlineAt, ...others } = values

  const createdAtFromat = farmatAt(createdAt)
  const downAtFormat = farmatAt(downAt)
  const deadlineAtFormat = farmatAt(deadlineAt)

  return {
    ...others,
    createdAt: createdAtFromat,
    downAt: downAtFormat,
    deadlineAt: deadlineAtFormat
  }
}


export function useGetTasks() {
  const [getTaskLoading, setGetTaskLoading] = useState(false);
  const [dataSource, setDataSource] = useState<Task[]>([])
  const [pagination, setPagination] = useState<PaginationProps>({
    total: 0,
    current: 1,
    pageSize: 10,
  })
  const formValues = useRef<FormValues>({});


  const getData = (
    page: number = 1,
    pageSize: number = 10,
    value: FormValues = formValues.current!
  ) => {
    setGetTaskLoading(true)

    const formatValues = formatGetTasksParams(value)

    getTasks({
      page,
      pageSize,
      ...formatValues,
    }).then((val) => {
      setDataSource(val.tasks)

      setPagination({
        total: val.total,
        current: val.page,
        pageSize: val.pageSize,
      })

      formValues.current = value;

    }, err => {
      message.error(err.message || '网络异常稍后重试！')
    }).finally(() => {
      setGetTaskLoading(false)
    })
  }


  return {
    getTaskLoading,
    dataSource,
    pagination,
    getData
  }
}