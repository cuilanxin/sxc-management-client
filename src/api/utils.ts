import { message } from 'antd';

const urlPrefix = 'http://localhost:5000'

export function apiFetch(
  url: string, 
  urlParams: Record<string, any> = {}, 
  fetchParams: RequestInit = { }
) {
  
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')
  const {
    method = 'POST',
    headers
  } = fetchParams || { }


  if (!url) return Promise.reject('检查请求方法！！！')

  const requestBody: Record<string, any> = {}
  for (const key in urlParams) {
    if (urlParams[key] === '') continue;
    requestBody[key] = urlParams[key]
  }

  return fetch(
    urlPrefix + url,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        'X-username': username!,
        // authorization
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody)
    }
  ).then((response) => {
    console.log('cuilanxin response', response)
    return response.json().then(val => {
      if (val.code === 200) {
        return val
      }
      if (val.code === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        message.error('登录状态异常，请重新登录！')
        window.location.href='login'
        return Promise.reject(val)
      }
      return Promise.reject(val)
    })
  })
}
