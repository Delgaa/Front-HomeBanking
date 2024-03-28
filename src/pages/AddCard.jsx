import axios from 'axios'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { COLORS, TYPES } from '../utils/typesCard'
import Swal from 'sweetalert2'

function AddCard() {
  const [newCard, setNewCard] = useState({type: '', color: ''})
  const [errorMessageType, setErrorMessageType] = useState(null)
  const [errorMessageColor, setErrorMessageColor] = useState(null)


  function handLeChange (e){
    setNewCard({...newCard, [e.target.name]: e.target.value})
    setErrorMessageType(null)
    setErrorMessageColor(null)
  }

  function handLeSubmit (e){
    e.preventDefault()
    const token = localStorage.getItem('token')

    if(token){
      axios.post('/api/clients/current/cards/', newCard,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
      })
      .catch(err => {

        if (err.response.data === "Type no content") {
          setErrorMessageType(err.response.data)
        }

        if (err.response.data === "Color no content") {
          setErrorMessageColor(err.response.data)
        }

        if(err.response.data === 'The maximum number ofdebitcards allowed has been reached' || err.response.data === 'The maximum number ofcreditcards allowed has been reached'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response.data
        })
        }

      if(err.response.data === 'You already have a card of type debit with the color titanium' || err.response.data === 'You already have a card of type credit with the color titanium'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response.data
        })
      }

      if(err.response.data === 'You already have a card of type debit with the color silver' || err.response.data === 'You already have a card of type credit with the color silver'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response.data
        })
      }

      if(err.response.data === 'You already have a card of type debit with the color gold' || err.response.data === 'You already have a card of type credit with the color gold'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response.data
        })
      }

    })
  }
}

  return (
    <main className='bg-[#395886] flex pb-5 flex-col items-center flex-1 md:rounded-l-3xl'>
      <img className='w-[75px] self-end pt-5 pr-5 md:absolute' src='/logo.png'  alt="logo-bank" />
      <h1 className='text-3xl text-center pt-6'>Apply for a card</h1>

      <div className='border rounded-xl p-6 w-[90%] md:w-[70%] lg:w-[50%] bg-[#004d74] mb-5'>
      <form onSubmit={handLeSubmit} className='flex flex-col items-center  w-full'>
        <fieldset className='w-[75%]'>
          <label className='flex flex-col gap-1'>Select card type:
              <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              onChange={handLeChange}
              name="type" > 
                <option value=''>Selec type card</option>
                {
                  TYPES.map(type => {return <option key={type} value={type.toUpperCase()}>{type}</option>})
                }
              </select>
          </label>
              {
                errorMessageType ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageType}</p> : <div className=' h-5'></div>
              }
          </fieldset>

          <fieldset  className='w-[75%]'> 
          <label className='flex flex-col gap-1'>Select card membership(color):
              <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
              onChange={handLeChange}
              name="color"> 
                <option value=''>Select color card</option>
                {
                  COLORS.map(color => {return <option key={color} value={color.toUpperCase()}>{color}</option>})
                }
              </select>
          </label>
              {
                errorMessageColor ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageColor}</p>: <div className=' h-5'></div>
              }
        </fieldset>
        <div className='flex gap-6 justify-center'>
        <button type="submit" className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>Apply</button>
        <Link to ="/cards"><button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' type="button" >Cancel</button></Link>
        </div>
        <img src="/image 22.png" className='w-[250px] ' alt="" />
      </form>
      </div>
    </main>
  )
}

export default AddCard