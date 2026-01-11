import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import authActions from '../redux/actions/auth.actions';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import FormInput from '../components/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons';

const SignIn = () => {
    const [userData, setUserData] = useState({email: '', password: ''});
    const [errorMessageEmail, setErrorMessageEmail] = useState(null);
    const [errorMessagePass, setErrorMessagePass] = useState(null);
    const dispatch = useDispatch();
    const {login} = authActions;
    const navigate = useNavigate();
    localStorage.removeItem('token');

    const handLeSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/auth/login', userData)
        .then(res => {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            Toast.fire({
                icon: "success",
                title: "Signed in successfully"
            });
            dispatch(login(res.data))
            navigate('/home')
        }).catch(err => {
            if (err.response?.data === 'Email not registered' || err.response?.data === 'Email has no content') {
                setErrorMessageEmail(err.response.data);
            }
            if (err.response?.data === 'Password incorrect' || err.response?.data === 'Password has no content') {
                setErrorMessagePass(err.response.data);
            }
        })
    }

    const handleDataChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        setErrorMessageEmail(null);
        setErrorMessagePass(null);
    }

    return (
        <main className='w-full min-h-screen flex items-center justify-center bg-surface-muted p-4'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-card p-8 flex flex-col items-center gap-6'>
                
                <div className="flex flex-col items-center gap-2">
                    <FontAwesomeIcon icon={faBuildingColumns} className="text-4xl text-secondary" />
                    <h2 className='text-3xl font-bold text-primary-dark'>Mind<span className='font-light italic text-secondary'>Bank</span></h2>
                    <p className="text-text-muted text-sm">Bienvenido de nuevo</p>
                </div>

                <form onSubmit={handLeSubmit} className='w-full flex flex-col gap-4'>
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        onChange={handleDataChange}
                        error={errorMessageEmail}
                        placeholder="ejemplo@correo.com"
                    />
                    
                    <FormInput
                        label="Contraseña"
                        type="password"
                        name="password"
                        onChange={handleDataChange}
                        error={errorMessagePass}
                        placeholder="••••••••"
                    />

                    <button 
                        className='mt-2 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md active:scale-[0.98]' 
                        type="submit"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <p className='text-sm text-text-muted'>
                    ¿No tienes una cuenta? <Link to="/signup" className='text-secondary hover:text-secondary-dark font-medium hover:underline'>Regístrate</Link>
                </p>
            </div>
        </main>
    );
};

export default SignIn;