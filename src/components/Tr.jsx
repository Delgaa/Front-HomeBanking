import React from 'react'

function Tr({type, detail, date, amount}) {
    const isCredit = type === "CREDIT";
    return (
        <tr className='bg-white hover:bg-slate-50 transition-colors duration-150'>
            <td className='px-6 py-4'>
                <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${isCredit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                    {type}
                </span>
            </td>
            <td className={`px-6 py-4 font-mono font-medium text-right ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                {isCredit ? '+' : '-'}{Math.abs(amount).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
            </td>
            <td className='px-6 py-4 text-text-muted'>{date}</td>
            <td className='px-6 py-4 text-text-main font-medium'>{detail}</td>
        </tr>
    )
}

export default Tr