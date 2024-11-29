import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import { Button, Container, Typography, Box, Paper, Avatar, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useLoginMutation } from '../../Slices/usersApiSlices'
import { toast } from 'react-toastify'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoginInfo } from '../../Slices/usersSlice'
import LoadingButton from '@mui/lab/LoadingButton';

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
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  const handleGuestLogin = () => {
    // dispatch(setLoginInfo({ role: 'guest',
    //   username: 'Guest',
    //  })); 
    navigate('/guestLogin'); 

    
  };
  const handleAnonymousClick = () => {
    dispatch(setLoginInfo({ role: 'anonymous',
      username: 'Anonymous',
     }));
    navigate('/');
  }


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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPass(e.target.value)}
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
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGuestLogin}
            sx={{ mt: 1, mb: 2 }}
          >
            Sign In as Guest
          </Button>
          <Typography>
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
          <Typography>
            OR
          </Typography>
          <Button
          variant='outlined'
          onClick={handleAnonymousClick}
          >
            Continue using without signup
          </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginForm
