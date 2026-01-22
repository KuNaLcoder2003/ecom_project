
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ReactLenis } from 'lenis/react'
import SignupForm from './components/SignUp'
import SignInForm from './components/SignIn'
import Home from './pages/Home'

import Product from './components/Product'
import CheckOut from './pages/CheckOut'
import PaymentPage from './pages/PaymentPage'
import AdminDashBoard from './pages/AdminDashBoard'
import AdminSignin from './components/AdminSignin'
import ProductList from './components/ProductList'
import { useState } from 'react'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

function App() {


  return (
    <>
      <ReactLenis root />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/signin' element={<SignInForm />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/order' element={<CheckOut />} />
        <Route path='/payment/:orderId' element={<PaymentPage />} />
        <Route path='/success' element={<p>Success Page</p>} />
        <Route path='/failure' element={<p>Failure Page</p>} />
        <Route path='/admin' element={<AdminDashBoard />} />
        <Route path='/admin/signin' element={<AdminSignin />} />
        <Route path='/product/search/:debouncedWord' element={<ProductList />} />
        <Route path='/temp' element={<TransferList />} />
      </Routes>
    </>
  )
}


interface data {
  title: string;
  id: number;
  checked: boolean;
}
const TransferList = () => {
  const data = [
    { title: 'First', id: 0, checked: false },
    { title: 'Second', id: 1, checked: false },
    { title: 'Third', id: 2, checked: false },
    { title: 'Fourth', id: 3, checked: false },
  ];

  const [leftList, setLeftList] = useState<data[]>(data);

  const [rightList, setRightList] = useState<data[]>([]);
  function handleLeftSelect(item: data) {
    if (!item) {
      return
    }
    setLeftList(arr => arr.map(obj => {
      if (item.id == obj.id) {
        obj.checked = !obj.checked
        return obj
      } else {
        return obj
      }
    }))
  }
  function handleRightSelect(item: data) {
    if (!item) {
      return
    }
    setRightList(arr => arr.map(obj => {
      if (item.id == obj.id) {
        obj.checked = !obj.checked
        return obj
      } else {
        return obj
      }
    }))
  }

  function handleRightTransfer() {
    if (leftList.length == 0) {
      toast.error('No items in left list')
      return
    }
    const notTransferable = leftList.filter(item => item.checked == false)
    const transferable = leftList.filter(item => item.checked == true).map(item => {
      item.checked = false
      return item
    })

    if (!transferable || transferable.length == 0) {
      toast.error('Select atleast one item to transfer')
      return
    }
    setRightList([...rightList, ...transferable].sort((a, b) => {
      return Number(a.id) - Number(b.id)
    }))
    setLeftList(notTransferable)
  }
  function handleLeftTransfer() {
    if (rightList.length == 0) {
      toast.error('No items in riightlist')
      return
    }
    const notTransferable = rightList.filter(item => item.checked == false)
    const transferable = rightList.filter(item => item.checked == true).map(item => {
      item.checked = false
      return item
    })

    if (!transferable || transferable.length == 0) {
      toast.error('Select atleast one item to transfer')
      return
    }
    setLeftList([...leftList, ...transferable].sort((a, b) => {
      return Number(a.id) - Number(b.id)
    }))
    setRightList(notTransferable)
  }
  return (
    <div className='max-w-7xl m-auto mt-20 p-4 h-auto flex items-center gap-10'>
      <Toaster />
      <div>
        {
          leftList.length == 0 ? null : (
            <div className='flex flex-col items-center h-auto p-2 w-64 gap-8'>
              {
                leftList.map((item) => {
                  return (
                    <p onClick={() => {
                      handleLeftSelect(item)
                    }} className={`w-full text-center p-2 rounded-lg cursor-pointer ${item.checked ? 'bg-black text-white' : 'bg-zinc-200 text-black'}`} key={item.title}>{item.title}</p>
                  )
                })
              }
            </div>
          )
        }
      </div>
      <div className='flex flex-col items-baseline gap-6'>
        <ArrowBigLeft className='cursor-pointer' onClick={handleLeftTransfer} />
        <ArrowBigRight className='cursor-pointer' onClick={handleRightTransfer} />
      </div>
      <div>
        {
          rightList.length == 0 ? null : (<div className='flex flex-col items-center h-full p-2 w-64 gap-8 shadow-lg'>
            {
              rightList.map((item) => {
                return (
                  <p onClick={() => {
                    handleRightSelect(item)
                  }} className={`w-full text-center p-2 rounded-lg cursor-pointer ${item.checked ? 'bg-black text-white' : 'bg-zinc-200 text-black'}`} key={item.title}>{item.title}</p>
                )
              })
            }
          </div>)
        }
      </div>
    </div>
  )
}
export default App
