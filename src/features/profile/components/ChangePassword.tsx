import React, { useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { heading } from '../../heading/headingSlice';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

type ChangePasswordForm = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const ChangePassword: React.FC = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { loading, token } = useSelector((state: RootState) => state.auth);
    const { register, handleSubmit, formState: { errors }, watch } = useForm<ChangePasswordForm>({
        mode: 'onBlur',  // Validate on blur to give immediate feedback
    });
    const [showOldPassword, setShowOldPassword] = useState(false); // State for old password visibility
    const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

    const onSubmit = async (data: ChangePasswordForm) => {
        const formData = new FormData();
        formData.append("old_password", data.oldPassword);
        formData.append("password", data.newPassword);
        formData.append("confirm_password", data.confirmPassword);

        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showDenyButton: true,
            text: "Do you want to change password?",
            confirmButtonText: "Yes, change it!",
        });

        if (result.isConfirmed) {
            try {
                // Attempt to change the password
                const res = await axios.post(`${apiBaseUrl}/api/changepassword`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log(res.data.status);
                if (res.data.status === 200) {
                    // Show success message
                    const successResult = await Swal.fire({
                        title: "Password Changed!",
                        text: "Your password has been changed successfully.",
                        icon: "success",
                        confirmButtonText: "OK",
                    });

                    if (successResult.isConfirmed) {
                        await dispatch(heading("Dashboard"));
                        navigate("/");  // Redirect to home page
                    }
                }
                if (res.data.status === 422) {
                    console.log(res.data);
                    Swal.fire({
                        title: "Error!",
                        text: res.data.error.password[0] || "An error occurred.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
                if(res.data.status === 401) {
                    Swal.fire({
                        title: "Error!",
                        text: res.data.message || "Something went wrong. Please try again",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } catch (error: any) {
                // Handle error response
                console.log(error);
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred. Please try again!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    return (
        <div>
            <div className='flex justify-between items-center'>
                <HeadingH2 title={'Change Password'} />
                <Link to="/" onClick={() => dispatch(heading("Dashboard"))} className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>

            <div className='bg-white p-10 max-w-xl mx-auto mt-10 rounded-lg'>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Old Password Field with Eye Icon */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Old Password</label>
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            {...register('oldPassword', { required: 'Old password is required' })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                        />
                        {/* Eye Icon for Old Password */}
                        <span
                            className="absolute inset-y-0 right-3 flex items-center top-6 cursor-pointer"
                            onClick={() => setShowOldPassword(!showOldPassword)} // Toggle visibility
                        >
                            {showOldPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                        </span>
                        {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>}
                    </div>

                    {/* New Password Field with Eye Icon */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            {...register('newPassword', { required: 'New password is required' })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                        />
                        {/* Eye Icon for New Password */}
                        <span
                            className="absolute inset-y-0 right-3 flex items-center top-6 cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)} // Toggle visibility
                        >
                            {showNewPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                        </span>
                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                    </div>

                    {/* Confirm Password Field with Eye Icon */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword', {
                                required: 'Please confirm your new password',
                                validate: (value) =>
                                    value === watch('newPassword') || 'Passwords do not match', // Custom validation for matching passwords
                            })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
                        />
                        {/* Eye Icon for Confirm Password */}
                        <span
                            className="absolute inset-y-0 right-3 flex items-center top-6 cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                        >
                            {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                        </span>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-klt_primary-900 text-white py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>

                    <hr className='!my-10 border border-zinc-200' />
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
