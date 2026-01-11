import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
        <div className='flex flex-col flex-1 w-full gap-8'>
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-soft">
                <div>
                    <h1 className='text-3xl font-bold text-primary-dark'>
                        Realizar Transferencia
                    </h1>
                    <p className="text-text-muted mt-1">Envía dinero a cuentas propias o de terceros</p>
                </div>
            </div>

            <div className="flex justify-center">
                <div className='bg-white p-8 rounded-2xl shadow-soft w-full md:w-3/4 lg:w-2/3'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-main'>Tipo de destino</label>
                            <div className='flex gap-6' onChange={handLeChangeTypeDestination}>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input type="radio" name="tipoDestino" value="propio" className="w-4 h-4 text-primary focus:ring-primary border-gray-300" />
                                    <span className="text-text-main">Cuentas Propias</span>
                                </label>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input type="radio" name="tipoDestino" value="otros" className="w-4 h-4 text-primary focus:ring-primary border-gray-300" />
                                    <span className="text-text-main">Terceros</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-main'>Cuenta de Origen</label>
                            <select 
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors'
                                name='numberOrigin' 
                                onChange={handLeChange}
                            >
                                <option value=''>Selecciona una cuenta</option>
                                {Object.values(userData)?.map((account, index) => (
                                    <option key={index} value={account.number}>{account.number} - Saldo: ${account.balance}</option>
                                ))}
                            </select>
                            {errorMessageOrigin && <p className='mt-1 text-red-500 text-sm'>{errorMessageOrigin}</p>}
                        </div>

                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-main'>Cuenta de Destino</label>
                            {tipoDestino === 'propio' && (
                                <select 
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors'
                                    name='numberDestination'
                                    onChange={handLeChange}
                                >
                                    <option value=''>Selecciona cuenta destino</option>
                                    {Object.values(userData)?.filter((account) => account.number != newTransaction.numberOrigin)
                                        .map((account2, index) => (<option key={index} value={account2.number}>{account2.number}</option>))
                                    }
                                </select>
                            )}
                            {tipoDestino === 'otros' && (
                                <input 
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors'
                                    name='numberDestination' 
                                    type="text" 
                                    placeholder='Ej: VIN-12345678'
                                    onChange={handLeChange}
                                />
                            )}
                            {tipoDestino === '' && (
                                <div className='p-2.5 text-sm text-text-muted bg-gray-100 rounded-lg border border-gray-200'>
                                    Selecciona primero el tipo de destino
                                </div>
                            )}
                            {errorMessageDestination && <p className='mt-1 text-red-500 text-sm'>{errorMessageDestination}</p>}
                        </div>

                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-main'>Monto</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-gray-500">$</span>
                                </div>
                                <input 
                                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-8 p-2.5 transition-colors'
                                    name='amount' 
                                    type="number" 
                                    onChange={handLeChange}
                                    min={'1'}
                                    placeholder='0.00'
                                />
                            </div>
                            {errorMessageAmount && <p className='mt-1 text-red-500 text-sm'>{errorMessageAmount}</p>}
                        </div>

                        <div>
                            <label className='block mb-2 text-sm font-medium text-text-main'>Descripción</label>
                            <input 
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 transition-colors'
                                name='detail' 
                                type="text" 
                                onChange={handLeChange} 
                                placeholder='Ej: Alquiler, Compras varias...'
                            />
                            {errorMessageDescription && <p className='mt-1 text-red-500 text-sm'>{errorMessageDescription}</p>}
                        </div>

                        <div className='flex gap-4 justify-end mt-4'>
                            <Link to="/home">
                                <button type="button" className='py-2.5 px-5 text-sm font-medium text-text-muted focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-4 focus:ring-gray-200 transition-all'>
                                    Cancelar
                                </button>
                            </Link>
                            <button type='submit' className='text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-all shadow-md hover:shadow-lg'>
                                Transferir
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Transaction;