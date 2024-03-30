import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
    <main className='bg-[#395886] flex pb-5 flex-col flex-1 md:rounded-l-3xl'>
      <CardsType/>
      <img className='w-[75px] self-end pt-5 pr-5 md:absolute' src='/logo.png'  alt="logo-bank" />
      {
        user.cards?.length > 0 ? <h1 className='text-3xl text-center py-6'>Your cards:</h1> : <h1 className='text-3xl w-full text-center py-6'>You don't have cards</h1>
      }
      {loading && <h2 className='text-xl py-6 w-full text-center'>Loading...</h2>}

      <div className='flex flex-wrap justify-center gap-6'>
        {
          cardCredit?.length > 0 ? (<section className='flex flex-col gap-6'>
          <h2 className='text-xl pt-6 '>Credit:</h2>
          {
            cardCredit?.map(card=> {
                return ( <CardsType
                  key={card.id}
                  number={card.number.replaceAll("-", ' ')}
                  expiry={card.thruDate.replaceAll("-", '/').slice(2, 7)}
                  cvc={card.cvv}
                  name={card.cardHolder}
                  color={card.color}
                  type={card.type}/>)})
          }
        </section>): null
        }
        {
          cardDebit?.length > 0 ?(<section className='flex flex-col gap-6'>
          <h2 className='text-xl pt-6 '>Debit:</h2>
            {
              cardDebit?.map(card=> {
                return (
                  card.type.includes("DEBIT") ? <CardsType
                  key={card.id}
                  number={card.number.replaceAll("-", ' ')}
                  expiry={card.thruDate.replaceAll("-", '/').slice(2, 7)}
                  cvc={card.cvv}
                  name={card.cardHolder}
                  color={card.color}
                  type={card.type}/> 
                  : "")})
                }
          </section>): null
        }
        {
          user.cards?.length == 6 ? <h2 className='text-xl py-6 text-center w-full'>You have 6 cards, you can't ask for more</h2> 
          : (<div className='flex flex-col'>
          <h2 className='text-xl py-6 text-center'>Request card:</h2>
          <Link to={`/newCard/${user.id}`} className='flex items-end'><button className=' h-44 w-72 py-3 px-4 flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-900 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'><FontAwesomeIcon icon={faPlus} /> Add Card</button></Link>
        </div>)
        }
      </div>
    </main>
  )
}

export default Card