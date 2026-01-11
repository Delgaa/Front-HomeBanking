import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFileContract, faCheck, faShieldAlt } from '@fortawesome/free-solid-svg-icons'

function AddAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handLeSubmit (e){
    e.preventDefault()
    const token = localStorage.getItem("token")
    const loggedIn = localStorage.getItem("loggedIn")

    if(loggedIn && token){
      setLoading(true);
      axios.post('/api/clients/current/accounts/', {}, {
          headers:{ Authorization: `Bearer ${token}` }
        })
        .then(async res => {
           // Success Alert
           Swal.fire({
             icon: 'success',
             title: '¡Cuenta Creada!',
             text: 'Tu nueva cuenta ha sido generada exitosamente.',
             confirmButtonColor: '#1e40af',
             timer: 2000,
           }).then(() => navigate('/home'));
        })
        .catch(err => {
          const msg = err.response?.data;
          if (msg === 'The maximum of three accounts has already been reached.'){
            Swal.fire({
              icon: 'warning',
              title: 'Límite alcanzado',
              text: 'Ya tienes el máximo de 3 cuentas permitidas.',
              confirmButtonColor: '#1e40af'
            })
          } else {
             Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No pudimos crear la cuenta. Inténtalo más tarde.',
            })
          }
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className='flex flex-col flex-1 w-full gap-8 max-w-4xl mx-auto'>
      {/* Header */}
       <div className="flex items-center gap-4">
            <Link to="/home" className="p-2 rounded-full hover:bg-slate-200 transition-colors text-text-muted hover:text-primary">
                <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <h1 className='text-2xl font-bold text-text-main'>Solicitar Nueva Cuenta</h1>
        </div>

      <div className='bg-white rounded-2xl shadow-card flex flex-col md:flex-row overflow-hidden'>
        
        {/* Visual Side (Desktop) */}
        <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-primary-dark to-primary p-8 flex-col justify-between text-white relative overflow-hidden">
            <div className="relative z-10">
               <FontAwesomeIcon icon={faShieldAlt} className="text-4xl mb-4 text-blue-300" />
               <h3 className="text-xl font-bold mb-2">Seguridad Garantizada</h3>
               <p className="text-blue-100 text-sm">Tus nuevas cuentas están protegidas con los más altos estándares de seguridad bancaria.</p>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-2/3 p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3 text-primary border-b border-slate-100 pb-4">
                <FontAwesomeIcon icon={faFileContract} className="text-2xl" />
                <h2 className="text-xl font-bold text-text-main">Términos del Servicio</h2>
            </div>

            <div className="h-64 overflow-y-auto pr-2 text-sm text-text-muted space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                <p>
                    <strong className="text-text-main block mb-1">1. Aceptación de Términos</strong>
                    Al solicitar esta cuenta, aceptas cumplir con nuestras políticas de uso, regulaciones bancarias vigentes y normativas contra el lavado de dinero.
                </p>
                <p>
                    <strong className="text-text-main block mb-1">2. Uso de la Cuenta</strong>
                    La cuenta debe ser utilizada para fines lícitos. MindBank se reserva el derecho de congelar o cerrar cuentas con actividad sospechosa.
                </p>
                <p>
                    <strong className="text-text-main block mb-1">3. Privacidad de Datos</strong>
                    Tus datos personales serán tratados con confidencialidad según nuestra Política de Privacidad y no serán compartidos con terceros sin tu consentimiento, salvo requerimiento legal.
                </p>
                <p>
                    <strong className="text-text-main block mb-1">4. Comisiones y Cargos</strong>
                    Esta cuenta puede estar sujeta a cargos de mantenimiento si no se cumple con el saldo promedio mínimo establecido en el tarifario vigente.
                </p>
            </div>

            <form onSubmit={handLeSubmit} className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3 mb-6">
                    <input type="checkbox" required id="terms" className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
                    <label htmlFor="terms" className="text-sm text-text-muted cursor-pointer select-none">
                        He leído, comprendo y acepto los <span className="text-primary font-medium">Términos y Condiciones</span> detallados anteriormente.
                    </label>
                </div>

                <div className='flex gap-4'>
                    <button 
                        type='submit' 
                        disabled={loading}
                        className='bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2'
                    >
                        {loading ? 'Procesando...' : <><FontAwesomeIcon icon={faCheck} /> Confirmar y Crear</>}
                    </button>
                    <Link to ="/home" className='px-6 py-3 rounded-lg border border-slate-300 text-text-muted hover:bg-slate-50 font-semibold transition-all flex items-center'>
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default AddAccount