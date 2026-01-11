import React from 'react'
import Anchor from './Anchor'
import { LINKS_NAV } from '../utils/links'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faXmark, faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from 'react-redux'
import authActions from '../redux/actions/auth.actions'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

function Header({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const dispatch = useDispatch()
    const { logout } = authActions
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: "¿Cerrar sesión?",
            text: "¿Estás seguro de que quieres salir?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1e40af",
            cancelButtonColor: "#64748b", 
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(logout());
                navigate('/login');
            }
        });
    }

    return (
        <>
            <div className="md:hidden flex items-center justify-between p-4 bg-primary-dark text-white shadow-md z-30 relative">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <img src="/logo.png" alt="MindBank Logo" className="w-8 h-8 object-contain" />
                    <span>Mind<span className="font-light italic text-secondary">Bank</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl focus:outline-none">
                    <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} />
                </button>
            </div>

            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-primary-dark text-white transition-transform duration-300 ease-in-out shadow-2xl
                md:translate-x-0 md:sticky md:top-0 md:h-screen md:shadow-none flex flex-col
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="hidden md:flex items-center gap-3 p-8 border-b border-primary/20">
                    <img src="/logo.png" alt="MindBank Logo" className="w-10 h-10 object-contain" />
                    <h2 className='text-2xl font-bold tracking-wide'>
                        Mind<span className='font-light italic text-secondary'>Bank</span>
                    </h2>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {LINKS_NAV.map((link) => (
                        <Anchor 
                            key={link.name} 
                            href={link.href} 
                            icon={link.icon} 
                            content={link.name} 
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-primary/20 bg-primary-dark/50">
                    <button 
                        onClick={handleLogout} 
                        className='flex items-center gap-3 w-full px-4 py-3 text-text-light hover:bg-white/10 rounded-lg transition-all duration-200 group'
                    >
                        <FontAwesomeIcon className='text-xl text-secondary group-hover:text-white transition-colors' icon={faRightFromBracket} />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Header