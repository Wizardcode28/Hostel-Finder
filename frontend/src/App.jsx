import './App.css'
import HomePage from './components/HomePage/HomePage'
import HostelDetails from './components/HostelDetails/HostelDetails'
import HostelRegistration from './components/HostelRegistration/HostelRegistration'
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
    path:"/hostel",
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
