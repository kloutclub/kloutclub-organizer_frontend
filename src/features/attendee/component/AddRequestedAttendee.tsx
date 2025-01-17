import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TiArrowRight } from "react-icons/ti";
import { MdOutlineFileDownload } from "react-icons/md";
import axios from "axios";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import Loader from "../../../component/Loader";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

// Define the form data type
type FormInputType = {
    first_name: string;
    last_name: string;
    job_title: string | number;
    company_name: string | number;
    email_id: string;
    phone_number: string;
    alternate_mobile_number: string;
    status: string;
    event_id: number;
    excel_file: File | null;
};


type ApiType = {
    created_at: string;
    id: number;
    name: string;
    parent_id: number;
    updated_at: string;
    uuid: string;
}

const AddRequestedAttendee: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useSelector((state: RootState) => (state.auth));
    // const navigate = useNavigate();
    const { token } = useSelector((state: RootState) => (state.auth));
    const allEvents = useSelector((state: RootState) => (state.events.events));
    const currentEvent = allEvents.find((event) => event.uuid === uuid);
    // const { currentAttendeeUUID } = useSelector((state: RootState) => (state.attende));
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInputType>();
    const [selectedExcelFile, setSelectedExcelFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [jobTitles, setJobTitles] = useState<ApiType[] | undefined>();
    const [selectedCompany, setSelectedCompany] = useState<string | number>(''); // Track selected company

    const [companies, setCompanies] = useState<ApiType[] | undefined>();
    const [selectedJobTitle, setSelectedJobTitle] = useState<string | number>(''); // Track selected job title

    const [loading, setLoading] = useState<boolean>(false);

    const [, setErrorsExcel] = useState({});
    const [, setInvalidMessage] = useState("");
    const [, setIsLoadingExcel] = useState(false);
    const [, setColumnData] = useState({});
    const [, setInValidData] = useState({});
    const [, setDownloadInvalidExcel] = useState(false);


    // const [showAlert, setShowAlert] = useState(true);
    // const [companyInput, setCompanyInput] = useState(false);
    // const [companyData, setCompanyData] = useState([]);
    // const [designationData, setDesignationData] = useState([]);
    // const [designationInput, setDesignationInput] = useState(false);
    const [excelInput, setExcelInput] = useState({
        file: null,
    });

    console.log(currentEvent);

    useEffect(() => {
        axios.get(`${apiBaseUrl}/api/job-titles`).then(res => setJobTitles(res.data.data));
        axios.get(`${apiBaseUrl}/api/companies`).then(res => setCompanies(res.data.data));
    }, []);

    const downloadSampleExcel = () => {
        const data = [
            [
                "first_name",
                "last_name",
                "email_id",
                "phone_number",
                "status",
                "alternate_mobile_number",
                "alternate_email_id",
                "company_name",
                "job_title",
            ],
            [
                "John",
                "Doe",
                "johndoe@example.com",
                "8709289369",
                "Speaker",
                "7865656575",
                "johndoe@alternatemail.com",
                "Digimantra",
                "CEO",
            ],
        ];

        // Convert data to CSV format
        const csvContent =
            "data:text/csv;charset=utf-8," +
            data.map((row) => row.join(",")).join("\n");

        // Create a virtual anchor element and trigger download
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "request_attendee_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Logic for handling Excel file uploads
        const file = e.target.files?.[0];
        if (file) {
            setSelectedExcelFile(file);  // Store the selected file in state
            setValue('excel_file', file);  // Set it in the form data as well
        }
    };


    const handleFileUpload = async (e: any) => {
        if (selectedExcelFile) {
            setLoading(true);
        }
        e.preventDefault();

        setDownloadInvalidExcel(false);

        if (!selectedExcelFile) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Please select an excel file',
                confirmButtonText: 'OK'
            });
            return;
        }

        setIsLoadingExcel(true);

        const formData = new FormData();

        formData.append("excel_file", selectedExcelFile);

        if (currentEvent) {
            formData.append("event_id", String(currentEvent.id));
        }

        if (user) {
            formData.append("user_id", String(user?.id));
        }

        console.log(formData);

        await axios
            .post(`${apiBaseUrl}/api/bulk-upload-requested-attendee`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
            })
            .then((res) => {
                if (res.data.status) {
                    swal("Success", res.data.message, "success").then(()=>window.history.back());

                    setColumnData({});

                    setInValidData({});

                    setErrorsExcel({});

                    setDownloadInvalidExcel(false);

                    setSelectedExcelFile(null);

                    // history.push(`/organiser/admin/all-attendee/${event_id}`);
                } else if (res.data.status === 400) {
                    setDownloadInvalidExcel(true);

                    setColumnData(res.data.column_data);

                    setInValidData(res.data.invalid_data);

                    setInvalidMessage(res.data.message);

                    setErrorsExcel(res.data.errors);

                    setSelectedExcelFile(null);

                    setExcelInput({ ...excelInput, file: null });

                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                } else if (res.data.status === 422) {
                    setColumnData({});

                    setInValidData({});

                    setErrorsExcel({ message: res.data.error });

                    setSelectedExcelFile(null);

                    setExcelInput({ ...excelInput, file: null });

                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                } else if (res.data.status === 401) {
                    setColumnData({});

                    setInValidData({});

                    setDownloadInvalidExcel(false);

                    setErrorsExcel({ message: res.data.message });

                    setSelectedExcelFile(null);

                    setExcelInput({ ...excelInput, file: null });

                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
            }).then(() => {
                setLoading(false);
            })

        setIsLoadingExcel(false);
    };


    const onSubmit: SubmitHandler<FormInputType> = async (data) => {
        setLoading(true);

        const formData = new FormData();

        // formData.append("image", undefined);

        Object.keys(data).forEach((key) => {
            const value = data[key as keyof FormInputType];

            formData.append(key, value ? value.toString() : "");
        });

        if (currentEvent) {
            formData.append("event_id", String(currentEvent.id));
        }

        if (currentEvent) {
            formData.append("user_id", String(currentEvent.user_id));
        }

        console.log(formData);

        try {
            axios
                .post(`${apiBaseUrl}/api/request-attendees`, formData, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                })
                .then((res) => {
                    // console.log("The data is: ", res.data);
                    // if (res.status ) {
                    //     console.log("The error is occurred");
                    // }

                    if (res.data.status) {
                        swal("Success", res.data.message, "success").then(() => window.history.back());
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: res.data.message,
                            // text: 'Something went wrong!',
                        });
                    }
                }).catch(res => {
                    Swal.fire({
                        icon: 'error',
                        title: res.data.message,
                        // text: 'Something went wrong!',
                    });
                })
        } catch (error) {
            alert('An error occurred while submitting the form.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }

    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className="p-6 pt-3">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-black text-2xl font-semibold ps-5">
                    Add Requested Attendee
                </h2>
                <button type="button" onClick={downloadSampleExcel} className="btn btn-secondary btn-sm btn-outline">
                    <MdOutlineFileDownload /> Download Sample Excel CSV Sheet Format
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[60%,40%] gap-4">
                {/* Left Section - Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="gap-4">
                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="first_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">First Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="first_name" type="text" className="grow" {...register('first_name', { required: 'First Name is required' })} />
                        </label>
                        {errors.first_name && <p className="text-red-600">{errors.first_name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="last_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Last Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="last_name" type="text" className="grow" {...register('last_name', { required: 'Last Name is required' })} />
                        </label>
                        {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="email_id" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Email <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="email_id" type="email" className="grow" {...register('email_id', { required: 'Email is required' })} />
                        </label>
                        {errors.email_id && <p className="text-red-600">{errors.email_id.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="job_title" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Job Title <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className="mt-1" />
                            </span>
                            <select
                                id="job_title"
                                className="grow bg-white"
                                {...register("job_title", { required: "Job Title is required" })}
                                value={selectedJobTitle}
                                onChange={(e) => {
                                    setSelectedJobTitle(e.target.value); // Update state for selected job title
                                    setValue("job_title", e.target.value);  // Update form value for job title
                                }}
                            >
                                <option value="">Select Job Title</option>
                                {jobTitles?.map((jobTitle) => (
                                    <option key={jobTitle.id} value={jobTitle.name}>
                                        {jobTitle.name}
                                    </option>
                                ))}
                                {/* Add an option for 'Other' */}
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        {errors.job_title && <p className="text-red-600">{errors.job_title.message}</p>}
                    </div>

                    {/* Render the text input only when "Other" is selected */}
                    {selectedJobTitle === "Others" && (
                        <div className="flex flex-col gap-3 my-4">
                            <label htmlFor="job_title_other" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">
                                    Specify Job Title <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className="mt-1" />
                                </span>
                                <input
                                    id="job_title_other"
                                    type="text"
                                    className="grow"
                                    {...register('job_title', { required: 'Please specify a job title' })}
                                />
                            </label>
                            {errors.job_title && <p className="text-red-600">{errors.job_title.message}</p>}
                        </div>
                    )}


                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="company_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Company Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className="mt-1" />
                            </span>
                            <select
                                id="company_name"
                                className="grow bg-white"
                                {...register("company_name", { required: "Company Name is required" })}
                                value={selectedCompany}
                                onChange={(e) => {
                                    setSelectedCompany(e.target.value); // Update state for selected company
                                    setValue("company_name", e.target.value);  // Update form value for company name
                                }}
                            >
                                <option value="">Select Company</option>
                                {companies?.map((company) => (
                                    <option key={company.id} value={company.name}>
                                        {company.name}
                                    </option>
                                ))}
                                {/* Add an option for 'Other' */}
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}
                    </div>

                    {/* Render the text input only when "Other" is selected */}
                    {selectedCompany === "Others" && (
                        <div className="flex flex-col gap-3 my-4">
                            <label htmlFor="company_name_other" className="input input-bordered bg-white text-black flex items-center gap-2">
                                <span className="font-semibold text-green-700 flex justify-between items-center">
                                    Specify Company Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className="mt-1" />
                                </span>
                                <input
                                    id="company_name_other"
                                    type="text"
                                    className="grow"
                                    {...register('company_name', { required: 'Please specify a company name' })}
                                />
                            </label>
                            {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}
                        </div>
                    )}


                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="phone_number" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Phone Number <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="phone_number" type="tel" className="grow" {...register('phone_number', {
                                required: 'Phone Number is required',
                                pattern: {
                                    value: /^[0-9]{10}$/, // Regex to match exactly 10 digits
                                    message: 'Phone number must contain exactly 10 digits'
                                }
                            })} />
                        </label>
                        {errors.phone_number && <p className="text-red-600">{errors.phone_number.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="alternate_mobile_number" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Alternate Phone Number &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="alternate_mobile_number" type="tel" className="grow" {...register('alternate_mobile_number', {
                                required: false,
                                pattern: {
                                    value: /^[0-9]{10}$/, // Regex to match exactly 10 digits
                                    message: 'Phone number must contain exactly 10 digits'
                                }
                            })} />
                        </label>
                        {errors.alternate_mobile_number && <p className="text-red-600">{errors.alternate_mobile_number.message}</p>}
                    </div>

                    <div className="flex flex-col gap-3 my-4">
                        <label htmlFor="status" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">Status <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="status" className="grow bg-white" {...register('status', { required: 'Status is required' })}>
                                <option value="">Select Status</option>
                                <option value="speaker">Speaker</option>
                                <option value="panelist">Panellist</option>
                                <option value="sponsor">Sponsor</option>
                                <option value="delegate">Delegate</option>
                                <option value="moderator">Moderator</option>
                                {/* <option value="Awwards Winner">Awwards Winner</option> */}
                            </select>
                        </label>
                        {errors.status && <p className="text-red-600">{errors.status.message}</p>}
                    </div>

                    <div className="col-span-3 flex justify-center mt-4">
                        <button type="submit" className="px-4 py-2 rounded-md bg-klt_primary-900 text-white mx-auto w-fit">
                            Submit
                        </button>
                    </div>
                </form>

                {/* Right Section - Excel Upload */}
                <div className="bg-gray-100">
                    <div className="shadow-md p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Bulk Upload</h3>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="excel_file" className="input input-bordered bg-white text-black flex items-center justify-between gap-2 mb-2">
                                <span className="font-semibold text-green-700 flex items-center">
                                    Upload Excel <TiArrowRight />
                                </span>
                                <input
                                    id="excel_file"
                                    // {...register('excel_file', { required: 'Excel File is required' })}
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    className="grow"
                                    onChange={(e) => handleExcelUpload(e)}
                                />
                            </label>
                            {errors.excel_file && <p className="text-red-600">{errors.excel_file.message}</p>}
                            <button type="button" className="btn btn-warning btn-sm" onClick={(e) => handleFileUpload(e)}>
                                Upload Excel Now
                            </button>
                        </div>
                        {/* <div className="mt-3">
                            <h3 className="text-lg font-semibold mb-2">Selected Image</h3>
                            <img
                                src={selectedImage || dummyImage}
                                alt="Selected Profile"
                                className="w-60 object-cover"
                            />
                        </div> */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddRequestedAttendee;