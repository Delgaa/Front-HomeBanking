import React, { useEffect, useState } from 'react'
import Client from '../components/Client'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import authActions from '../redux/actions/auth.actions';

function Home() {

  const [loading, setLoading] = useState(false)
  const user = useSelector(store => store.authReducer.user)

const dispatch = useDispatch();
const {current} = authActions;

  useEffect(() =>{
    setLoading(true)
    const token = localStorage.getItem('token')
    const loggedIn = localStorage.getItem('loggedIn')

    if(loggedIn && token){
      axios.get('/api/clients/current', {
        headers: {
          'Authorization': `Bearer ${token}`
        }})
      .then(res => {dispatch(current(res.data))})
      .finally(() => setLoading(false))
    }
  },[])

  return (
    <div className='flex flex-col flex-1 w-full gap-8'>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-soft">
         <div>
            <h1 className='text-3xl font-bold text-primary-dark'>
              Hola, {loading ? '...' : user.firstName}
            </h1>
            <p className="text-text-muted mt-1">Bienvenido a tu banca online</p>
         </div>
         <div className="hidden md:block">
            <span className="text-sm font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
               Estado: Activo
            </span>
         </div>
      </div>

      {loading && (
        <div className="flex justify-center p-10">
           <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary" />
        </div>
      )}

      {/* Accounts Section */}
      {!loading && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-text-main">Tus Cuentas</h2>
             {user.accounts?.length < 3 && (
                <Link to={`/newAccount/${user.id}`}>
                  <button className='py-2 px-4 inline-flex items-center gap-2 text-sm font-semibold rounded-lg bg-primary hover:bg-primary-dark text-white transition-all shadow-md active:scale-95'>
                    <FontAwesomeIcon icon={faPlus} /> Nueva cuenta
                  </button>
                </Link>
             )}
          </div>
          
          {user.accounts?.length > 0 ? (
             <Client accounts={user.accounts}/> 
          ) : (
             <div className="bg-white p-8 rounded-xl shadow-soft text-center text-text-muted">
                No tienes cuentas asociadas. ¡Crea una para comenzar!
             </div>
          )}

          {user.accounts?.length === 3 && (
            <p className="text-sm text-text-muted text-center mt-2">
              Has alcanzado el límite de 3 cuentas.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Home