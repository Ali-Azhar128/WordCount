import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../Components/LoginComponent/LoginForm'

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
