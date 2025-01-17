import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'; // Use the custom hook
import { login } from '../authSlice';
import { RootState, useAppDispatch } from '../../../redux/store'; // Your Redux store type
import { Navigate } from 'react-router-dom';
import signinBanner from '../../../assets/images/signinbanner.webp';
import typingEffect from '../../../utils/typingEffect';
import HeadingH2 from '../../../component/HeadingH2';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import Swal from 'sweetalert2';

type LoginFormInputs = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const { token, loading, loginError } = useSelector((state: RootState) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const textToType = "Step into the Future of Event Management with Klout Club - Your Event, Your Way!";
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    const displayedText = typingEffect(textToType, typingSpeed, deletingSpeed, pauseDuration);

    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [submitted, setSubmitted] = useState(false); // Track if form is submitted

    const onSubmit = async (data: LoginFormInputs) => {
        setSubmitted(true); // Mark the form as submitted
        await dispatch(login(data));
    };

    useEffect(() => {
        // Only show error modal if the form has been submitted and there's a loginError
        if (submitted && loginError) {
            Swal.fire({
                icon: "error",
                title: loginError,
                showConfirmButton: true,
                confirmButtonText: "OK",
            });
            setSubmitted(false); // Reset submitted state after error is handled
        }
    }, [loginError, submitted]); // Runs when loginError or submitted changes

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex h-screen">
            {/* Left side with image */}
            <div className="relative w-2/3 bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${signinBanner})` }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-50"></div> {/* Black overlay with reduced opacity */}

                {/* Text */}
                <h1 className="text-white text-5xl font-normal relative z-10 p-20">
                    {displayedText}
                </h1>
            </div>

            {/* Right side with form */}
            <div className="w-1/3 flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-4">
                    <div className='flex justify-center'>
                        <HeadingH2 title='Login' />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Password Field with Eye Icon */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: 'Password is required' })}
                                className="mt-1 block relative w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                            />
                            {/* Eye Icon */}
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                            >
                                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                            </span>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            <Link to={"/forgot-password"} className='text-klt_primary-900 text-sm mt-3'>Forgot Password ?</Link>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-klt_primary-900 text-white py-2 rounded-md"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>

                        <hr className='!my-5 border border-zinc-200' />

                        <span>Don't have an account ? <Link to={"/signup"} className='text-klt_primary-900'>Signup Here</Link></span>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
