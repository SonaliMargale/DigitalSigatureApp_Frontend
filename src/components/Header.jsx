import robottImg from '../assets/robott.jpg';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContent } from '../context/AppContext';


const Header = () => {

    const navigate = useNavigate();
    const { isLoggedin } = useContext(AppContent)

    return (
        <div className="flex flex-col items-center justify-center mt-24 px-4 text-center text-gray-800 bg-gradient-to-b min-h-screen">
            <img
                src={robottImg}
                alt="Robot"
                className="w-36 h-36 rounded-full mb-6 shadow-lg animate-bounce-slow"
            />

            <h1 className="flex items-center justify-center gap-2 text-lg sm:text-2xl font-medium mb-2 text-blue-700">
                Welcome to the Smoothest Way to Sign PDFs 💫
            </h1>

            <h2 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-4">
                Get in. Upload. Sign. Done.
            </h2>

            <p className="mb-8 max-w-md text-gray-600">
                Let’s start with a quick product tour — we’ll have you up and running in no time!
            </p>


            {isLoggedin && (
                <button
                    onClick={() => navigate("/upload")}
                    className="bg-blue-600 text-white rounded-full px-8 py-3 text-lg hover:bg-blue-700 shadow transition-all duration-300"
                >
                    Sign PDF
                </button>
            )}
        </div>

    )
}
export default Header;