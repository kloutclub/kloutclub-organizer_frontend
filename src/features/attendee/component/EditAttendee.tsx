// import axios from 'axios';
// import React, { useEffect, useRef, useState } from 'react';
// import { RootState } from '../../../redux/store';
// import { useSelector } from 'react-redux';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { TiArrowRight } from 'react-icons/ti';
// import Loader from '../../../component/Loader';
// import { useParams } from 'react-router-dom';

// // Define the form data type
// type FormInputType = {
//   first_name: string;
//   last_name: string;
//   job_title: string;
//   company_name: string;
//   customCompany: string;
//   industry: string;
//   email_id: string;
//   phone_number: string;
//   alternate_mobile_number: string;
//   website: string;
//   linkedin_page_link: string;
//   employee_size: number;
//   company_turn_over: number;
//   status: string;
//   event_id: number | string | null | undefined;
//   image: File;
// };

// type ApiType = {
//   created_at: string;
//   id: number;
//   name: string;
//   parent_id: number;
//   updated_at: string;
//   uuid: string;
// }

// const EditAttendee = () => {
//   const { attendee_uuid, uuid } = useParams<{ attendee_uuid: string, uuid: string }>();

//   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
//   const dummyImage = "https://via.placeholder.com/150";

//   const { token } = useSelector((state: RootState) => (state.auth));
//   const [selectedImage, setSelectedImage] = useState<string>("");
//   const [attendeeImage, setAttendeeImage] = useState<string>(dummyImage);
//   const { events } = useSelector((state: RootState) => (state.events));

//   const currentEvent = events.find((event) => event.id === Number(attendee_uuid));
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInputType>();
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const [industries, setIndustries] = useState<ApiType[]>();
//   const [selectedIndustry, setSelectedIndustry] = useState<string>(); // Track selected industry

//   const [companies, setCompanies] = useState<ApiType[]>();
//   const [selectedCompany, setSelectedCompany] = useState<string>(); // Track selected company

//   const [jobTitles, setJobTitles] = useState<ApiType[]>();
//   const [selectedJobTitle, setSelectedJobTitle] = useState<string>(); // Track selected job title

//   const [status, setStatus] = useState<number | string>();

//   const { loading } = useSelector((state: RootState) => state.attendee);

//   // State to track if initial data is loaded
//   const [initialDataLoaded, setInitialDataLoaded] = useState(false);

//   // Fetch initial data (job titles, companies, and industries)
//   const fetchData = async () => {
//     try {
//       const jobTitlesResponse = await axios.get(`${apiBaseUrl}/api/job-titles`);
//       const companiesResponse = await axios.get(`${apiBaseUrl}/api/companies`);
//       const industriesResponse = await axios.get(`${apiBaseUrl}/api/get-industries`);

//       setJobTitles(jobTitlesResponse.data.data);
//       setCompanies(companiesResponse.data.data);
//       setIndustries(industriesResponse.data.data);

//       // Set initial data loaded to true after fetching
//       setInitialDataLoaded(true);
//     } catch (error) {
//       console.error("Error fetching initial data:", error);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Fetch attendee data after initial data is loaded
//   useEffect(() => {
//     if (initialDataLoaded) {
//       axios.post(`${apiBaseUrl}/api/attendees/${uuid}`, {}, {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       }).then((res) => {
//         const attendeeData: FormInputType = res.data.data;

//         console.log("All Attendee Data is: ", attendeeData);
//         console.log("Job Titles are: ", jobTitles);
//         console.log("Companies are: ", companies);
//         console.log("Industries are: ", industries);

//         const jobExist = jobTitles?.filter((job) => job.name == attendeeData.job_title);
//         const companyExist = companies?.filter((company) => company.name == attendeeData.company_name);
//         const industryExist = industries?.filter((industry) => industry.name == attendeeData.industry);

//         if (jobExist?.length === 0) {
//           setSelectedJobTitle("Others");
//         }

//         if (companyExist?.length === 0) {
//           setSelectedCompany("Others");
//         }

//         if (industryExist?.length === 0) {
//           setSelectedIndustry("Others");
//         }

