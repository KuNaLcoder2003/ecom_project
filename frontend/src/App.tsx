
import { Route, Routes } from 'react-router-dom'
import './App.css'

import SignupForm from './components/SignUp'
import SignInForm from './components/SignIn'
import Home from './pages/Home'

import Product from './components/Product'
import Cart from './components/Cart'
import CheckOut from './pages/CheckOut'
import PaymentPage from './pages/PaymentPage'
import AdminDashBoard from './pages/AdminDashBoard'
import AdminSignin from './components/AdminSignin'
import ProductList from './components/ProductList'

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
        <Route path='/payment/:orderId' element={<PaymentPage />} />
        <Route path='/success' element={<p>Success Page</p>} />
        <Route path='/failure' element={<p>Failure Page</p>} />
        <Route path='/admin' element={<AdminDashBoard />} />
        <Route path='/admin/signin' element={<AdminSignin />} />
        <Route path='/product/search/:debouncedWord' element={<ProductList />} />
      </Routes>
    </>
  )
}

export default App
