import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCreditCard, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector} from 'react-redux';
import authActions from '../redux/actions/auth.actions';
import CardsType from '../components/CardsType';

function Card() {
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
        }
      }).then(res => {
        dispatch(current(res.data))
      }).finally(() => setLoading(false))
    }
  },[])

  const cardCredit = user.cards?.filter(card => card.type.includes("CREDIT"))
  const cardDebit = user.cards?.filter(card => card.type.includes("DEBIT"));

  return (
    <div className='flex flex-col flex-1 w-full gap-8'>
       {/* Header */}
       <div className="flex justify-between items-center">
         <h1 className='text-2xl font-bold text-text-main'>Mis Tarjetas</h1>
         {user.cards?.length < 6 && (
            <Link to={`/newCard/${user.id}`}>
               <button className='py-2 px-4 inline-flex items-center gap-2 text-sm font-semibold rounded-lg bg-primary hover:bg-primary-dark text-white transition-all shadow-md active:scale-95'>
                  <FontAwesomeIcon icon={faPlus} /> Solicitar Tarjeta
               </button>
            </Link>
         )}
       </div>

      {loading && (
         <div className="flex justify-center p-10">
           <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary" />
         </div>
      )}

      {!loading && user.cards?.length === 0 && (
         <div className="p-8 text-center bg-white rounded-lg shadow-sm border border-slate-200 text-text-muted">
            No tienes tarjetas asociadas.
         </div>
      )}

      <div className='flex flex-col gap-8'>
        {/* Credit Cards */}
        {cardCredit?.length > 0 && (
          <section>
             <h2 className='text-lg font-semibold text-text-muted mb-4 border-b border-slate-200 pb-2'>Tarjetas de Crédito</h2>
             <div className="flex flex-wrap gap-6 justify-center md:justify-start">
               {cardCredit.map(card => (
                  <CardsType
                    key={card.id}
                    number={card.number.replaceAll("-", ' ')}
                    expiry={card.thruDate.replaceAll("-", '/').slice(2, 7)}
                    cvc={card.cvv}
                    name={card.cardHolder}
                    color={card.color}
                    type={card.type}
                  />
               ))}
             </div>
          </section>
        )}

        {/* Debit Cards */}
        {cardDebit?.length > 0 && (
          <section>
             <h2 className='text-lg font-semibold text-text-muted mb-4 border-b border-slate-200 pb-2'>Tarjetas de Débito</h2>
             <div className="flex flex-wrap gap-6 justify-center md:justify-start">
               {cardDebit.map(card => (
                  <CardsType
                    key={card.id}
                    number={card.number.replaceAll("-", ' ')}
                    expiry={card.thruDate.replaceAll("-", '/').slice(2, 7)}
                    cvc={card.cvv}
                    name={card.cardHolder}
                    color={card.color}
                    type={card.type}
                  />
               ))}
             </div>
          </section>
        )}
      </div>

       {user.cards?.length === 6 && (
            <p className="text-sm text-text-muted text-center mt-4">
              Has alcanzado el límite máximo de tarjetas.
            </p>
       )}
    </div>
  )
}

export default Card