//         setValue("first_name", attendeeData.first_name);
//         setValue("last_name", attendeeData.last_name);
//         setValue("email_id", attendeeData.email_id);
//         setValue("phone_number", attendeeData.phone_number);
//         setValue("alternate_mobile_number", attendeeData.alternate_mobile_number);
//         setValue("website", attendeeData.website);
//         setValue("linkedin_page_link", attendeeData.linkedin_page_link);
//         setValue("employee_size", attendeeData.employee_size);
//         setValue("company_turn_over", attendeeData.company_turn_over);
//         setValue("status", attendeeData.status);
//         setValue("company_name", attendeeData.company_name);
//         setValue("industry", attendeeData.industry);
//         setValue("job_title", attendeeData.job_title);

//         if (attendeeData.image) {
//           setAttendeeImage(`${apiBaseUrl}/${attendeeData.image}`);
//         }

//         setStatus(attendeeData.status);
//       });
//     }
//   }, [initialDataLoaded, uuid, token]);

//   // Handle image upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);
//       setValue("image", file); // storing it in the form
//     }
//   };

//   // Submit form data
//   const onSubmit: SubmitHandler<FormInputType> = async (data) => {
//     const formData = new FormData();
//     Object.keys(data).forEach((key) => {
//       const value = data[key as keyof FormInputType];
//       if (key === "image" && value instanceof File) {
//         formData.append(key, value);  // Append the image file
//       } else {
//         formData.append(key, value ? value.toString() : ""); // Append other form data as strings
//       }
//     });

//     if (currentEvent?.id) {
//       formData.append("event_id", currentEvent.id.toString());
//     }

//     formData.append("_method", "PUT");

//     axios
//       .post(`${apiBaseUrl}/api/attendees/${uuid}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "Authorization": `Bearer ${token}`
//         },
//       })
//       .then((res) => {
//         if (res.data.status === 200) {
//           swal("Success", res.data.message, "success").then(_ => {
//             window.history.back();
//           })
//         }
//       });
//   }

//   if (loading) {
//     return <Loader />;
//   }


//   return (
//     <div className="p-6 pt-3">
//       <div className="flex justify-between items-center mb-5">
//         <h2 className="text-black text-2xl font-semibold ps-5">
//           Edit Attendee Details
//         </h2>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

//         <div className='flex gap-3 w-full'>
//           <div className="w-full">
//             <label htmlFor="first_name" className="input input-bordered bg-white text-black flex items-center gap-2">
//               <span className="font-semibold text-green-700 flex justify-between items-center">First Name &nbsp; <TiArrowRight className='mt-1' /> </span>
//               <input id="first_name" type="text" className="grow" {...register('first_name', { required: 'First Name is required' })} />
//             </label>
//             {errors.first_name && <p className="text-red-600">{errors.first_name.message}</p>}
//           </div>

//           <div className="w-full">
//             <label htmlFor="last_name" className="input input-bordered bg-white text-black flex items-center gap-2">
//               <span className="font-semibold text-green-700 flex justify-between items-center">Last Name &nbsp; <TiArrowRight className='mt-1' /> </span>
//               <input id="last_name" type="text" className="grow" {...register('last_name', { required: 'Last Name is required' })} />
//             </label>
//             {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
//           </div>
//         </div>

//         <div className="flex items-center gap-3 w-full">

//           <label htmlFor="image" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
//             <span className="font-semibold text-green-700 flex justify-between items-center">Profile Picture &nbsp; <TiArrowRight className='mt-1' /> </span>
//             <input
//               id="image"
//               type="file"
//               accept="image/*"
//               className="grow"
//               onChange={handleImageUpload}
//               ref={fileInputRef}
//             />
//           </label>

//           <img src={selectedImage || attendeeImage} alt="" className='w-full h-60 object-contain rounded-sm' />

//         </div>

