import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authActions from '../redux/actions/auth.actions';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import FormInput from '../components/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
    const [newClient, setNewClient] = useState({name: '', lastName: '', email: '', password: ''});
    const [errors, setErrors] = useState({});

    const {login} = authActions;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    localStorage.removeItem('token');

    const handleChange = (e) => {
            setNewClient({ ...newClient, [e.target.name]: e.target.value });
            setErrors({ ...errors, [e.target.name]: null }); // Clear error for modified field
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/auth/signup', newClient)
        .then(async res => {

            const { value: accept } = await Swal.fire({
            title: "Términos y Condiciones",
            input: "checkbox",
            inputValue: 0,
            inputPlaceholder: `Acepto los términos y condiciones`,
            confirmButtonText: `Continuar <i class="fa fa-arrow-right"></i>`,
            confirmButtonColor: "#1e40af",
            inputValidator: (result) => {
                return !result && "Debes aceptar los términos para continuar";
            }});
            
            if (accept) {
                const {email, password} = newClient;
                axios.post('/api/auth/login', {email, password})
                .then(res => {
                    dispatch(login(res.data))
                    navigate('/home');
                })
            }
        }).catch( err => {
            // Simplified error mapping
            const msg = err.response?.data;
            const newErrors = {};
            if (msg === 'Lastname has no content') newErrors.lastName = msg;
            if (msg === 'Name has no content') newErrors.name = msg;
            if (msg === 'Password has no content' || msg?.includes('longer than')) newErrors.password = msg;
            if (msg === 'Email is already registered' || msg === 'Email has no content') newErrors.email = msg;
            setErrors(newErrors);
        })
    }

    return (
        <main className='w-full min-h-screen flex items-center justify-center bg-surface-muted p-4'>
             <div className='w-full max-w-lg bg-white rounded-2xl shadow-card p-8 flex flex-col items-center gap-6'>
                <div className="flex flex-col items-center gap-2">
                    <FontAwesomeIcon icon={faBuildingColumns} className="text-4xl text-secondary" />
                    <h2 className='text-3xl font-bold text-primary-dark'>Mind<span className='font-light italic text-secondary'>Bank</span></h2>
                    <p className="text-text-muted text-sm">Crea tu cuenta digital</p>
                </div>
                
                <form onSubmit={handleSubmit} className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormInput
                        label="Nombre"
                        name="name"
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Tu nombre"
                    />
                    <FormInput
                        label="Apellido"
                        name="lastName"
                        onChange={handleChange}
                        error={errors.lastName}
                        placeholder="Tu apellido"
                    />
                    <div className="md:col-span-2">
                        <FormInput
                            label="Email"
                            type="email"
                            name="email"
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="ejemplo@correo.com"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FormInput
                            label="Contraseña"
                            type="password"
                            name="password"
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="••••••••"
                        />
                    </div>

                    <button className='md:col-span-2 mt-4 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md active:scale-[0.98]' type="submit">
                        Registrarse
                    </button>
                </form>
                <p className='text-sm text-text-muted'>
                    ¿Ya tienes cuenta? <Link to="/login" className='text-secondary hover:text-secondary-dark font-medium hover:underline'>Inicia Sesión</Link>
                </p>
            </div>
        </main>
    );
}
export default SignUp;