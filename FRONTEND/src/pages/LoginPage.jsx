import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';

const LoginPage = () => {
    
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const togglePassword = () => {
    setIsShowPassword(!isShowPassword);
    };

    const {register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const {backendURL, setIsAuthenticated, setUser, setUserID, setUserAvatar} = useAuthStore();
    // console.log(backendURL)

    const onSubmit = async (data) => {
       
        try{
        
            const response = await fetch(`${backendURL}/auth/login`, {

                method:"POST", 
                headers:  {"Content-Type": "application/json"},
                body: JSON.stringify(data),
                credentials:"include"

            })

            const responseData = await response.json();

            if(!response.ok){

                setErrorMessage(responseData.message);
                throw new Error(responseData.message || "Login failed. Please try again.");
            }

            console.log(responseData);
            setIsAuthenticated(true);
            setUser(responseData.user);
            setUserID(responseData.userID);
            setUserAvatar(responseData.userAvatar);
            navigate("/dashboard")
            } 
        
        catch(error){
            
            console.log('Logging in Failed', error);
        }

    };

    

    return(

        <>
        <div className="h-screen w-full flex flex-col bg-gray-100">
            

            <div className="flex items-center justify-center flex-grow bg-gradient-to-b from-blue-600 to-blue-300">
            <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-8 w-1/4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
                <h2 className="text-2xl font-bold text-gray-800 text-center ">Login</h2>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                    </label>
                    <input
                    type="email"
                    id="email"
                    {...register('email', {
                        required: { value: true, message: 'Email is required' },
                        pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Invalid email format',
                        },
                    })}
                    className="mt-1 block w-full h-10 rounded-md pl-2 border-gray-200 border-2 shadow-sm outline-none"
                    placeholder="Enter your email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                    </label>
                    <div className="flex items-center flex-row justify-between px-2 w-full h-10 rounded-md pl-2 border-gray-200 border-2 outline-none shadow-sm">
                    <input
                        type={isShowPassword ? 'text' : 'password'}
                        id="password"
                        {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters long',
                        },
                        pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                            message: 'Password must include letters and numbers',
                        },
                        })}
                        placeholder="Enter your password"
                        className="outline-none"
                        autoComplete="true"
                    />
                    <button type="button" onClick={togglePassword}>
                        {isShowPassword ? (
                        <FaEye className="text-blue-400" size={22} />
                        ) : (
                        <FaEyeSlash className="text-gray-500" size={22} />
                        )}
                    </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                
                <p className='text-red-500 text-sm'>{errorMessage}</p>
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white ${
                    isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    }`}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>

                {/* Signup Link */}
                <div className="singup-toggle flex items-center justify-center gap-2 flex-row">
                    <span>Not Registered yet? </span>
                    <Link to="/signup" className="text-blue-600 font-semibold underline">
                    Create an Account
                    </Link>
                </div>
                </form>
            </div>
            </div>
        </div>
        </>
    );
};

export default LoginPage;
