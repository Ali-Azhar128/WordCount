import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { Button, Container, Typography, Box, Paper, Avatar, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useGuestLoginMutation } from '../../Slices/usersApiSlices'
import { toast } from 'react-toastify'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoginInfo } from '../../Slices/usersSlice'
import LoadingButton from '@mui/lab/LoadingButton';

const GuestSigninComponent = () => {
  const [username, setUsername] = useState('')

  // React Router DOM
  const navigate = useNavigate()
  // Redux
  const [login, {isLoading, isError}] = useGuestLoginMutation()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(username, 'username')
    try {
      const res = await login(username).unwrap();
      console.log('Success login', res);
      dispatch(setLoginInfo(res.user));
      navigate('/main');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  


  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{
            fontWeight: 'bold',
          }}>
            Sign In
          </Typography>
          <Typography component="h7" variant="h7">
            Please sign in to continue
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <LoadingButton
            loading={isLoading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </LoadingButton>
            <Divider sx={{ width: '100%', my: 2 }} />
          <Typography>
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default GuestSigninComponent