//         <div className='flex w-full gap-3'>
//           <div className="w-full">
//             <label htmlFor="email_id" className="input input-bordered bg-white text-black flex items-center gap-2">
//               <span className="font-semibold text-green-700 flex items-center">Email &nbsp; <TiArrowRight className='ml-1' /> </span>
//               <input id="email_id" className="w-full grow" type="email" {...register('email_id', { required: 'Email is required' })} />
//             </label>
//             {errors.email_id && <p className="text-red-600">{errors.email_id.message}</p>}
//           </div>

//           <div className="w-full">
//             {/* Industry Dropdown */}
//             <div className="w-full">
//               <label htmlFor="industry" className="input input-bordered bg-white text-black flex items-center gap-2">
//                 <span className="font-semibold text-green-700 flex justify-between items-center">
//                   Industry Name &nbsp; <TiArrowRight className="mt-1" />
//                 </span>
//                 <select
//                   id="industry"
//                   className="grow w-full bg-white"
//                   // {...register('industry', { required: 'Company Name is required' })}
//                   {...register('industry')}
//                   value={selectedIndustry} // Bind selected value
//                   onChange={(e) => { setSelectedIndustry(e.target.value) }} // Track company selection
//                 >
//                   <option value="">Select an industry</option>
//                   {industries?.map((industry: ApiType) => (
//                     <option key={industry.id} value={industry.name}>
//                       {industry.name}
//                     </option>
//                   ))}
//                   <option value="Others">Others</option> {/* Add "Others" option */}
//                 </select>
//               </label>
//               {errors.industry && <p className="text-red-600">{errors.industry.message}</p>}

//               {/* Conditionally Render Custom Industry Name Input */}
//               {selectedIndustry === 'Others' && (
//                 <div className='flex flex-col w-full gap-3 my-4'>
//                   <label htmlFor="customCompanyName" className="input input-bordered bg-white text-black flex items-center gap-2">
//                     <span className="font-semibold text-green-700 flex items-center">
//                       Custom Industry Name &nbsp;
//                       <TiArrowRight className='mt-1' />
//                     </span>
//                     <input
//                       id="customIndustry"
//                       // value={selectedCompany}
//                       type="text"
//                       className="grow"
//                       {...register('industry', { required: 'Industry name is required' })}
//                     />
//                   </label>
//                   {errors.industry && <p className="text-red-600">{errors.industry.message}</p>}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className='flex w-full gap-3'>
//           <div className="w-full">
//             {/* Company Name Dropdown */}
//             <div className="w-full">
//               <label htmlFor="company_name" className="input input-bordered bg-white text-black flex items-center gap-2">
//                 <span className="font-semibold text-green-700 flex justify-between items-center">
//                   Company Name &nbsp; <TiArrowRight className="mt-1" />
//                 </span>
//                 <select
//                   id="company_name"
//                   className="grow h-full bg-white"
//                   // {...register('company_name', { required: 'Company Name is required' })}
//                   {...register('company_name')}
//                   value={selectedCompany} // Bind selected value
//                   onChange={(e) => { setSelectedCompany(e.target.value) }} // Track company selection
//                 >
//                   <option value="">Select a company</option>
//                   {companies?.map((company: ApiType) => (
//                     <option key={company.id} value={company.name}>
//                       {company.name}
//                     </option>
//                   ))}
//                   <option value="Others">Others</option> {/* Add "Others" option */}
//                 </select>
//               </label>
//               {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}

