import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainPage from './Pages/MainPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage/>
  },
  {
    path: '/login',
    element: <LoginPage/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
