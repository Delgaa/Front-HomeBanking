import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Account from '../components/Account';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import authActions from '../redux/actions/auth.actions';

function Loan() {
  const [loading, setLoading] = useState(false)
  const user = useSelector(store => store.authReducer.user)
  const {current} = authActions;
  const dispatch = useDispatch();

  useEffect(()=>{
    setLoading(true)
    const token = localStorage.getItem("token")
    const loggedIn = localStorage.getItem("loggedIn")
    
    if (loggedIn && token) {
      axios.get('/api/clients/current',{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => 
        dispatch(current(res.data))
        )
      .catch(err => console.log(err))
      .finally(()=> setLoading(false))
    }
    },[])

  return (
    <div className='flex flex-col flex-1 w-full gap-8'>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-soft">
         <div>
            <h1 className='text-3xl font-bold text-primary-dark'>
              Mis Préstamos
            </h1>
            <p className="text-text-muted mt-1">Gestiona tus préstamos activos y solicita nuevos créditos</p>
         </div>
         <div className="hidden md:block">
            <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
               Créditos Activos: {user.loans?.length || 0}
            </span>
         </div>
      </div>

      {loading && (
        <div className="flex justify-center p-10">
           <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary" />
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-text-main">Préstamos Activos</h2>
             {user.loans?.length < 3 ? (
                <Link to={`/newLoan/${user.id}`}>
                  <button className='py-2 px-4 inline-flex items-center gap-2 text-sm font-semibold rounded-lg bg-primary hover:bg-primary-dark text-white transition-all shadow-md active:scale-95'>
                    <FontAwesomeIcon icon={faPlus} /> Solicitar Préstamo
                  </button>
                </Link>
             ) : (
                <span className="text-sm text-text-muted">Límite de préstamos alcanzado</span>
             )}
          </div>
          
          {user.loans?.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {user.loans.map(loan => (
                <div key={loan.id} className='bg-white p-6 rounded-xl shadow-soft hover:shadow-card transition-shadow border border-slate-100 relative overflow-hidden group'>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <FontAwesomeIcon icon={faPlus} className="text-6xl text-primary transform rotate-12" />
                    </div>
                    
                    <div className="relative z-10">
                        <h3 className='text-lg font-bold text-primary-dark mb-4 border-b border-slate-100 pb-2'>{loan.name}</h3>
                        <div className="space-y-3">
                            <div className='flex justify-between items-center'>
                                <span className="text-text-muted text-sm">Monto Original</span>
                                <span className='text-lg font-bold text-text-main'>
                                    {loan.amount.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                                </span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className="text-text-muted text-sm">Cuotas Restantes</span>
                                <span className='text-sm font-medium bg-slate-100 px-2 py-1 rounded text-text-main'>
                                    {loan.payments}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-white p-12 rounded-xl shadow-soft text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <FontAwesomeIcon icon={faPlus} className="text-2xl" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-text-main">No tienes préstamos activos</h3>
                    <p className="text-text-muted">Solicita un nuevo crédito para financiar tus proyectos.</p>
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Loan