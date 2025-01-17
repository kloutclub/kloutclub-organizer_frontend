// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useSelector } from 'react-redux'; // Use the custom hook
// import { login } from '../authSlice';
// import { RootState, useAppDispatch } from '../../../redux/store'; // Your Redux store type
// import { Navigate } from 'react-router-dom';
// import signinBanner from '../../../assets/images/signinbanner.webp';
// import typingEffect from '../../../utils/typingEffect';
// import HeadingH2 from '../../../component/HeadingH2';
// import { Link } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
// import Swal from 'sweetalert2';
// import axios from 'axios';

// type Signup = {
//   first_name: string;
//   last_name: string;
//   mobile_number: string;
//   email: string;
//   password: string;
//   confirm_password: string;
//   company: string;
//   company_name: string;
//   designation: string;
//   designation_name: string;
//   pincode: string;
//   tnc: string;
//   notifications: string;
//   address: string;
//   mobile_otp: string;
//   email_otp: string;
//   step: string;
// };

// type ApiType = {
//   created_at: string;
//   id: number;
//   name: string;
//   parent_id: number;
//   updated_at: string;
//   uuid: string;
// }

// const Signup: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
//   const { token, loading, loginError } = useSelector((state: RootState) => state.auth);
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm<Signup>();

//   const [companies, setCompanies] = useState<ApiType[] | undefined>();
//   const [selectedCompany, setSelectedCompany] = useState<string | number>(''); // Track selected company
//   const [companyID, setCompanyID] = useState<string | number>(''); // Track selected company

//   const [designations, setDesignations] = useState<ApiType[] | undefined>();
//   const [selectedDesignation, setSelectedDesignation] = useState<string | number>(''); // Track selected company
//   const [designationID, setDesignationID] = useState<string | number>(''); // Track selected company

//   const textToType = "Step into the Future of Event Management with Klout Club - Your Event, Your Way!";
//   const typingSpeed = 100;
//   const deletingSpeed = 50;
//   const pauseDuration = 2000;

//   const displayedText = typingEffect(textToType, typingSpeed, deletingSpeed, pauseDuration);

//   const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
//   const [submitted, setSubmitted] = useState(false); // Track if form is submitted

//   useEffect(() => {
//     axios.get(`${apiBaseUrl}/api/companies`).then(res => setCompanies(res.data.data));
//     axios.get(`${apiBaseUrl}/api/job-titles`).then(res => setDesignations(res.data.data));
//     console.log(companies, designations);
//   }, []);

//   const findCompanyID = () => {
//     if (companies) {
//       const company = companies.find(company => company.name == selectedCompany)
//       if (company)
//         setCompanyID(company.id);
//     }
//   }

//   const findDesignationID = () => {
//     if (designations) {
//       const designation = designations.find(designation => designation.name === selectedDesignation)
//       if (designation)
//         setDesignationID(designation.id);
//     }
//   }


//   useEffect(() => {
//     // Only show error modal if the form has been submitted and there's a loginError
//     if (submitted && loginError) {
//       Swal.fire({
//         icon: "error",
//         title: loginError,
//         showConfirmButton: true,
//         confirmButtonText: "OK",
//       });
//       setSubmitted(false); // Reset submitted state after error is handled
//     }
//   }, [loginError, submitted]); // Runs when loginError or submitted changes

//   useEffect(() => {
//     console.log(selectedCompany);
//     console.log(companyID);
//     findDesignationID();
//     findCompanyID();
//     console.log(companyID);
//   }, [selectedCompany, companyID, selectedDesignation, designationID]);

//   if (token) {
//     return <Navigate to="/" />;
//   }

//   const onSubmit = async (data: Signup) => {
//     // setSubmitted(true); // Mark the form as submitted
//     // await dispatch(login(data));
//     if (data) {
//       const formData = new FormData();

//       Object.keys(data).forEach((key) => {
//         const value = data[key as keyof Signup]; // Get the value of the key
//         formData.append(key, value as string); // Append each key-value pair to formData
//       });

//       if (companyID) {
//         formData.append("company", companyID as string);
//       }

//       if (designationID) {
//         formData.append("designation", designationID as string);
//       }

//       // console.log("The form data is:", formData);
//       // Log formData content by iterating through it
//       formData.forEach((value, key) => {
//         console.log(`${key}: ${value}`);
//       });
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Left side with image */}
//       <div className="relative w-2/3 bg-cover flex justify-center items-center" style={{ backgroundImage: `url(${signinBanner})` }}>
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black opacity-50"></div> {/* Black overlay with reduced opacity */}

