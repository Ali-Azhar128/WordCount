import React, { useEffect } from 'react'
import LoginForm from '../Components/LoginComponent/LoginForm'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  const user = useSelector(state => state.login.userInfo)
  useEffect(() => {
    if (user) {
      navigate('/main')
    }
  }, [])
  return (
    <div>
      <LoginForm/>
    </div>
  )
}

export default LoginPage
