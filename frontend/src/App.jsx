import { ToastContainer } from 'react-toastify'
import './App.css'
import MainPage from './Pages/mainPage'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <div className='h-[100vh]'>
        <ToastContainer/>
        <Outlet/>
    </div>
  )
}

export default App
