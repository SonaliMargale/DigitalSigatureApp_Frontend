import { useNavigate } from 'react-router-dom';
import ilovepdfLogo from '../assets/ilovepdf.svg';

const Navbar = () => {

    const navigate = useNavigate()

    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={ilovepdfLogo} alt="" className='w-28 sm:w-32' />
            <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-blue-400 transition'>Login</button>
        </div>
    )
}
export default Navbar;