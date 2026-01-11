import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavLink } from 'react-router-dom'


function Anchor({ href, icon, content }) {
  return (
    <NavLink 
      to={href} 
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium
        ${isActive 
          ? 'bg-secondary text-white shadow-md' 
          : 'text-slate-300 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      <FontAwesomeIcon className='w-[20px] text-lg' icon={icon}/> 
      <span>{content}</span>
    </NavLink>
  )
}

export default Anchor