import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import FormInput from '../components/FormInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMoneyBillWave, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

function AddLoan() {
    const [loans, setLoans] = useState([])
    const [clients, setClient] = useState({})
    const [loading, setLoading] = useState(false)
    const [loanSelect, setLoanSelect] = useState("")
    const [newLoan, setNewLoan] = useState({name: "", amount: "", payments: "", numberAccount: ""})
    const [errors, setErrors] = useState({})
    
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const loggedIn = localStorage.getItem("loggedIn");

    useEffect(()=>{
        if (loggedIn && token) {
            axios('/api/clients/current', {
                headers:{ Authorization: `Bearer ${token}` }
            })
            .then(res=> setClient(res.data))
            .catch(err => console.log(err))
        }
    }, [])

    useEffect(()=>{
        setLoading(true)
        if (loggedIn && token) {
            axios('/api/loans/',{
                headers:{ Authorization: `Bearer ${token}` }
            })
            .then(res => setLoans(res.data))
            .catch(err=> console.log(err))
            .finally(()=> setLoading(false))
    }
    },[])

    const handLeChange = (e) => {
        setLoanSelect(e.target.value)
        setNewLoan(prev => ({ ...prev, name: e.target.value, payments: "", amount: "" })) // Reset dependent fields
    }

    const handLeChangeNew = (e) => {
        setNewLoan({...newLoan, [e.target.name]: e.target.value})
        setErrors(prev => ({...prev, [e.target.name]: null}))
    }

    const handLeSubmit = (e) => {
        e.preventDefault()
        if (loggedIn && token) {
            axios.post('/api/loans/', newLoan,{
                headers:{ Authorization: `Bearer ${token}` }
            })
            .then(async res => {
                const { value: accept } = await Swal.fire({
                    title: "Términos y Condiciones",
                    input: "checkbox",
                    inputValue: 0,
                    inputPlaceholder: `Acepto los términos y condiciones del préstamo`,
                    confirmButtonText: `Confirmar Solicitud`,
                    confirmButtonColor: '#1e40af',
                    inputValidator: (result) => {
                        return !result && "Debes aceptar los términos para continuar";
                    }});
                    
                    if(accept) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Solicitud Exitosa!',
                            text: 'El préstamo ha sido acreditado en tu cuenta.',
                            confirmButtonColor: '#1e40af'
                        }).then(() => {
                            navigate('/loan'); // Or wherever appropriate
                        });
                        setNewLoan({name: "", amount: "", payments: "", numberAccount: ""});
                        setLoanSelect("");
                    }
            })
            .catch(err => {
                const msg = err.response.data;
                const newErrors = {};
                if (msg === 'Name is empty') newErrors.name = msg;
                if (msg === 'Payments is empty') newErrors.payments = msg;
                if (msg === 'Number account is empty') newErrors.numberAccount = msg;
                if (msg === 'Amount is empty') newErrors.amount = msg;
                
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                } else if (msg === 'Previously obtained loan') {
                     Swal.fire({ icon: 'error', title: 'Error', text: 'Ya tienes un préstamo de este tipo activo.' });
                } else {
                     Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un error al procesar la solicitud.' });
                }
            })
        }
    }
    
    const amountLoan = loans.find(loan => loan.name == loanSelect)

    const selectClass = `
        w-full px-4 py-3 rounded-lg border bg-surface text-text-main outline-none transition-all appearance-none
        bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')]
        bg-[length:12px_12px] bg-[right_1rem_center] bg-no-repeat
    `;

    return (
        <div className='flex flex-col flex-1 w-full gap-8 max-w-4xl mx-auto'>
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/loan" className="p-2 rounded-full hover:bg-slate-200 transition-colors text-text-muted hover:text-primary">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <h1 className='text-2xl font-bold text-text-main'>Solicitar Préstamo</h1>
            </div>

            {loading && <div className="text-center py-10">Cargando opciones de préstamo...</div>}

            {!loading && (
                <div className='bg-white rounded-2xl shadow-card p-8'>
                    <form className='flex flex-col gap-6' onSubmit={handLeSubmit}>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Loan Type Selection */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-text-muted ml-1">Tipo de Préstamo</label>
                                <select 
                                    className={`${selectClass} ${errors.name ? 'border-red-500' : 'border-slate-300 focus:border-primary'}`}
                                    onChange={handLeChange} 
                                    name="name"
                                    value={loanSelect}
                                >
                                    <option value=''>Selecciona un préstamo</option>
                                    {loans.map(loan => (
                                        <option key={loan.id} value={loan.name}>{loan.name} (Max: {loan.maxAmount.toLocaleString("es-AR", { style: "currency", currency: "ARS" })})</option>
                                    ))}
                                </select>
                                {errors.name && <span className="text-xs text-red-500 ml-1">{errors.name}</span>}
                            </div>

                            {/* Account Selection */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-text-muted ml-1">Cuenta de Destino</label>
                                <select 
                                    className={`${selectClass} ${errors.numberAccount ? 'border-red-500' : 'border-slate-300 focus:border-primary'}`}
                                    onChange={handLeChangeNew} 
                                    name='numberAccount'
                                    value={newLoan.numberAccount}
                                >
                                    <option value=''>Selecciona cuenta de destino</option>
                                    {clients.accounts?.map(acc => (
                                        <option key={acc.id} value={acc.number}>{acc.number}</option>
                                    ))}
                                </select>
                                {errors.numberAccount && <span className="text-xs text-red-500 ml-1">{errors.numberAccount}</span>}
                            </div>
                        </div>

                        {/* Amount & Payments - Only show if loan selected */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${loanSelect ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            
                             <FormInput
                                label={`Monto (Máx: ${amountLoan?.maxAmount?.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) || '0'})`}
                                type="number"
                                name="amount"
                                value={newLoan.amount}
                                onChange={handLeChangeNew}
                                error={errors.amount}
                                placeholder="0.00"
                                max={amountLoan?.maxAmount}
                            />

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-text-muted ml-1">Cuotas</label>
                                <select 
                                    className={`${selectClass} ${errors.payments ? 'border-red-500' : 'border-slate-300 focus:border-primary'}`}
                                    name="payments" 
                                    onChange={handLeChangeNew}
                                    value={newLoan.payments}
                                >
                                    <option value=''>Selecciona cantidad de cuotas</option>
                                    {amountLoan?.payments.map(payment => (
                                        <option key={payment} value={payment}>{payment} cuotas</option>
                                    ))}
                                </select>
                                {errors.payments && <span className="text-xs text-red-500 ml-1">{errors.payments}</span>}
                            </div>
                        </div>

                        {/* Summary / Preview could go here */}

                        <div className='flex gap-4 pt-4'>
                            <button 
                                className='flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md flex justify-center items-center gap-2' 
                                type="submit"
                                disabled={!loanSelect}
                            >
                                <FontAwesomeIcon icon={faMoneyBillWave} /> Solicitar
                            </button>
                            <Link to='/loan' className='px-6 py-3 rounded-lg border border-slate-300 text-text-muted hover:bg-slate-50 font-semibold transition-all'>
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default AddLoan