//               {/* Conditionally Render Custom Company Name Input */}
//               {selectedCompany === 'Others' && (
//                 <div className='flex flex-col w-full gap-3 my-4'>
//                   <label htmlFor="customCompanyName" className="input input-bordered bg-white text-black flex items-center gap-2">
//                     <span className="font-semibold text-green-700 flex items-center">
//                       Custom Company Name &nbsp;
//                       <TiArrowRight className='mt-1' />
//                     </span>
//                     <input
//                       id="customCompanyName"
//                       // value={selectedCompany}
//                       type="text"
//                       className="grow"
//                       {...register('company_name', { required: 'Company name is required' })}
//                     />
//                   </label>
//                   {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="w-full">
//             {/* Job Title Dropdown */}
//             <div className="w-full">
//               <label htmlFor="job_title" className="input input-bordered bg-white text-black flex items-center gap-2">
//                 <span className="font-semibold text-green-700 flex justify-between items-center">
//                   Job Title &nbsp;
//                   <TiArrowRight className="mt-1" />
//                 </span>
//                 <select
//                   id="job_title"
//                   className="grow h-full bg-white"
//                   // {...register('job_title', { required: 'Job Title is required' })}
//                   {...register('job_title')}
//                   value={selectedJobTitle} // Bind selected value
//                   onChange={(e) => { setSelectedJobTitle(e.target.value) }} // Track job title selection
//                 >
//                   <option value="">Select a job title</option>
//                   {jobTitles?.map((job: ApiType) => (
//                     <option key={job.id} value={job.name}>
//                       {job.name}
//                     </option>
//                   ))}
//                   {/* <option defaultValue="Others">{selectedJobTitle==="Others"?selectedJobTitle:"Others"}</option> Add "Others" option */}
//                 </select>
//               </label>
//               {errors.job_title && <p className="text-red-600">{errors.job_title.message}</p>}

//               {/* Conditionally Render Custom Job Title Input */}
//               {selectedJobTitle === 'Others' && (
//                 <div className="flex flex-col w-full gap-3 my-4">
//                   <label htmlFor="customJobTitle" className="input input-bordered bg-white text-black flex items-center gap-2">
//                     <span className="font-semibold text-green-700 flex items-center">
//                       Custom Job Title &nbsp;
//                       <TiArrowRight className="mt-1" />
//                     </span>
//                     <input
//                       id="customJobTitle"
//                       type="text"
//                       // value={selected}
//                       className="grow"
//                       {...register('job_title', { required: 'Job title is required' })}
//                     />
//                   </label>
//                   {errors.job_title && <p className="text-red-600">{errors.job_title.message}</p>}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className='flex w-full gap-3'>
//           <div className="w-full">
//             <label htmlFor="phone_number" className="input input-bordered bg-white text-black flex items-center gap-2">
//               <span className="font-semibold text-green-700 flex justify-between items-center">Phone Number &nbsp; <TiArrowRight className='mt-1' /> </span>
//               <input id="phone_number" type="tel" className="grow" {...register('phone_number', { required: 'Phone Number is required' })} />
//             </label>
//             {errors.phone_number && <p className="text-red-600">{errors.phone_number.message}</p>}
//           </div>

//           <div className="w-full">
//             <label htmlFor="alternate_mobile_number" className="input input-bordered bg-white text-black flex items-center gap-2">
//               <span className="font-semibold text-green-700 flex justify-between items-center">Alternate Phone Number &nbsp; <TiArrowRight className='mt-1' /> </span>
//               <input id="alternate_mobile_number" type="tel" className="grow" {...register('alternate_mobile_number')} />
//             </label>
//             {errors.alternate_mobile_number && <p className="text-red-600">{errors.alternate_mobile_number.message}</p>}
//           </div>
//         </div>

//         <div className='flex w-full gap-3'>
//           <div className="w-full">
//             <label htmlFor="website" className="input input-bordered bg-white text-black flex items-center gap-2">
//               <span className="font-semibold text-green-700 flex justify-between items-center">Website &nbsp; <TiArrowRight className='mt-1' /> </span>
//               <input id="website" type="url" className="grow" {...register('website')} />
//             </label>
//             {errors.website && <p className="text-red-600">{errors.website.message}</p>}
//           </div>

//           <div className="w-full">
//             <label htmlFor="linkedin_page_link" className="input input-bordered bg-white text-black flex items-center gap-2">
//               <span className="font-semibold text-green-700 flex justify-between items-center">LinkedIn Profile Link &nbsp; <TiArrowRight className='mt-1' /> </span>
//               <input id="linkedin_page_link" type="url" className="grow" {...register('linkedin_page_link')} />
//             </label>
//             {errors.linkedin_page_link && <p className="text-red-600">{errors.linkedin_page_link.message}</p>}
//           </div>
//         </div>

