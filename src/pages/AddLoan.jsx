import axios from 'axios'
import React, { useEffect, useState } from 'react'
import OptionLoan from '../components/OptionLoan'
import OptionAccount from '../components/OptionAccount'
import  Input  from '../components/Input'
import OptionPayment from '../components/OptionPayment'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

function AddLoan() {
    const [loans, setLoans] = useState([])
    const [clients, setClient] = useState({})
    const [loading, setLoading] = useState(false)
    const [loanSelect, setLoanSelect] = useState("")
    const [newLoan, setNewLoan] = useState({name: "", amount: "", payments: "", numberAccount: ""})
    const [errorMessageName, setErrorMessageName] = useState('')
    const [errorMessageAmount, setErrorMessageAmount] = useState('')
    const [errorMessagePayment, setErrorMessagePayment] = useState('')
    const [errorMessageAccount, setErrorMessageAccount] = useState('')


    const token = localStorage.getItem("token");
    const loggedIn = localStorage.getItem("loggedIn");

    useEffect(()=>{
        if (loggedIn && token) {
            axios('/api/clients/current', {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res=> setClient(res.data))
            .catch(err => console.log(err))
        }
    }, [])

    useEffect(()=>{
        setLoading(true)
        if (loggedIn && token) {
            axios('/api/loans/',{
                headers:{
                    Authorization: `Bearer ${token}`
                }
        })
            .then(res => setLoans(res.data))
            .catch(err=> console.log(err))
            .finally(()=> setLoading(false))
    }
    },[])

    const handLeChange = (e=>{
        setLoanSelect(e.target.value)
    })

    const handLeChangeNew = (e=>{
        setNewLoan({...newLoan, [e.target.name]: e.target.value})
        setErrorMessageName('')
        setErrorMessagePayment('')
        setErrorMessageAccount('')
        setErrorMessageAmount('')
    })

    const handLeSubmit = (e) => {
        e.preventDefault()
        if (loggedIn && token) {
            axios.post('/api/loans/', newLoan,{
            headers:{
                Authorization: `Bearer ${token}`
            }
            })
            .then(async res => {
                const { value: accept } = await Swal.fire({
                    title: "Terms and conditions",
                    input: "checkbox",
                    inputValue: 1,
                    inputPlaceholder: `I agree with the terms and conditions`,
                    confirmButtonText: `Continue&nbsp;<i class="fa fa-arrow-right"></i>`,
        
                    inputValidator: (result) => {
                        return !result && "You need to agree with T&C";
                    }});
                    accept && Swal.fire("Successfully applied for a loan");
                setNewLoan({})
            })
            .catch(err => {
                if (err.response.data === 'Name is empty'){
                    setErrorMessageName(err.response.data)
                }

                if (err.response.data === 'Payments is empty'){
                    setErrorMessagePayment(err.response.data)
                }

                if (err.response.data === 'Number account is empty'){
                    setErrorMessageAccount(err.response.data)
                }

                if (err.response.data === 'Amount is empty'){
                    setErrorMessageAmount(err.response.data)
                }

                if (err.response.data === 'Previously obtained loan'){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'You have already obtained a loan',
                    })
                }

            })
        
        }
    }
    const amountLoan = loans.find(loan => loan.name == loanSelect)

    return (
        <main className='bg-[#395886] flex pb-5 flex-col items-center flex-1 md:rounded-l-3xl'>
            <img className='w-[75px] self-end pt-5 pr-5 md:absolute' src='/logo.png'  alt="logo-bank" />
            <h1 className='text-3xl text-center py-6'>Apply for a loan</h1>

            {loading && <h2>Loading...</h2>}

            <div className='border rounded-xl p-6 w-[90%] md:w-[70%] lg:w-[50%] opacity-90 bg-[#004d74] mb-5'>
            <form className='flex flex-col items-center justify-center w-full' onSubmit={handLeSubmit}>
                <fieldset className='w-[75%]'>
                    <label className='flex flex-col gap-1'>Select loan:
                        <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        onChange={handLeChange} 
                        onInput = {handLeChangeNew} 
                        
                        name = "name">
                            <option value=''>Select loan</option>
                            {
                                loans.map(loan => {return <OptionLoan key={loan.id} name={loan.name}/>})
                            }
                        </select>
                    </label>
                        {
                            errorMessageName ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageName}</p> : <div className=' h-5'></div>
                        }
                </fieldset>

                <fieldset className='w-[75%]'>
                    <label className='flex flex-col gap-1'>Source account
                        <select className='bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        onInput = {handLeChangeNew} 
                        
                        name='numberAccount' >
                            <option value='' >Select account</option>
                            {
                                clients.accounts?.map(loan => {return <OptionAccount key={loan.id} number={loan.number}/>})
                            }
                        </select>
                    </label>
                        {
                            errorMessageAccount ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageAccount}</p> : <div className=' h-5'></div>
                        }
                </fieldset>

                <fieldset className='w-[75%]'>
                        <label className='flex flex-col gap-1' onInput={handLeChangeNew}>Source Amount
                            {
                                loanSelect != '' ? <Input amount={amountLoan?.maxAmount}/>:<p className='bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                                    Select loan first
                                    </p>
                            }
                        </label>
                            {
                                errorMessageAmount ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageAmount}</p>: <div className=' h-5'></div>
                            }
                </fieldset>

                <fieldset className='w-[75%]'>
                    <label className='flex flex-col gap-1'>Payments
                        <select className='bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-sky-700 dark:border-blue-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        
                        name = "payments" 
                        onChange={handLeChangeNew}>
                            <option value=''>Select payments</option>
                            {
                                loanSelect != '' && amountLoan?.payments.map(payment=>{return <OptionPayment key={payment} payments={payment}/>})
                            }
                        </select>
                    </label>
                        {
                            errorMessagePayment ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessagePayment}</p>: <div className=' h-5'></div>
                        }
                </fieldset>
                <div className='flex flex-wrap gap-6 justify-center w-full'>
                    <button className=' bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded' type="submit">Apply</button>
                    <Link to='/loan'><button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Cancel</button></Link>
                </div>
            </form>
            </div>
        </main>
    )
}

export default AddLoan