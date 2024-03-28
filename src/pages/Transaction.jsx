import axios from 'axios';
import React, { useEffect, useState } from 'react';
import OptionAccount from '../components/OptionAccount';
import { useDispatch, useSelector } from 'react-redux';
import authActions from '../redux/actions/auth.actions';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Transaction = () => {
    const [newTransaction, setNewTransaction] = useState({amount: '', detail: "", numberOrigin: "", numberDestination: ""})
    const [tipoDestino, setTipoDestino] = useState("")
    const user = useSelector(store => store.authReducer.user)
    const token = localStorage.getItem('token')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {current} = authActions;
    const {loggedIn, ...userData} = user
    const LoggedIn = localStorage.getItem('loggedIn')
    const [errorMessageOrigin, setErrorMessageOrigin] = useState('')
    const [errorMessageDestination, setErrorMessageDestination] = useState('')
    const [errorMessageAmount, setErrorMessageAmount] = useState('')
    const [errorMessageDescription, setErrorMessageDescription] = useState('')

    const handLeChangeTypeDestination = (e) => {
        setTipoDestino(e.target.value)
    }


    useEffect(() => {
        if (LoggedIn && token){
            axios.get('/api/clients/current/accounts/', {
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                dispatch(current(res.data))
        })
    }
    }, [])

    const handLeChange = (e) => {
        setNewTransaction({...newTransaction, [e.target.name]: e.target.value})
        setErrorMessageAmount('')
        setErrorMessageDestination('')
        setErrorMessageOrigin('')
        setErrorMessageDescription('')
        }
        
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('/api/transactions/', newTransaction, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
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
                title: "Transfer successfully"
            });
            navigate('/home')
        })
        .catch(err =>{
            if (err.response.data === 'Number account origin is empty') {
                setErrorMessageOrigin(err.response.data)
            }

            if(err.response.data === 'Number account destination is empty' || err.response.data === 'The account destination not exist'){
                setErrorMessageDestination(err.response.data)
            }

            if (err.response.data === 'Amount is empty' || err.response.data === 'The available balance is insufficient') {
                setErrorMessageAmount(err.response.data)
            }

            if(err.response.data === 'Description is empty'){
                setErrorMessageDescription(err.response.data)
            }


        })
    }

    return (
        <main className='bg-[#395886] flex pb-5 flex-col items-center flex-1 md:rounded-l-3xl'>
            <img className='w-[75px] self-end pt-5 pr-5 md:absolute' src='/logo.png' alt="logo-bank" />
            <h1 className='text-3xl text-center py-6'>Make a transfer</h1>
            <div className='border rounded-xl p-6 w-[90%] md:w-[70%] lg:w-[50%] opacity-95 bg-[#004d74] mb-5 flex justify-center'>
                <form onSubmit={handleSubmit} className='flex flex-col w-9/12'>
                        <label htmlFor="tipoDestino" className='flex flex-col gap-2' onChange={handLeChangeTypeDestination}>Type of destination:
                            <div className='flex gap-5'>
                                <label className='flex gap-2'>
                                <input 
                                type="radio" name="tipoDestino" value="propio" />
                                    Own
                                </label>

                                <label className='flex gap-2'>
                                <input type="radio" name="tipoDestino" value="otros" />
                                    Other
                                </label>
                            </div>
                        </label>
                    <div>
                        <label className='flex flex-col gap-2'>Account Origin:
                            <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            name='numberOrigin' 
                            onChange={handLeChange}>
                                <option value=''>Select account origin</option>
                                {
                                    Object.values(userData)?.map((account, index) => (
                                        <option key={index} value={account.number}>{account.number}</option>
                                    ))
                                }
                            </select>
                        </label>
                            {
                                errorMessageOrigin ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageOrigin}</p> : <div className=' h-5'></div>
                            }
                    </div>
                    <div>
                        <label className='flex flex-col gap-2'>Account Destination:
                            {
                                (tipoDestino == 'propio') && (
                                    <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    name='numberDestination'
                                    onChange={handLeChange}> 
                                        <option value=''>Select account destination</option>
                                        {
                                            Object.values(userData)?.filter((account) => account.number != newTransaction.numberOrigin)
                                                                .map((account2, index) => (<option key={index} value={account2.number}>{account2.number}</option>))
                                        }
                                    </select>
                                )
                            }
                            {
                                (tipoDestino == 'otros') && (
                                    <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    name='numberDestination' 
                                    type="text" 
                                    placeholder='VIN-12345678'
                                    onChange={handLeChange}/>
                                )
                            }
                            {
                                (tipoDestino == '') && (
                                    <p className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    >Select option first</p>
                                )
                            }
                        </label>
                            {
                                errorMessageDestination ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageDestination}</p> : <div className=' h-5'></div>
                            }
                    </div>
                    <div>
                        <label className='flex flex-col gap-2'>Amount:
                        <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        name='amount' 
                        type="number" 
                        onChange={handLeChange}
                        min={'1'}
                        placeholder='E.G. 1111'/>
                        
                        </label>
                        {
                            errorMessageAmount ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageAmount}</p> : <div className=' h-5'></div>
                        }
                    </div>
                    <div>
                        <label className='flex flex-col gap-2'>Description:
                        <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                        name='detail' 
                        type="text" 
                        onChange={handLeChange} 
                        placeholder='E.G. Salary'/>
                        </label>
                        {
                            errorMessageDescription ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageDescription}</p> : <div className=' h-5'></div>
                        }
                    </div>
                    <div className='flex gap-6 justify-center'>
                        <button type='submit' className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>Transfer</button>
                        <Link to ="/home"><button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' type="button" >Cancel</button></Link>
                    </div>
                </form>
        </div>
        </main>
    );
};

export default Transaction;