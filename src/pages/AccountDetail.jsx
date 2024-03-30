import React, { useEffect, useState } from 'react'
import Table from '../components/Table'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Account from '../components/Account'
import { useDispatch, useSelector } from 'react-redux'
import authActions from '../redux/actions/auth.actions';

function AccountDetail() {
  const [loading, setLoading] = useState(false)
  const user = useSelector(store => store.authReducer.user)
  const dispatch = useDispatch()
  const {current} = authActions;
  const {id} = useParams()

  useEffect(()=>{
    setLoading(true)
    const token = localStorage.getItem('token')
    const loggedIn = localStorage.getItem('loggedIn')

    if (loggedIn && token) {
      axios(`/api/clients/current/accounts/${id}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
        .then(res=> dispatch(current(res.data)))
        .catch(err => console.log(err))
        .finally(()=> setLoading(false))
    }
  }, [])


  return (
    <main className='bg-[#395886] flex pb-5 flex-col items-center flex-1 md:rounded-l-3xl'>
        <img className='w-[75px] self-end pt-5 pr-5 md:absolute' src='/logo.png'  alt="logo-bank" />
        <h1 className='text-3xl text-center py-6 text-white'>Your account selected</h1>
      <div className='flex flex-col gap-6 w-[90%] items-center justify-center'>
        {loading && <h2>Loading...</h2>}
        {user != null &&
          <Account>
            <div  className='border rounded-xl p-6 bgAccount opacity-90 md:w-[60%] lg:w-[50%]'>
              <h3 className='md:pl-5 text-lg font-medium pb-6'>Number: {user.number}</h3>
              <p className='md:pl-5 flex  text-lg '>Amount: <span className='text-xl pl-6 self-end'>{user.balance?.toLocaleString("es-AR",{ style: "currency", currency: "ARS" })}</span></p>
              <p className='md:pl-5 text-lg  pt-6'>Creation date: {user.creationDate}</p>
            </div>
          </Account>
        }
        <h2 className=' text-3xl w-[80%] text-white'>Transactions Resume:</h2>
        {
          user.transactions?.length > 0 ? (<section className='w-[80%] flex flex-col items-center relative shadow-mdrounded-lg'>
            <Table transactions={user.transactions}/>
        </section>) : <h2 className='text-xl text-white font-semibold text-center'> This account has no transactions </h2>
        }
        
      </div>
    </main>
  )
}

export default AccountDetail