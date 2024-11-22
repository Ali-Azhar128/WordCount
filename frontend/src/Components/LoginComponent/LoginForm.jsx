import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'
import { useLoginMutation } from '../../Slices/usersApiSlices'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoginInfo } from '../../Slices/usersSlice'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  // React Router DOM
  const navigate = useNavigate()
  // Redux
  const [login, {isLoading, isError}] = useLoginMutation()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { email, pass };
    console.log(email + pass, 'All data');
    try {
      const res = await login(user).unwrap();
      console.log('Success login', res);
      dispatch(setLoginInfo(res.user));
      navigate('/'); // Navigate to the home page after successful login
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };


  return (
    <div className='bg-white flex flex-col space-y-3'>
        <form className='flex flex-col space-y-2'>
          <TextField onChange={(e) => {setEmail(e.target.value)}} id="outlined-basic" label="Email" variant="outlined" />
          <TextField onChange={(e) => setPass(e.target.value)} id="outlined-basic" label="Password" variant="outlined" />
          <Button onClick={handleSubmit} type='submit' variant="contained">Login</Button>
        </form>
    </div>
  )
}

export default LoginForm
