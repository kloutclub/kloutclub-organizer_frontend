import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from '../../../redux/store';
import axios from "axios";
import swal from "sweetalert";
import Loader from "../../../component/Loader";
import { useDispatch } from "react-redux";
import { heading } from "../../heading/headingSlice";

type formInputType = {
    first_name: string,
    last_name: string;
    email: string;
    description: string;
    end_time: string,
    mobile_number: string;
    end_minute_time: string,
    end_time_type: string,
    priority: string;
    company_name: string;
    address: string;
    pincode: string;
    designation_name: string;
    image: File | null,
};

type jobTitleType = {
    created_at: string;
    id: number;
    name: string;
    parent_id: number;
    updated_at: string;
    uuid: string;
}

// type companyType = {
//     created_at: string;
//     id: number;
//     name: string;
//     parent_id: number;
//     updated_at: string;
// }

const Profile: React.FC = () => {

    const { user, token, loading } = useSelector((state: RootState) => state.auth);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const dispatch = useDispatch<AppDispatch>()

    const [edit, setEdit] = useState<boolean>(false);

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const company_logo: string = user?.company_logo ? `${imageBaseUrl}/${user?.company_logo}` : "";
    const userImage: string = user?.image ? `${imageBaseUrl}/${user?.image}` : "";
    const [logoUrl, setLogoUrl] = useState<string>(company_logo);
    const [userUrl, setUserUrl] = useState<string>(userImage);
    const { register, handleSubmit, formState: { errors } } = useForm<formInputType>();
    const [selectedImage, setSelectedImage] = useState(company_logo);
    const [selectedUserImage, setSelectedUserImage] = useState(userImage);
    const [jobTitle, setJobTitles] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [, setCustomCompanyName] = useState<string>(user?.company_name || '');
    const [, setCustomDesignationName] = useState<string>(user?.designation_name || "");
    const [selectedCompany, setSelectedCompany] = useState<string>();
    const [selectedDesignation, setSelectedDesignation] = useState<string>();
    const dummyImage = "https://via.placeholder.com/150";

    useEffect(() => {
        axios.get(`${apiBaseUrl}/api/job-titles`).then(res => setJobTitles(res.data.data || []));
        axios.get(`${apiBaseUrl}/api/companies`).then(res => setCompanies(res.data.data || []));
        setSelectedCompany(user?.company);
        setSelectedDesignation(user?.designation);
    }, []);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCompany(e.target.value);
        if (e.target.value !== "Others") {
            setCustomCompanyName(''); // Reset custom name if a valid company is selected
        }
    };

    const handleDesignationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDesignation(e.target.value);
        if (e.target.value !== "Others") {
            setCustomDesignationName(''); // Reset custom name if a valid designation is selected
        }
    };

    // Handle image upload
    const handleImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        // setImage(file)
        setSelectedImage(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setLogoUrl(imageUrl);
        }
    };
    // Handle image upload
    const handleUserImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        // setImage(file)
        setSelectedUserImage(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUserUrl(imageUrl);
        }
    };

    const onSubmit: SubmitHandler<formInputType> = async (data) => {
        // Prepare data
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        if (selectedImage !== "") {
            console.log("Selected Image is: ", selectedImage);
            formData.append("company_logo", selectedImage);
        }

        if (selectedUserImage !== "") {
            console.log("Selected User Image is: ", selectedUserImage);
            formData.append("image", selectedUserImage);
        }

        const cId: jobTitleType[] | undefined = companies.filter((company: jobTitleType) => company.name === selectedCompany);
        if (cId) {
            formData.append("company", String(cId[0].id));
        }

        const dId: jobTitleType[] | undefined = jobTitle.filter((job: jobTitleType) => job.name === selectedDesignation);
        if (dId) {
            formData.append("designation", String(dId[0].id));
            console.log("The designation id: ", dId[0].id);
        }

        axios
            .post(`${apiBaseUrl}/api/updateprofile`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
            })
            .then((res) => {
                if (res.data.status === 200) {
                    swal("Success", res.data.message, "success").then(() => {
                        window.location.reload();
                        // setEdit(false);
                        // window.history.back();
                    });
                };
            });

    }

    useEffect(() => {
        setLogoUrl(company_logo);
        setUserUrl(userImage);
    }, [company_logo, userImage]);


    if (loading) {
        return <Loader />
    }

    return (
        <div>

            <div className="flex justify-end">
                {/* <HeadingH2 title="Profile" /> */}
                <Link to="/" onClick={() => dispatch(heading("Dashboard"))} className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go To Dasboard
                </Link>
            </div>

            {/* Container for the profile page */}
            {!edit && <div className="max-w-5xl mx-auto p-8">

                {/* Profile Card */}
                <div className="bg-white p-6 rounded-lg shadow-lg relative">
                    <div className="absolute top-2 right-2">
                        <img src={
                            user?.company_logo === null ? dummyImage : `${imageBaseUrl}/${user?.company_logo}`} alt="Company Logo" className="w-16 h-16 rounded-md mx-auto object-contain border border-gray-300" />
                    </div>
                    <div className="flex items-center space-x-8">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0">
                            <img src={
                                user?.image === null ? dummyImage : `${imageBaseUrl}/${user?.image}`} alt="Profile Picture" className="w-80 h-60 rounded-lg object-cover" />
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800">{user?.first_name + " " + user?.last_name}</h2>
                            <h3 className="text-lg font-semibold text-gray-800">{user?.company_name}</h3>
                            <p className="text-sm text-gray-600">{user?.designation_name}</p>
                            <p className="text-gray-500 text-sm">{user?.email}</p>
                            <p className="text-gray-500 text-sm">{user?.mobile_number}</p>
                            <p className="text-gray-500 text-sm">{user?.address + ", " + user?.pincode}</p>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        {/* Company Info */}
                        <div className="flex items-center space-x-8">
                            {/* Company Logo  */}
                            <div className="flex-shrink-0 w-40">

                            </div>

                            <div className="space-y-4">

                                {/* <p className="text-gray-500">{user?.pincode}</p> */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            }

            {!edit && <div className="text-center">
                <button onClick={() => setEdit(true)} className="btn btn-primary mx-auto">Edit Profile</button>
            </div>}

            {edit && <div className="">
                <form onSubmit={handleSubmit(onSubmit)} className="gap-4 mt-10">
                    <div className="flex w-full gap-3">

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* First Name */}
                            <label htmlFor="first_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className=" font-semibold text-green-700 flex justify-between items-center">First Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                                <input
                                    id="first_name"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.first_name}  // Use defaultValue instead of value
                                    {...register('first_name', { required: 'First Name is required' })}
                                />
                            </label>
                            {errors.first_name && <p className="text-red-600">{errors.first_name.message}</p>}
                        </div>

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Last Name */}
                            <label htmlFor="last_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className=" font-semibold text-green-700 flex justify-between items-center">Last Name &nbsp; <TiArrowRight className='mt-1' /> </span>
                                <input
                                    id="last_name"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.last_name} // Use defaultValue instead of value
                                    {...register('last_name', { required: 'Last Name is required' })}
                                />
                            </label>
                            {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
                        </div>
                    </div>

                    <div className="flex w-full gap-3">

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Email */}
                            <label htmlFor="email" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className=" font-semibold text-green-700 flex justify-between items-center">Email &nbsp; <TiArrowRight className='mt-1' /> </span>
                                <input
                                    id="email"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.email} // Use defaultValue instead of value
                                    {...register('email', { required: 'Email is required' })}
                                />

                            </label>
                            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Phone Number */}
                            <label htmlFor="phone" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">Phone No. &nbsp; <TiArrowRight className='mt-1' /> </span>
                                <input
                                    id="phone"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.mobile_number} // Use defaultValue instead of value
                                    {...register('mobile_number', { required: 'Phone No. is required' })}
                                />
                            </label>
                            {errors.mobile_number && <p className="text-red-600">{errors.mobile_number.message}</p>}
                        </div>
                    </div>

                    <div className="flex w-full gap-3">
                        {/* Company */}
                        <div className='flex flex-col w-full gap-3 my-4'>
                            <label htmlFor="company" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 min-w-fit flex items-center">Company &nbsp; <TiArrowRight className='mt-1' /></span>
                                <select
                                    id="company_name"
                                    {...register("company_name", { required: "Company is required" })}
                                    className="bg-white pl-3 w-full h-full"
                                    defaultValue={user?.company_name}
                                    value={selectedCompany}
                                    onChange={handleCompanyChange}
                                >
                                    <option>{user?.company_name}</option>
                                    {companies?.map((company: jobTitleType) => (
                                        <option key={company.id} value={company.name}>
                                            {company.name}
                                        </option>
                                    ))}
                                    <option value="Others">Others</option>
                                </select>
                            </label>
                            {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}
                            {/* {errors.company && <p className="text-red-600">{errors.company.message}</p>} */}
                            {/* Custom Company Name */}
                            {selectedCompany === "Others" && (
                                <div className='flex flex-col w-full gap-3 my-4'>
                                    <label htmlFor="customCompany" className="input input-bordered bg-white text-black flex items-center gap-2">
                                        <span className="font-semibold text-green-700 flex items-center">Company Name &nbsp; <TiArrowRight className='mt-1' /></span>
                                        <input
                                            id="customCompany"
                                            type="text"
                                            // value={customCompanyName}
                                            // onChange={handleCustomCompanyNameChange}
                                            className="grow" {...register('company_name', { required: 'Company name is required' })}
                                        />
                                    </label>
                                    {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}
                                </div>
                            )}
                        </div>

                        {/* Designation */}
                        <div className='flex flex-col w-full gap-3 my-4'>
                            <label htmlFor="designation" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 min-w-fit flex items-center">Designation &nbsp; <TiArrowRight className='mt-1' /></span>
                                <select
                                    id="designation_name"
                                    {...register("designation_name", { required: "Designation is required" })}
                                    className="bg-white pl-3 w-full h-full"
                                    // value={selectedDesignation}
                                    defaultValue={user?.designation}
                                    onChange={handleDesignationChange}
                                >
                                    <option>{user?.designation_name || user?.designation_name}</option>
                                    {jobTitle?.map((designation: jobTitleType) => (
                                        <option key={designation.id} value={designation.name}>
                                            {designation.name}
                                        </option>
                                    ))}
                                    <option value="Others">Others</option>
                                </select>
                            </label>

                            {errors.designation_name && <p className="text-red-600">{errors.designation_name.message}</p>}

                            {/* Custom Designation Name */}
                            {selectedDesignation === "Others" && (
                                <div className='flex flex-col w-full gap-3 my-4'>
                                    <label htmlFor="customDesignation" className="input input-bordered bg-white text-black flex items-center gap-2">
                                        <span className="font-semibold text-green-700 flex items-center">Designation Name &nbsp; <TiArrowRight className='mt-1' /></span>
                                        <input
                                            id="customDesignation"
                                            type="text"
                                            // value={customDesignationName}
                                            // onChange={handleCustomDesignationNameChange}
                                            className="grow" {...register('designation_name', { required: 'Designation is required' })}
                                        />
                                    </label>
                                    {errors.designation_name && <p className="text-red-600">{errors.designation_name.message}</p>}
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="flex w-full gap-3 my-4">
                        <div className='flex flex-col w-full gap-3'>
                            {/* Company Logo Upload */}
                            <label htmlFor="company_logo" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">
                                    Company Logo &nbsp; <TiArrowRight className='mt-1' />
                                </span>
                                <input
                                    id="company_logo"
                                    type="file"
                                    accept="image/*"
                                    className="grow"
                                    onChange={handleImageUpload}
                                />
                            </label>
                            {errors.image && <p className="text-red-600">{errors.image.message}</p>}

                            {/* Display the uploaded image or dummy image */}
                            <div className="mt-3">
                                <img
                                    src={logoUrl || dummyImage}
                                    alt="Selected Logo"
                                    className="w-32 h-32 object-contain"
                                />
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-3'>
                            {/* Profile Image Upload */}
                            <label htmlFor="image" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">
                                    Profile Image &nbsp; <TiArrowRight className='mt-1' />
                                </span>
                                <input
                                    id="profileImage"
                                    type="file"
                                    accept="image/*"
                                    className="grow"
                                    onChange={handleUserImageUpload}
                                />
                            </label>
                            {errors.image && <p className="text-red-600">{errors.image.message}</p>}

                            {/* Display the uploaded image or dummy image */}
                            <div className="mt-3">
                                <img
                                    // defaultValue={user?.image}
                                    src={userUrl || dummyImage}
                                    alt="Selected Profile"
                                    className="w-32 h-32 object-contain"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="flex w-full gap-3">
                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Address */}
                            <label htmlFor="address" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">Address &nbsp; <TiArrowRight className='mt-1' /></span>
                                <input
                                    id="address"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.address} // Use defaultValue instead of value
                                    {...register('address', { required: 'Address is required' })}
                                />
                            </label>
                            {errors.address && <p className="text-red-600">{errors.address.message}</p>}
                        </div>

                        <div className='flex flex-col w-full gap-3 my-4'>
                            {/* Pincode */}
                            <label htmlFor="pincode" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">Pincode &nbsp; <TiArrowRight className='mt-1' /></span>
                                <input
                                    id="pincode"
                                    type="text"
                                    className="grow"
                                    defaultValue={user?.pincode} // Use defaultValue instead of value
                                    {...register('pincode', { required: 'Pincode is required' })}
                                />
                            </label>
                            {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
                        </div>
                    </div>

                    <div className="col-span-3 flex justify-center mt-4 gap-3">
                        <button type="submit" onClick={() => onSubmit} className="btn btn-primary">Update Profile</button>
                        <button type="submit" onClick={() => setEdit(false)} className="btn bg-gray-500 text-white">Cancel</button>
                    </div>
                </form>
            </div>}
        </div>
    );
};

export default Profile;
