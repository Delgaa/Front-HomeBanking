import React, { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AccountDetail from './pages/AccountDetail'
import Transaction from './pages/Transaction'
import Loan from './pages/Loan'
import Card from './pages/Card'
import AddLoan from './pages/AddLoan'
import AddAccount from "./pages/AddAccount"
import AddCard from './pages/AddCard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import withAuth from './hocs/withAuth'


const routesLogged = [
  {
    path: '/home',
    element: Home
  },
  {
    path: '/account/:id',
    element: AccountDetail
  },
  {
    path: '/cards',
    element: Card
  },
  {
    path: '/transaction',
    element: Transaction
  },
  {
    path: '/loan',
    element: Loan
  },
  {
    path: '/newLoan/:id',
    element: AddLoan
  },
  {
    path: '/newAccount/:id',
    element: AddAccount
  },
  {
    path: '/newCard/:id',
    element: AddCard
  }
]

const App = () => {

  return (
        <>
          <Routes>
            <Route element={<MainLayout/>}>
              {
                routesLogged.map((ruta) => {
                  const Page = withAuth(ruta.element)
                  return <Route key={ruta.path} path={ruta.path} element={<Page/>}/>
                })

              }
            </Route>
            <Route path='/login' element={<SignIn />} />
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='*' element={<Navigate to="/login"/>}/>
          </Routes>
        </>
  
  )
}

export default App