//         <div className='flex w-full gap-3'>
//           <div className="w-full">
//             <label htmlFor="employee_size" className="input input-bordered bg-white text-black flex items-center gap-2">
//               <span className="font-semibold text-green-700 flex justify-between items-center">Employee Size &nbsp; <TiArrowRight className='mt-1' /> </span>
//               <input id="employee_size" type="number" className="grow" {...register('employee_size')} />
//             </label>
//             {errors.employee_size && <p className="text-red-600">{errors.employee_size.message}</p>}
//           </div>

//           <div className="w-full">
//             <label htmlFor="company_turn_over" className="input input-bordered bg-white text-black flex items-center gap-2">
//               <span className="font-semibold text-green-700 flex justify-between items-center">Company Turn Over &nbsp; <TiArrowRight className='mt-1' /> </span>
//               <input id="company_turn_over" type="number" className="grow" {...register('company_turn_over')} />
//             </label>
//             {errors.company_turn_over && <p className="text-red-600">{errors.company_turn_over.message}</p>}
//           </div>
//         </div>

//         <div className="w-1/2">
//           <label htmlFor="status" className="input input-bordered bg-white text-black flex items-center gap-2">
//             <span className="font-semibold text-green-700 flex justify-between items-center">Status &nbsp; <TiArrowRight className='mt-1' /> </span>
//             <select id="status" className="grow h-full bg-white" {...register('status', { required: 'Status is required' })}>
//               <option value={status}>{status}</option>
//               <option value="speaker">Speaker</option>
//               <option value="panelist">Panellist</option>
//               <option value="sponsor">Sponsor</option>
//               <option value="Delegate">Delegate</option>
//               <option value="moderator">Moderator</option>
//             </select>
//           </label>
//           {errors.status && <p className="text-red-600">{errors.status.message}</p>}
//         </div>

//         <div className="col-span-3 flex justify-center mt-4">
//           <button type="submit" className="btn btn-primary">
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default EditAttendee;
































































import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TiArrowRight } from 'react-icons/ti';
import Loader from '../../../component/Loader';
import { useParams } from 'react-router-dom';

// Define the form data type
type FormInputType = {
  first_name: string;
  last_name: string;
  job_title: string;
  company_name: string;
  customCompany: string;
  industry: string;
  email_id: string;
  phone_number: string;
  alternate_mobile_number: string;
  website: string;
  linkedin_page_link: string;
  employee_size: number;
  company_turn_over: number;
  status: string;
  event_id: number | string | null | undefined;
  image: File;
};

type ApiType = {
  created_at: string;
  id: number;
  name: string;
  parent_id: number;
  updated_at: string;
  uuid: string;
}

