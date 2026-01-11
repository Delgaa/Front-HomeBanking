import React from 'react'

function CardsType({number, expiry, cvc, name, color, type}) {
  
  // Map color to background logic
  const bgClass = {
    'TITANIUM': 'bg-[url("/titanium.jpg")] text-gray-300',
    'SILVER': 'bg-[url("/silver.jpg")] text-gray-800',
    'GOLD': 'bg-[url("/gold.jpg")] text-gray-800'
  }[color] || 'bg-slate-700 text-white'; // Fallback

  const textClass = color === 'TITANIUM' ? 'text-gray-300' : 'text-gray-800';
  const labelClass = color === 'TITANIUM' ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`
        relative shadow-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1
        w-80 h-48 p-5 rounded-2xl bg-cover bg-center flex flex-col justify-between
        ${bgClass}
    `}>
      {/* Top Row: Logo & Chip */}
      <div className='flex justify-between items-center'>
        <img src='/pincard.svg' alt="chip" className='w-10 opacity-90'/>
        <img 
            src={type.includes('CREDIT') ? "/visa.svg" : "/mastercard.svg"} 
            alt={type} 
            className='h-10 w-auto' 
        />
      </div>

      {/* Middle: Number */}
      <div className="mt-2">
        <h2 className={`text-xl font-mono tracking-widest drop-shadow-sm ${textClass}`}>
            {number}
        </h2>
      </div>

      {/* Bottom: Details */}
      <div className='flex justify-between items-end'>
        <div>
           <p className={`text-[10px] uppercase tracking-wider ${labelClass}`}>Titular</p>
           <p className={`text-sm font-medium uppercase truncate max-w-[140px] ${textClass}`}>{name}</p>
        </div>
        
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
                <span className={`text-[9px] uppercase ${labelClass}`}>CVV</span>
                <span className={`text-xs font-mono ${textClass}`}>{cvc}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <span className={`text-[9px] uppercase ${labelClass}`}>Expira</span>
                <span className={`text-sm font-mono ${textClass}`}>{expiry}</span>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CardsType