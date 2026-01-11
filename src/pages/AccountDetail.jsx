import React, { useEffect, useState } from 'react'
import Table from '../components/Table'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import authActions from '../redux/actions/auth.actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faWallet, faCalendarAlt, faHashtag } from '@fortawesome/free-solid-svg-icons';

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
  }, [id])


  return (
    <div className='flex flex-col flex-1 w-full gap-8'>
       {/* Breadcrumb / Back */}
       <div className="flex items-center gap-4">
          <Link to="/home" className="p-2 rounded-full hover:bg-slate-200 transition-colors text-text-muted hover:text-primary">
             <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h1 className='text-2xl font-bold text-text-main'>Detalle de Cuenta</h1>
       </div>

      {loading && <div className="text-center py-10">Cargando detalles...</div>}

      {user != null && !loading && (
        <>
            {/* Account Info Card */}
            <div className='
                w-full md:w-2/3 lg:w-1/2 mx-auto
                relative overflow-hidden rounded-2xl p-8 
                bg-gradient-to-r from-primary to-primary-dark
                text-white shadow-card
            '>
                 {/* Decorative Circle */}
                 <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>

                 <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-blue-200 text-sm mb-1">Saldo Actual</span>
                            <span className="text-4xl font-bold tracking-tight">
                                {user.balance?.toLocaleString("es-AR",{ style: "currency", currency: "ARS" })}
                            </span>
                        </div>
                        <FontAwesomeIcon icon={faWallet} className="text-3xl text-blue-300/50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
                        <div>
                            <div className="flex items-center gap-2 text-blue-200 text-xs uppercase tracking-wider mb-1">
                                <FontAwesomeIcon icon={faHashtag} /> Número
                            </div>
                            <p className="font-mono text-lg">{user.number}</p>
                        </div>
                        <div>
                             <div className="flex items-center gap-2 text-blue-200 text-xs uppercase tracking-wider mb-1">
                                <FontAwesomeIcon icon={faCalendarAlt} /> Fecha de Creación
                            </div>
                            <p className="font-medium">{user.creationDate}</p>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Transactions Section */}
            <div className="flex flex-col gap-4">
                <h2 className='text-xl font-bold text-text-main px-2'>Historial de Movimientos</h2>
                {user.transactions?.length > 0 ? (
                    <Table transactions={user.transactions}/>
                ) : (
                    <div className='p-8 text-center bg-white rounded-lg shadow-sm border border-slate-200 text-text-muted'>
                        No hay movimientos registrados en esta cuenta.
                    </div>
                )}
            </div>
        </>
      )}
    </div>
  )
}

export default AccountDetail