const EditAttendee = () => {
  const { attendee_uuid, uuid } = useParams<{ attendee_uuid: string, uuid: string }>();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const dummyImage = "https://via.placeholder.com/150";

  const { token } = useSelector((state: RootState) => (state.auth));
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [attendeeImage, setAttendeeImage] = useState<string>(dummyImage);
  const { events } = useSelector((state: RootState) => (state.events));

  const currentEvent = events.find((event) => event.id === Number(attendee_uuid));
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormInputType>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [industries, setIndustries] = useState<ApiType[]>();
  const [, setSelectedIndustry] = useState<string>(); // Track selected industry

  const [companies, setCompanies] = useState<ApiType[]>();
  // const [selectedCompany, setSelectedCompany] = useState<string>(); // Track selected company

  const [jobTitles, setJobTitles] = useState<ApiType[]>();
  const [, setSelectedJobTitle] = useState<string>(); // Track selected job title

  const [, setStatus] = useState<number | string>();

  const [companyFilled, setCompanyFilled] = useState<string>("");
  const [jobFilled, setJobFilled] = useState<string>("");
  const [industryFilled, setIndustryFilled] = useState<string>("");

  const { loading } = useSelector((state: RootState) => state.attendee);

  // State to track if initial data is loaded
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Fetch initial data (job titles, companies, and industries)
  const fetchData = async () => {
    try {
      const jobTitlesResponse = await axios.get(`${apiBaseUrl}/api/job-titles`);
      const companiesResponse = await axios.get(`${apiBaseUrl}/api/companies`);
      const industriesResponse = await axios.get(`${apiBaseUrl}/api/get-industries`);

      setJobTitles(jobTitlesResponse.data.data);
      setCompanies(companiesResponse.data.data);
      setIndustries(industriesResponse.data.data);

      // Set initial data loaded to true after fetching
      setInitialDataLoaded(true);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch attendee data after initial data is loaded
  useEffect(() => {
    if (initialDataLoaded) {
      axios.post(`${apiBaseUrl}/api/attendees/${uuid}`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }).then((res) => {
        const attendeeData: FormInputType = res.data.data;

        console.log("All Attendee Data is: ", attendeeData);
        console.log("Job Titles are: ", jobTitles);
        console.log("Companies are: ", companies);
        console.log("Industries are: ", industries);

        const jobExist = jobTitles?.filter((job) => job.name == attendeeData.job_title);
        // const companyExist = companies?.filter((company) => company.name == attendeeData.company_name);
        const industryExist = industries?.filter((industry) => industry.name == attendeeData.industry);

        if (jobExist?.length === 0) {
          setSelectedJobTitle("Others");
        }

        // if (companyExist?.length === 0) {
        //   setSelectedCompany("Others");
        // }

        if (industryExist?.length === 0) {
          setSelectedIndustry("Others");
        }

        setValue("first_name", attendeeData.first_name);
        setValue("last_name", attendeeData.last_name);
        setValue("email_id", attendeeData.email_id);
        setValue("phone_number", attendeeData.phone_number);
        setValue("alternate_mobile_number", attendeeData.alternate_mobile_number);
        setValue("website", attendeeData.website);
        setValue("linkedin_page_link", attendeeData.linkedin_page_link);
        setValue("employee_size", attendeeData.employee_size);
        setValue("company_turn_over", attendeeData.company_turn_over);
        setValue("status", attendeeData.status);
        setValue("company_name", attendeeData.company_name);
        setValue("industry", attendeeData.industry);
        setValue("job_title", attendeeData.job_title);
        setCompanyFilled(attendeeData.company_name);
        setIndustryFilled(attendeeData.industry);
        setJobFilled(attendeeData.job_title);

        if (attendeeData.image) {
          setAttendeeImage(`${apiBaseUrl}/${attendeeData.image}`);
        }
        
        setStatus(attendeeData.status);
      });
    }
  }, [initialDataLoaded, uuid, token]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setValue("image", file); // storing it in the form
    }
  };





  // Submit form data
  const onSubmit: SubmitHandler<FormInputType> = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof FormInputType];
      if (key === "image" && value instanceof File) {
        formData.append(key, value);  // Append the image file
      } else {
        formData.append(key, value ? value.toString() : ""); // Append other form data as strings
      }
    });

    if (currentEvent?.id) {
      formData.append("event_id", currentEvent.id.toString());
    }

    formData.append("_method", "PUT");

    axios
      .post(`${apiBaseUrl}/api/attendees/${uuid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          swal("Success", res.data.message, "success").then(_ => {
            window.history.back();
          })
        }
      });
  }

  if (loading) {
    return <Loader />;
  }


  return (
    <div className="p-6 pt-3">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-black text-2xl font-semibold ps-5">
          Edit Attendee Details
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

        <div className='flex gap-3 w-full'>
          <div className="w-full">
            <label htmlFor="first_name" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">First Name &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="first_name" type="text" className="grow" {...register('first_name', { required: 'First Name is required' })} />
            </label>
            {errors.first_name && <p className="text-red-600">{errors.first_name.message}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="last_name" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Last Name &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="last_name" type="text" className="grow" {...register('last_name', { required: 'Last Name is required' })} />
            </label>
            {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full">

          <label htmlFor="image" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
            <span className="font-semibold text-green-700 flex justify-between items-center">Profile Picture &nbsp; <TiArrowRight className='mt-1' /> </span>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="grow"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </label>

          <img src={selectedImage || attendeeImage} alt="" className='w-full h-60 object-contain rounded-sm' />

        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            <label htmlFor="email_id" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex items-center">Email &nbsp; <TiArrowRight className='ml-1' /> </span>
              <input id="email_id" className="w-full grow" type="email" {...register('email_id', { required: 'Email is required' })} />
            </label>
            {errors.email_id && <p className="text-red-600">{errors.email_id.message}</p>}
          </div>

          <div className="w-full">
            {/* Industry Dropdown */}
            <div className="w-full">
              <label htmlFor="industry" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className="font-semibold text-green-700 flex justify-between items-center">
                  Industry Name &nbsp; <TiArrowRight className="mt-1" />
                </span>
                <select
                  id="industry"
                  className="grow w-full bg-white"
                  // {...register('industry', { required: 'Company Name is required' })}
                  {...register('industry')}
                  onChange={(e) => { setIndustryFilled(e.target.value) }} // Track company selection
                  value={industryFilled} // Bind selected value
                >
                  <option value="">{industryFilled}</option>
                  {industries?.map((industry: ApiType) => (
                    <option key={industry.id} value={industry.name}>
                      {industry.name}
                    </option>
                  ))}
                  <option value="Others">Others</option> {/* Add "Others" option */}
                </select>
              </label>
              {errors.industry && <p className="text-red-600">{errors.industry.message}</p>}

              {/* Conditionally Render Custom Industry Name Input */}
              {industryFilled === 'Others' && (
                <div className='flex flex-col w-full gap-3 my-4'>
                  <label htmlFor="customCompanyName" className="input input-bordered bg-white text-black flex items-center gap-2">
                    <span className="font-semibold text-green-700 flex items-center">
                      Custom Industry Name &nbsp;
                      <TiArrowRight className='mt-1' />
                    </span>
                    <input
                      id="customIndustry"
                      // value={selectedCompany}
                      type="text"
                      className="grow"
                      {...register('industry', { required: 'Industry name is required' })}
                    />
                  </label>
                  {errors.industry && <p className="text-red-600">{errors.industry.message}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            {/* Company Name Dropdown */}
            <div className="w-full">
              <label htmlFor="company_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className="font-semibold text-green-700 flex justify-between items-center">
                  Company Name &nbsp; <TiArrowRight className="mt-1" />
                </span>
                <select
                  id="company_name"
                  className="grow h-full bg-white"
                  // {...register('company_name', { required: 'Company Name is required' })}
                  {...register('company_name')}
                  // value={selectedCompany} // Bind selected value
                  onChange={(e)=>setCompanyFilled(e.target.value)} // Track company selection
                  value={companyFilled}
                  // defaultValue={companyFilled}
                >
                  <option value="">{companyFilled}</option>
                  {companies?.map((company: ApiType) => (
                    <option key={company.id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                  <option value="Others">Others</option> {/* Add "Others" option */}
                </select>
              </label>
              {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}

              {/* Conditionally Render Custom Company Name Input */}
              {companyFilled === 'Others' && (
                <div className='flex flex-col w-full gap-3 my-4'>
                  <label htmlFor="customCompanyName" className="input input-bordered bg-white text-black flex items-center gap-2">
                    <span className="font-semibold text-green-700 flex items-center">
                      Custom Company Name &nbsp;
                      <TiArrowRight className='mt-1' />
                    </span>
                    <input
                      id="customCompanyName"
                      // value={selectedCompany}
                      type="text"
                      className="grow"
                      {...register('company_name', { required: 'Company name is required' })}
                    />
                  </label>
                  {errors.company_name && <p className="text-red-600">{errors.company_name.message}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            {/* Job Title Dropdown */}
            <div className="w-full">
              <label htmlFor="job_title" className="input input-bordered bg-white text-black flex items-center gap-2">
                <span className="font-semibold text-green-700 flex justify-between items-center">
                  Job Title &nbsp;
                  <TiArrowRight className="mt-1" />
                </span>
                <select
                  id="job_title"
                  className="grow h-full bg-white"
                  // {...register('job_title', { required: 'Job Title is required' })}
                  {...register('job_title')}
                  onChange={(e) => { setJobFilled(e.target.value) }} // Track job title selection
                  value={jobFilled} // Bind selected value
                >
                  <option value="">{jobFilled}</option>
                  {jobTitles?.map((job: ApiType) => (
                    <option key={job.id} value={job.name}>
                      {job.name}
                    </option>
                  ))}
                  {/* <option defaultValue="Others">{selectedJobTitle==="Others"?selectedJobTitle:"Others"}</option> Add "Others" option */}
                </select>
              </label>
              {errors.job_title && <p className="text-red-600">{errors.job_title.message}</p>}

              {/* Conditionally Render Custom Job Title Input */}
              {jobFilled === 'Others' && (
                <div className="flex flex-col w-full gap-3 my-4">
                  <label htmlFor="customJobTitle" className="input input-bordered bg-white text-black flex items-center gap-2">
                    <span className="font-semibold text-green-700 flex items-center">
                      Custom Job Title &nbsp;
                      <TiArrowRight className="mt-1" />
                    </span>
                    <input
                      id="customJobTitle"
                      type="text"
                      // value={selected}
                      className="grow"
                      {...register('job_title', { required: 'Job title is required' })}
                    />
                  </label>
                  {errors.job_title && <p className="text-red-600">{errors.job_title.message}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            <label htmlFor="phone_number" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Phone Number &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="phone_number" type="tel" className="grow" {...register('phone_number', { required: 'Phone Number is required' })} />
            </label>
            {errors.phone_number && <p className="text-red-600">{errors.phone_number.message}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="alternate_mobile_number" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Alternate Phone Number &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="alternate_mobile_number" type="tel" className="grow" {...register('alternate_mobile_number')} />
            </label>
            {errors.alternate_mobile_number && <p className="text-red-600">{errors.alternate_mobile_number.message}</p>}
          </div>
        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            <label htmlFor="website" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Website &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="website" type="url" className="grow" {...register('website')} />
            </label>
            {errors.website && <p className="text-red-600">{errors.website.message}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="linkedin_page_link" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">LinkedIn Profile Link &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="linkedin_page_link" type="url" className="grow" {...register('linkedin_page_link')} />
            </label>
            {errors.linkedin_page_link && <p className="text-red-600">{errors.linkedin_page_link.message}</p>}
          </div>
        </div>

        <div className='flex w-full gap-3'>
          <div className="w-full">
            <label htmlFor="employee_size" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Employee Size &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="employee_size" type="number" className="grow" {...register('employee_size')} />
            </label>
            {errors.employee_size && <p className="text-red-600">{errors.employee_size.message}</p>}
          </div>

          <div className="w-full">
            <label htmlFor="company_turn_over" className="input input-bordered bg-white text-black flex items-center gap-2">
              <span className="font-semibold text-green-700 flex justify-between items-center">Company Turn Over &nbsp; <TiArrowRight className='mt-1' /> </span>
              <input id="company_turn_over" type="number" className="grow" {...register('company_turn_over')} />
            </label>
            {errors.company_turn_over && <p className="text-red-600">{errors.company_turn_over.message}</p>}
          </div>
        </div>

        <div className="w-1/2">
          <label htmlFor="status" className="input input-bordered bg-white text-black flex items-center gap-2">
            <span className="font-semibold text-green-700 flex justify-between items-center">Status &nbsp; <TiArrowRight className='mt-1' /> </span>
            <select id="status" className="grow h-full bg-white" {...register('status', { required: 'Status is required' })}>
              {/* <option value={status}>{status}</option> */}
              <option value="speaker">Speaker</option>
              <option value="panelist">Panellist</option>
              <option value="sponsor">Sponsor</option>
              <option value="delegate">Delegate</option>
              <option value="moderator">Moderator</option>
              <option value="awardswinner">Awwards Winner</option>
            </select>
          </label>
          {errors.status && <p className="text-red-600">{errors.status.message}</p>}
        </div>

        <div className="col-span-3 flex justify-center mt-4">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditAttendee;