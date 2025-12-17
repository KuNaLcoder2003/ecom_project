
import { Route, Routes } from 'react-router-dom'
import './App.css'

import SignupForm from './components/SignUp'
import SignInForm from './components/SignIn'
import Home from './pages/Home'

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/signin' element={<SignInForm />} />
      </Routes>
    </>
  )
}

export default App
