import React from 'react'
import Account from './Account'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function Client({accounts}) {
  return (
    <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
      {accounts?.map(account => (
        <Link key={account.id} to={`/account/${account.id}`} className="group">
          <Account>
            <div className='
              h-full relative overflow-hidden rounded-2xl p-6 transition-all duration-300
              bg-gradient-to-br from-primary-dark to-primary
              text-white shadow-card hover:shadow-2xl hover:-translate-y-1
              group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-primary
            '>
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                   <div className="p-2 bg-white/20 rounded-lg">
                     <FontAwesomeIcon icon={faWallet} className="text-xl" />
                   </div>
                   <span className="text-xs font-mono bg-black/20 px-2 py-1 rounded">DEBIT</span>
                </div>

                <div>
                   <p className="text-sm text-blue-100 mb-1">Saldo Disponible</p>
                   <p className='text-3xl font-bold tracking-tight'>
                     {account.balance.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                   </p>
                </div>

                <div className="flex justify-between items-end border-t border-white/20 pt-4">
                  <div>
                    <p className="text-xs text-blue-200">Número de cuenta</p>
                    <p className='text-lg font-mono tracking-wider opacity-90'>{account.number}</p>
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Account>
        </Link>
      ))}
    </section>
  )
}

export default Client