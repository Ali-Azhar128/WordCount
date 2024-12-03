import { ToastContainer } from 'react-toastify'
import './App.css'
import MainPage from './Pages/mainPage'
import { Outlet } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div className='h-[100vh]'>
        <Outlet/>
        <ToastContainer/>
    </div>
  )
}

export default App
