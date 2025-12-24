
import { Route, Routes } from 'react-router-dom'
import './App.css'

import SignupForm from './components/SignUp'
import SignInForm from './components/SignIn'
import Home from './pages/Home'
import Cart from './pages/Cart'

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/signin' element={<SignInForm />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/product/:id' element={<p>Product page</p>} />
      </Routes>
    </>
  )
}

export default App
