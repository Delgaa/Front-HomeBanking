import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <footer className='w-full py-6 mt-8 border-t border-slate-200 bg-surface text-text-muted flex flex-col md:flex-row items-center justify-between px-8 gap-4 text-sm'>
        <div>
            <p>&copy; 2026 MindBank - Todos los derechos reservados.</p>
        </div>
        <div className='flex gap-6'>
            <a href="#" className='hover:text-primary transition-colors'><FontAwesomeIcon className='text-xl' icon={faInstagram} /></a>
            <a href="#" className='hover:text-primary transition-colors'><FontAwesomeIcon className='text-xl' icon={faFacebook} /></a>
            <a href="#" className='hover:text-primary transition-colors'><FontAwesomeIcon className='text-xl' icon={faTwitter} /></a>
        </div>
    </footer>
  )
}

export default Footer