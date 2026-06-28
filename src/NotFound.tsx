// components/NotFound.jsx
import React from 'react'
import { Link } from 'react-router'

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - 页面未找到</h1>
      <p>你要查找的页面不存在。</p>
      <div className="not-found-actions">
        <Link to="/" className="home-link">
          返回首页
        </Link>
        <Link to="/contact" className="contact-link">
          联系支持
        </Link>
      </div>
    </div>
  )
}

export default NotFound