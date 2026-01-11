import React from 'react'
import Tr from './Tr'

function Table({transactions}) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-soft border border-slate-200">
      <table className='w-full text-sm text-left text-text-main'>
        <thead className='text-xs text-text-muted uppercase bg-surface-muted border-b border-slate-200'>
          <tr>
            <th className='px-6 py-4 font-semibold tracking-wider'>Tipo</th>
            <th className='px-6 py-4 font-semibold tracking-wider text-right'>Monto</th>
            <th className='px-6 py-4 font-semibold tracking-wider'>Fecha</th>
            <th className='px-6 py-4 font-semibold tracking-wider'>Descripción</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-100 bg-white'>
          {
            transactions?.map(transaction => (
              <Tr 
                key={transaction.id} 
                type={transaction.type} 
                amount={transaction.amount} 
                detail={transaction.description} 
                date={new Date(transaction.date).toLocaleDateString() + ' - ' + new Date(transaction.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              />
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Table