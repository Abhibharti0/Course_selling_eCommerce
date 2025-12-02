import { Route, Routes } from 'react-router-dom'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import { Toaster } from 'react-hot-toast'
import Courses from './components/Courses.jsx'
import Buy from './components/Buy.jsx'
import Purchases from './components/Purchases.jsx'

function App() {
  return (
    <>
      <Toaster />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path='/courses' element={<Courses />} />
        <Route path='/buy/:courseId' element={<Buy />} />
        <Route path='/purchases' element={<Purchases />} />
      </Routes>
    </>
  )
}

export default App
