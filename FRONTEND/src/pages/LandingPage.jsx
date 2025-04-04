import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className='h-screen w-full flex flex-col bg-gradient-to-b from-blue-600 to-blue-300 text-white relative overflow-hidden'>

            <div className="flex flex-1 flex-col items-center justify-center text-center px-6 relative z-10">
                <h1 className='text-6xl font-extrabold mb-6 drop-shadow-xl  bg-gradient-to-r from-blue-200 h-fit to-blue-300 text-transparent bg-clip-text'>
                    Task Manager
                </h1>
                <p className='text-lg mb-8 max-w-lg text-white/90'>
                    A powerful and intuitive task manager to boost your productivity and keep you on track.
                </p>
                
                <Link to="/login" className='flex items-center gap-4 px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 transition-all text-lg font-semibold shadow-md hover:scale-105'>
                    Get Started <FaArrowRight />
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;