//         {/* Text */}
//         <h1 className="text-white text-5xl font-normal relative z-10 p-20">
//           {displayedText}
//         </h1>
//       </div>

//       {/* Right side with form */}
//       <div className="w-1/3 flex items-center justify-center bg-gray-100">
//         <div className="w-full max-w-md p-8 space-y-4">
//           <div className='flex justify-center'>
//             <HeadingH2 title='Create Your Account' />
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//             {/* First Name & Last Name */}
//             <div className='flex gap-3'>

//               {/* First Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">First Name</label>
//                 <input
//                   type="text"
//                   {...register('first_name', { required: 'First name is required' })}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
//                 />
//                 {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
//               </div>

//               {/* Last Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Last Name</label>
//                 <input
//                   type="text"
//                   {...register('last_name', { required: 'Last name is required' })}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
//                 />
//                 {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
//               </div>
//             </div>

//             {/* Mobile Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Mobile No.</label>
//               <input
//                 type="text"
//                 {...register('mobile_number', { required: 'Mobile No. is required' })}
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
//               />
//               {errors.mobile_number && <p className="text-red-500 text-sm">{errors.mobile_number.message}</p>}
//             </div>

//             {/* Email Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 {...register('email', { required: 'Email is required' })}
//                 className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
//               />
//               {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//             </div>

//             {/* Password Field with Eye Icon */}
//             <div className="relative">
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 {...register('password', { required: 'Password is required' })}
//                 className="mt-1 block relative w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
//               />
//               {/* Eye Icon */}
//               <span
//                 className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
//                 onClick={() => setShowPassword(!showPassword)} // Toggle visibility
//               >
//                 {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
//               </span>
//               {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//               <Link to={"/forgot-password"} className='text-klt_primary-900 text-sm mt-3'>Forgot Password ?</Link>
//             </div>

//             {/* Company */}
//             <div className='flex gap-3'>
//               {/* Company Field */}
//               <div className=''>
//                 <label className='block text-sm font-medium text-gray-700'>Company</label>
//                 <select
//                   {...register("company_name", {
//                     required: "Company Name is required", onChange: (e) => {
//                       setSelectedCompany(e.target.value); // Update state for selected company
//                       // setValue("company_name", e.target.value);  // Update form value for company name
//                     }
//                   })} className="mt-1 block relative w-full  p-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500">
//                   <option value="">Select Company</option>
//                   {companies?.map((company) => (
//                     <option key={company.id} value={company.name}>
//                       {company.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Custom Company */}
//               {companyID === 439 && <div className='w-full'>
//                 <label className="block text-sm font-medium text-gray-700">Company</label>
//                 <input
//                   type="text"
//                   {...register('company_name', { required: 'Company is required' })}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
//                 />
//                 {errors.company_name && <p className="text-red-500 text-sm">{errors.company_name.message}</p>}
//               </div>}
//             </div>

//             {/* Designation */}
//             <div className='flex gap-3 w-full'>
//               {/* Designation Field */}
//               <div className='w-full'>
//                 <label className='block text-sm font-medium text-gray-700'>Designation</label>
//                 <select
//                   {...register("designation_name", {
//                     required: "Designation is required", onChange: (e) => {
//                       // console.log(selectedDesignation);
//                       setSelectedDesignation(e.target.value);
//                     }
//                   })} className="mt-1 block relative w-full  p-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500">
//                   <option value="">Select Designation</option>
//                   {designations?.map((designation) => (
//                     <option key={designation.id} value={designation.name}>
//                       {designation.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Custom Designation */}
//               {designationID === 252 && <div className='w-full'>
//                 <label className="block text-sm font-medium text-gray-700">Designation</label>
//                 <input
//                   type="text"
//                   {...register('designation_name', { required: 'Designation is required' })}
//                   className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-black outline-none focus:border-klt_primary-500"
//                 />
//                 {errors.designation_name && <p className="text-red-500 text-sm">{errors.designation_name.message}</p>}
//               </div>}
//             </div>

//             {/* Address & Pincode */}
//             <div>

//             </div>

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 className="w-full bg-klt_primary-900 text-white py-2 rounded-md"
//                 disabled={loading}
//               >
//                 {loading ? 'Creating...' : 'Create Account'}
//               </button>
//             </div>

//             <hr className='!my-5 border border-zinc-200' />

//             <span>Already have an account ? <Link to={"/login"} className='text-klt_primary-900'>Login Here</Link></span>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


const Signup = () => {
  return (
    <div>Signup</div>
  )
}

export default Signup;