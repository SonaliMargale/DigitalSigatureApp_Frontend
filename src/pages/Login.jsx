import { useContext, useState } from "react"
import ilovepdfLogo from '../assets/ilovepdf.svg';
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from 'react-toastify';

 const backendUrl = import.meta.env.VITE_BACKEND_URL;

 console.log(backendUrl,"backendurl")

const Login = () => {

    const navigate = useNavigate()

    const { setIsLoggedin } = useContext(AppContent)
    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')


    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const url = state === 'Sign Up' ? `${backendUrl}/api/auth/register` : `${backendUrl}/api/auth/login`;
            const payload = state === 'Sign Up' ? { name, email, password } : { email, password };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            })

            const data = await response.json();
            if (response.ok && data.success) {
                setIsLoggedin(true)
                // getUserData()
                navigate('/');
            } else {
                toast.error(data.message || 'Something went wrong')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue to-purple-400">
            <img onClick={() => navigate('/')} src={ilovepdfLogo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" />
            <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">

                <h2 className="text-3xl font-semibold text-white text-center mb-3">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                <p className="text-center text-sm mb-6">{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (<div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <input onChange={e => setName(e.target.value)} value={name} className="bg-transparent outline-none" type="text" autoComplete="name" placeholder="Full Name" required />
                    </div>)}


                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <input onChange={e => setEmail(e.target.value)}
                            value={email}
                            className="bg-transparent outline-none"
                            type="email"
                            autoComplete="email"
                            placeholder="Email id"
                            required />
                    </div>

                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <input onChange={e => setPassword(e.target.value)}
                            value={password}
                            className="bg-transparent outline-none"
                            type="password"
                            autoComplete={state === 'Sign Up' ? 'new-password' : 'current-password'}
                            placeholder="password"
                            required />
                    </div>

                    <p onClick={() => navigate('/reset-password')} className="mb-4 text-indigo-500 cursor-pointer">Forgot password?</p>

                    <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to bg-indigo-900 text white font-medium">{state}</button>
                </form>

                {state === 'Sign Up' ? (<p className="text-gray-400 text-center text-xs mt-4">Already have an account ? {''}
                    <span onClick={() => setState('Login')} className="text-blue-400">Login here</span></p>
                ) : (<p className="text-gray-400 text-center text-xs mt-4">Dont have an account ?
                    {''}<span onClick={() => setState('Sign Up')} className="text-blue-400">Sign Up here</span></p>)}


            </div>
        </div>
    )
}
export default Login