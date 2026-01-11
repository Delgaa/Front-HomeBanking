import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COLORS, TYPES } from '../utils/typesCard'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCreditCard, faCheck } from '@fortawesome/free-solid-svg-icons'

function AddCard() {
  const [newCard, setNewCard] = useState({type: '', color: ''})
  const [errors, setErrors] = useState({})
  const navigate = useNavigate();

  function handLeChange (name, value){
    setNewCard({...newCard, [name]: value})
    setErrors({...errors, [name]: null})
  }

  function handLeSubmit (e){
    e.preventDefault()
    const token = localStorage.getItem('token')

    if(token){
      axios.post('/api/clients/current/cards/', newCard,{
        headers:{ Authorization: `Bearer ${token}` }
      })
      .then(res => {
        Swal.fire({
            icon: 'success',
            title: '¡Tarjeta Solicitada!',
            text: 'Tu nueva tarjeta ha sido creada exitosamente.',
            timer: 2000,
            showConfirmButton: false
        }).then(() => navigate('/cards'));
      })
      .catch(err => {
        const msg = err.response.data;
        if (msg === "Type no content") setErrors(prev => ({...prev, type: "Debes seleccionar un tipo"}));
        else if (msg === "Color no content") setErrors(prev => ({...prev, color: "Debes seleccionar una membresía"}));
        else {
             Swal.fire({
                icon: 'error',
                title: 'No pudimos procesar tu solicitud',
                text: msg
            })
        }
    })
  }
}

  return (
    <div className='flex flex-col flex-1 w-full gap-8 max-w-4xl mx-auto'>
       <div className="flex items-center gap-4">
            <Link to="/cards" className="p-2 rounded-full hover:bg-slate-200 transition-colors text-text-muted hover:text-primary">
                <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <h1 className='text-2xl font-bold text-text-main'>Solicitar Nueva Tarjeta</h1>
        </div>

        <div className='bg-white rounded-2xl shadow-card p-8'>
            <form onSubmit={handLeSubmit} className='flex flex-col gap-8'>
                <section>
                    <h3 className="text-lg font-semibold text-text-main mb-4">1. Tipo de Tarjeta</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {TYPES.map(type => (
                            <div 
                                key={type}
                                onClick={() => handLeChange('type', type.toUpperCase())}
                                className={`
                                    cursor-pointer p-6 rounded-xl border-2 transition-all flex items-center justify-between group
                                    ${newCard.type === type.toUpperCase() 
                                        ? 'border-primary bg-blue-50/50 ring-1 ring-primary' 
                                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                    }
                                `}
                            >
                                <span className="font-medium text-lg capitalize">{type}</span>
                                {newCard.type === type.toUpperCase() && <FontAwesomeIcon icon={faCheck} className="text-primary" />}
                            </div>
                        ))}
                    </div>
                    {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type}</p>}
                </section>

                <section>
                    <h3 className="text-lg font-semibold text-text-main mb-4">2. Membresía</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {COLORS.map(color => (
                             <div 
                                key={color}
                                onClick={() => handLeChange('color', color.toUpperCase())}
                                className={`
                                    cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden
                                    ${newCard.color === color.toUpperCase() 
                                        ? 'border-primary ring-1 ring-primary transform scale-[1.02]' 
                                        : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                                    }
                                `}
                            >
                                <div className={`w-full h-12 rounded-lg bg-cover bg-center shadow-sm`} style={{ backgroundImage: `url('/${color.toLowerCase()}.jpg')` }}></div>
                                
                                <span className="font-medium text-sm capitalize">{color}</span>
                                {newCard.color === color.toUpperCase() && (
                                    <div className="absolute top-2 right-2 bg-primary text-white text-xs rounded-full p-1 w-5 h-5 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                     {errors.color && <p className="text-red-500 text-sm mt-2">{errors.color}</p>}
                </section>

                <div className='flex gap-4 pt-4 border-t border-slate-100'>
                    <button 
                        type="submit" 
                        className='bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={!newCard.type || !newCard.color}
                    >
                        Solicitar Tarjeta
                    </button>
                    <Link to ="/cards" className='px-6 py-3 rounded-lg border border-slate-300 text-text-muted hover:bg-slate-50 font-semibold transition-all flex items-center'>
                        Cancelar
                    </Link>
                </div>

            </form>
        </div>
    </div>
  )
}

export default AddCard