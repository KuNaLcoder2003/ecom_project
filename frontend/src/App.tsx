
import { Route, Routes } from 'react-router-dom'
import './App.css'

import SignupForm from './components/SignUp'
import SignInForm from './components/SignIn'
import Home from './pages/Home'

import Product from './components/Product'
import Cart from './components/Cart'
import CheckOut from './pages/CheckOut'

function App() {


  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/signin' element={<SignInForm />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/order' element={<CheckOut />} />
      </Routes>
    </>
  )
}

export default App
