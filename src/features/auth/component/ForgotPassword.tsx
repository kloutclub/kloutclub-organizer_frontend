import React from 'react';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { login } from '../authSlice';
import signinBanner from '../../../assets/images/signinbanner.webp';
import { Navigate, useNavigate } from 'react-router-dom';
import typingEffect from '../../../utils/typingEffect';
import HeadingH2 from '../../../component/HeadingH2';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

type LoginFormInputs = {
    email: string;
    password: string;
};

const ForgotPassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { token, loading, error } = useSelector((state: RootState) => state.auth);
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const textToType = "Step into the Future of Event Management with Klout Club – Your Event, Your Way!";
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    const displayedText = typingEffect(textToType, typingSpeed, deletingSpeed, pauseDuration);

    const onSubmit = async (data: LoginFormInputs) => {
        // Dispatch the login action and prevent default form submission behavior
        await dispatch(login(data));

        try {
            await axios.post(`${apiBaseUrl}/api/forgot-password`, {
                email: data.email,
            },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    if (res.data.status === "200") {
                        Swal.fire({
                            title: "Password Reset Link Sent",
                            text: "Your password reset link has been sent successfully.",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(res => {
                            console.log(res);
                            navigate("/login");
                        })
                    }

                    else {
                        Swal.fire({
                            title: "Error!",
                            text: res.data.message || "An error occurred.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                })
        } catch (error) {

        }
    };

    if (token) {
        return <Navigate to="/" />;
    }

    // if (loading) {
    //     return <Loader />;
    // }

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
                    <div className='flex flex-col gap-10 mb-5 text-sm justify-center'>
                        <HeadingH2 title='Forgot Your Password ?' />
                        <p>We get it, stuff happens. Just enter your email address below and we'll send you a link to reset your password!</p>
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

                        {/* Error Message */}
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-klt_primary-900 text-white py-2 rounded-md"
                                disabled={loading}  // Disable the button when loading
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>

                        <hr className='!my-5 border border-zinc-200' />

                        <p>Already have an account ? <Link to={"/login"} className='text-klt_primary-900'>Login</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
