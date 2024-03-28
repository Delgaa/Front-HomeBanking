import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authActions from '../redux/actions/auth.actions';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';


const SignUp = () => {
    const [newClient, setNewClient] = useState({name: '', lastName: '', email: '', password: ''});
    const [errorMessageEmail, setErrorMessageEmail] = useState(null);
    const [errorMessagePass, setErrorMessagePass] = useState(null);
    const [errorMessageName, setErrorMessageName] = useState(null);
    const [errorMessageLastName, setErrorMessageLastName] = useState(null);


    const {login} = authActions;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    localStorage.removeItem('token');

    const handleChange = (e) => {
            setNewClient({ ...newClient, [e.target.name]: e.target.value });
            setErrorMessageEmail(null);
            setErrorMessagePass(null);
            setErrorMessageName(null);
            setErrorMessageLastName(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/auth/signup', newClient)
        .then(async res => {

            const { value: accept } = await Swal.fire({
            title: "Terms and conditions",
            input: "checkbox",
            inputValue: 1,
            inputPlaceholder: `I agree with the terms and conditions`,
            confirmButtonText: `Continue&nbsp;<i class="fa fa-arrow-right"></i>`,

            inputValidator: (result) => {
                return !result && "You need to agree with T&C";
            }});
            accept && Swal.fire("Will be redirected to your account");

                const {email, password} = newClient;
                axios.post('/api/auth/login', {email, password})
                .then(res => {
                    dispatch(login(res.data))
                    navigate('/home');
                })
        }).catch( err => {
            if (err.response.data === 'Lastname has no content') {
                setErrorMessageLastName(err.response.data);
            }

            if(err.response.data === 'Name has no content'){
                setErrorMessageName(err.response.data);
            }

            if( err.response.data === 'Password has no content' || err.response.data === 'Enter a password longer than 8 digits') {
                setErrorMessagePass(err.response.data);
            }

            if (err.response.data === 'Email is already registered' || err.response.data === 'Email has no content') {
            setErrorMessageEmail(err.response.data);
            }
        })
    }

    return (
        <main className='w-full min-h-screen flex flex-1 items-center justify-center'>
                <div className='flex flex-col gap-2 items-center justify-center w-[300px] md:w-1/2 xl:w-[600px] p-5 bg-slate-600 rounded-2xl'>
                <h2 className=' pt-6 pl-4 text-2xl text-center md:pt-2 italic text-[#93b3e2]'>Mind<span className='italic'>Bank</span></h2>
                    <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                        <label className='flex flex-col gap-1'>
                            First name:
                            <input
                                className=' bg-gray-50 border md:w-[300px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                type="text"
                                name="name"
                                onChange={handleChange}
                            />
                        </label>
                            {
                                errorMessageName ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageName}</p> : <div className=' h-5'></div>
                            }
                        <label className='flex flex-col gap-1'>
                            Last name:
                            <input
                                className='bg-gray-50 border md:w-[300px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                type="text"
                                name="lastName"
                                onChange={handleChange}
                            />
                        </label>
                            {
                                errorMessageLastName ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageLastName}</p> : <div className=' h-5'></div>
                            }
                        <label className='flex flex-col gap-1' >
                            Email:
                            <input
                                className='bg-gray-50 border md:w-[300px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                type="email" 
                                name='email' 
                                onChange={handleChange} 
                            />
                        </label>
                            {
                            errorMessageEmail ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessageEmail}</p> : <div className=' h-5'></div>
                            }
                        <label className='flex flex-col gap-1'>
                            Password:
                            <input
                                className='bg-gray-50 border md:w-[300px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                type="password"
                                name="password"
                                onChange={handleChange}
                            />
                        </label>
                            {
                            errorMessagePass ? <p className='text-red-400 font-medium text-sm text-start w-full'>{errorMessagePass}</p> : <div className=' h-5'></div>
                            }
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type="submit">SingUp</button>
                    </form>
                    <p className='italic'>Already have an account? <Link to="/login" className='text-[#93b3e2]'>SingIn</Link></p>
                    
                </div>
        </main>
    );
}
export default SignUp;