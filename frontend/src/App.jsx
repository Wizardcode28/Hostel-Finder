import './App.css'
import Dashboard from './components/Dashboard/Dashboard'
import HomePage from './components/HomePage/HomePage'
import HostelDetails from './components/HostelDetails/HostelDetails'
import HostelOwner from './components/SignUp/HostelOwner'
import HostelRegistration from './components/HostelRegistration/HostelRegistration'
import Login from './components/Login/Login'
import Student from './components/Student/Student'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

const router= createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/student",
    element:<Student/>
  },
  {
    path:"/signup",
    element:<HostelOwner/>
  },
  {
    path:"/dashboard",
    element:<Dashboard/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/hostelform",
    element:<HostelRegistration/>
  },
  {
    path:"/hostelDetails",
    element:<HostelDetails/>
  }
])

function App() {

  return (
  <>
    <RouterProvider router={router}/>
  </>
  )
}

export default App
