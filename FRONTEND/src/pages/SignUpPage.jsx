import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';

const SignUpPage = () => {
    
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    

    const togglePassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    const {register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset, watch } = useForm();

    const navigate = useNavigate();

    const {backendURL, setUser, setUserID, setUserAvatar, setIsAuthenticated} = useAuthStore();

    const onSubmit = async (data) => {
        
        try{

            const response = await fetch(`${backendURL}/auth/signup`, {

                method:"POST",
                headers:  {"Content-Type": "application/json"},
                body: JSON.stringify(data),
                credentials:"include"
            })

            const responseData = await response.json();
            // console.log(responseData); 

            if(!response.ok){

                setErrorMessage(responseData.message);
                throw new Error(responseData.message || "SignUp failed. Please try again.");
            
            }
            
            await new Promise((resolve) => setTimeout(resolve, 2500));

            setUser(responseData.user);
            setUserID(responseData.userID);
            setUserAvatar(responseData.userAvatar);
            setIsAuthenticated(true);
            navigate("/dashboard")
        } 
        
        catch(error){

            console.log('Sign Up Failed:', error);
        }

        
    };

    return (
        <>
            <div className="h-screen w-full flex flex-col bg-gray-100">
                
                {/* <Navbar title="SignUp" navbar={false} /> */}
                
                <div className="flex items-center justify-center flex-grow bg-gradient-to-b from-blue-600 to-blue-300">
                <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-8 w-1/4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Sign Up</h2>

                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                        </label>
                        <input
                        type="text"
                        id="username"
                        name="username"
                        {...register('username', {
                            required: 'Username is required',
                            minLength: {
                            value: 3,
                            message: 'Username must be at least 3 characters',
                            },
                        })}
                        className="mt-1 block w-full h-12 px-3 border-gray-300 border-2 rounded-md shadow-sm"
                        placeholder="Enter your username"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                        </label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Invalid email format',
                            },
                        })}
                        className="mt-1 block w-full h-12 px-3 border-gray-300 border-2 rounded-md shadow-sm"
                        placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                        </label>
                        <div className="flex items-center flex-row justify-between w-full h-12 px-3 border-gray-300 border-2 rounded-md shadow-sm">
                        <input
                            type={isShowPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters long',
                            },
                            pattern: {
                                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                                message: 'Password must include letters and numbers',
                            },
                            })}
                            className="outline-none w-full"
                            placeholder="Enter your password"
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
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-md text-white ${
                        isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        }`}
                    >
                        {isSubmitting ? 'Signing up...' : 'Sign Up'}
                    </button>

                    {/* Login Link */}
                    <div className="login-toggle flex items-center justify-center gap-2 flex-row">
                        <span>Already have an account?</span>
                        <Link to="/login" className="text-blue-600 font-semibold underline">
                        Login
                        </Link>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;
