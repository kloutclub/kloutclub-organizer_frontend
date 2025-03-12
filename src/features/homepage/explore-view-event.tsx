import React, { useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import { IoMdArrowForward } from 'react-icons/io';
import { IoLocationSharp } from 'react-icons/io5';
import Invite from "./invite.svg";
import { useParams } from 'react-router-dom';
import { convertDateFormat } from './utils';
import axios from 'axios';
import GoogleMapComponent from './GoogleMapComponent';
import Loader from '../../component/Loader';
import { domain } from './constants';
import { apiKey } from './constants';
import Footer from './Footer';

type EventType = {
    id: number;
    uuid: string;
    user_id: number;
    company_name: string;
    title: string;
    description: string;
    event_date: string;
    location: string;
    start_time: string;
    start_time_type: string;
    end_time: string;
    end_time_type: string;
    image: string;
    event_venue_name: string;
    event_venue_address_1: string;
    event_venue_address_2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    created_at: string;
    updated_at: string;
    status: number;
    end_minute_time: string;
    start_minute_time: string;
    qr_code: string;
    start_time_format: string;
    feedback: number;
    event_start_date: string;
    event_end_date: string;
    why_attend_info: string | null;
    more_information: string | null;
    t_and_conditions: string | null;
    slug: string;
    google_map_link: string;
    total_attendee: number;
    total_accepted: number;
    total_not_accepted: number;
    total_rejected: number;
    paid_event: number,
    event_fee: string
}


type attendeeType = {
    uuid: string;
    title: string;
    first_name: string;
    job_title: string;
    company_name: string;
    email_id: string;
    alternate_email: string;
    phone_number: string;
    alternate_mobile_number: string;
    status: string;
    last_name: string;
    check_in: number;
    check_in_time: string;
    check_in_second: number;
    check_in_second_time: string;
    check_in_third: number;
    check_in_third_time: string;
    check_in_forth: number;
    check_in_forth_time: string;
    check_in_fifth: number;
    check_in_fifth_time: string;
    event_name: string;
    not_invited: boolean;
    image: string;
    id: number;
};

interface ApiType {
    created_at: string;
    id: number;
    name: string;
    parent_id: number;
    updated_at: string;
    uuid: string;
}

// Define the AgendaType interface
type AgendaType = {
    id: number;
    uuid: string;
    event_id: number;
    title: string;
    description: string;
    event_date: string;
    start_time: string;
    start_time_type: string;
    end_time: string;
    end_time_type: string;
    image_path: string;
    created_at: string;
    updated_at: string;
    start_minute_time: string;
    end_minute_time: string;
    position: number;
    speakers: attendeeType[];
};

const ExploreViewEvent: React.FC = () => {

    const { slug } = useParams<{ slug: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);
    const startTime = currentEvent?.event_date || "";
    const [agendaData, setAgendaData] = useState<AgendaType[]>([]);
    const [center, setCenter] = useState<{ lat: number; lng: number }>({
        lat: -3.745,  // Default latitude (you can change it to a default location)
        lng: -38.523, // Default longitude
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFeesPaid, setIsFeesPaid] = useState<Boolean>(false);
    const [paymentUrl, setPaymentUrl] = useState<string>('');
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [count, setCount] = useState(0)

    const modalRef = useRef<HTMLDialogElement>(null);

    const [formErrors, setFormErrors] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email_id: '',
        company_name: '',
        custom_company_name: '',
    });

    const [userDetails, setUserDetails] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        email_id: "",
        company: 0,
        company_name: "",
        acceptence: "1",
        industry: "Others",
    });

    const validateForm = () => {
        let isValid = true;
        const errors = {
            first_name: '',
            last_name: '',
            phone_number: '',
            email_id: '',
            company_name: '',
            custom_company_name: ''
        };

        if (!userDetails.first_name.trim()) {
            errors.first_name = 'First name is required';
            isValid = false;
        }

        if (!userDetails.last_name.trim()) {
            errors.last_name = 'Last name is required';
            isValid = false;
        }

        if (!userDetails.phone_number.trim()) {
            errors.phone_number = 'Mobile number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(userDetails.phone_number)) {
            errors.phone_number = 'Please enter a valid 10-digit mobile number';
            isValid = false;
        }

        if (!userDetails.email_id.trim()) {
            errors.email_id = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(userDetails.email_id)) {
            errors.email_id = 'Please enter a valid email address';
            isValid = false;
        }

        if (!selectedCompany) {
            errors.company_name = 'Please select a company';
            isValid = false;
        }

        if (selectedCompany === 'Others' && !customCompanyName.trim()) {
            errors.custom_company_name = 'Please specify company name';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const [companies, setCompanies] = useState<ApiType[] | undefined>();
    const [selectedCompany, setSelectedCompany] = useState<string | number>('');
    const [customCompanyName, setCustomCompanyName] = useState<string>(''); // New state for custom company name

    useEffect(() => {
        if (slug) {
            try {
                setIsLoading(true);
                axios.get(`${apiBaseUrl}/api/all_events`)
                    .then((res: any) => {
                        setCurrentEvent(res.data.data.find((event: any) => event.slug === slug));
                    })
                    .catch((err: any) => {
                        console.log(err);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [slug]);

    // Extract coordinates from Google Maps link
    const extractCoordinates = async (address: string | undefined) => {
        if (!address) return;

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                return { lat, lng };
            }

            return;
        } catch (error) {
            console.error('Error getting coordinates:', error);
            return;
        }
    };

    useEffect(() => {
        if (currentEvent) {
            axios.get(`${apiBaseUrl}/api/all-agendas/${currentEvent.id}`)
                .then((res) => {
                    if (res.data) {
                        // Sort the data in descending order to show the highest position at the top
                        const sortedData = res.data.data.sort((a: AgendaType, b: AgendaType) => a.position - b.position);
                        setAgendaData(sortedData);

                        extractCoordinates(currentEvent?.event_venue_address_1).then((coords) => {
                            if (coords) {
                                setCenter(coords);
                            }
                        })
                    }
                })
        }
    }, [currentEvent]);

    useEffect(() => {
        console.log("The center is: ", center);
    }, [center]);

    // Handle Input Changes
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name === "company_name") {
            setSelectedCompany(value);
        }

        if (name === "custom_company_name") {
            setCustomCompanyName(value);
        }

        setUserDetails((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Clear error when user starts typing
        setFormErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    useEffect(() => {
        axios.get(`${domain}/api/companies`).then(res => setCompanies(res.data.data));
    }, []);

    const allSpeakers = agendaData.flatMap((agenda) =>
        agenda.speakers.map((speaker) => ({
            first_name: speaker.first_name,
            last_name: speaker.last_name,
            company_name: speaker.company_name,
            job_title: speaker.job_title,
            image: speaker.image
        }))
    );

    useEffect(() => {
        // Extract coordinates from Google Maps link
        const extractCoordinates = (url: string | undefined) => {
            if (!url) return null;
            const regex = /https:\/\/maps\.app\.goo\.gl\/([a-zA-Z0-9]+)/;
            const match = url.match(regex);
            if (match) {
                const encodedUrl = decodeURIComponent(match[1]);
                const coordsRegex = /@([-+]?\d+\.\d+),([-+]?\d+\.\d+)/;
                const coordsMatch = encodedUrl.match(coordsRegex);
                if (coordsMatch) {
                    const lat = parseFloat(coordsMatch[1]);
                    const lng = parseFloat(coordsMatch[2]);
                    return { lat, lng };
                }
            }
            return null;
        };

        if (currentEvent) {
            const coords = extractCoordinates(currentEvent?.google_map_link);
            if (coords) {
                setCenter(coords);
            }
        }
    }, [currentEvent]);

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
            setIsModalOpen(false);
        }
    };

    // const handleIframeLoad = () => {
    //     const iframe = iframeRef.current;
    //     if (iframe) {
    //         try {
    //             const url = iframe.contentWindow?.location.href;
    //             if (url?.includes('https://www.klout.club/')) {
    //                 if (count !== 0) {
    //                     setIsFeesPaid(true);
    //                     openModal();
    //                 } else {
    //                     setPaymentUrl("");
    //                     Swal.fire({
    //                         title: "Payment Successful",
    //                     });
    //                     setCount(1);
    //                 }
    //             } else if (url?.includes('cancel')) {
    //                 // If payment was cancelled, reset payment state and close iframe
    //                 setPaymentUrl('');
    //                 setIsFeesPaid(false);
    //                 setCount(0);
    //                 // Force iframe to reload to clear its history
    //                 if (iframe.contentWindow) {
    //                     iframe.contentWindow.location.reload();
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error accessing iframe content:', error);
    //         }
    //     }
    // };

    const handleIframeLoad = () => {
        // console.log('Iframe loaded');
        if (count !== 0) {
            openModal();
            setPaymentUrl("");
            setIsFeesPaid(true);
        } else {
            setCount(1)
        }

        // Assume some changes based on the iframe's load status
        // Perhaps attempt verification from the backend here
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {

            if (currentEvent?.paid_event === 1) {
                if (isFeesPaid) {
                    try {
                        // Form is valid, proceed with submission
                        const companyId = companies?.find(company => company.name === selectedCompany);
                        const newObj = {
                            ...userDetails,
                            company: companyId?.id,
                            company_name: selectedCompany === "Others" ? customCompanyName : selectedCompany,
                            event_uuid: currentEvent?.uuid
                        };

                        const response = await axios.post(`${domain}/api/request_event_invitation`, {
                            ...newObj
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        if (response.data.status === 200) {
                            swal({
                                title: "Success",
                                text: response.data.message || "Registration Successful",
                                icon: "success",
                            });
                            closeModal();
                            setPaymentUrl('');
                            setIsFeesPaid(false);
                            setCount(0);
                            window.location.reload();
                        } else {
                            alert("Something went wrong with registration");
                            swal({
                                title: "Error",
                                text: response.data.message || "Something went wrong with registration",
                                icon: "error",
                            });
                        }
                    } catch (error) {
                        swal({
                            title: "Error",
                            text: "An error occurred during registration",
                            icon: "error",
                        });
                    } finally {
                        setIsLoading(false);
                    }
                } else {
                    try {
                        const response = await axios.post('https://app.klout.club/api/v1/payment/purchase-event-plan', {
                            firstName: userDetails.first_name,
                            email: userDetails.email_id,
                            mobileNumber: userDetails.phone_number,
                            amount: `${currentEvent.event_fee}.00`
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.data.status) {
                            closeModal();
                            setPaymentUrl(response.data.redirectUrl);
                        }
                    } catch (error) {
                        swal({
                            title: "Error",
                            text: "Payment initiation failed. Please try again.",
                            icon: "error",
                        });
                    }
                }
            } else {
                try {
                    // Form is valid, proceed with submission
                    const companyId = companies?.find(company => company.name === selectedCompany);
                    const newObj = {
                        ...userDetails,
                        company: companyId?.id,
                        company_name: selectedCompany === "Others" ? customCompanyName : selectedCompany,
                        event_uuid: currentEvent?.uuid
                    };

                    const response = await axios.post(`${domain}/api/request_event_invitation`, {
                        ...newObj
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.data.status === 200) {
                        swal({
                            title: "Success",
                            text: response.data.message || "Registration Successful",
                            icon: "success",
                        });
                    } else {
                        swal({
                            title: "Error",
                            text: response.data.message || "Something went wrong with registration",
                            icon: "error",
                        });
                    }
                    closeModal();
                } catch (error) {
                    swal({
                        title: "Error",
                        text: "An error occurred during registration",
                        icon: "error",
                    });
                } finally {
                    setIsLoading(false);
                }
            }

        }
    };

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isModalOpen]);

    if (isLoading) {
        return <div className='w-full h-screen flex justify-center items-center'>
            <Loader />
        </div>
    }

    return (
        <div className='w-full h-full overflow-auto top-0 absolute left-0 bg-brand-foreground text-black'>

            {/* Render Iframe for Payment */}
            {paymentUrl && (
                <div className="fixed inset-0 w-full h-full z-50">
                    <iframe
                        ref={iframeRef}
                        src={paymentUrl}
                        className="w-full h-full border-none"
                        title="Payment"
                        onLoad={handleIframeLoad}
                    />
                </div>
            )}

            <div className='!text-black w-full z-30 fixed top-0 left-0'>
                <Navbar />
            </div>

            <div className='max-w-screen-lg flex flex-col-reverse md:flex-row p-5 gap-7 justify-center !mx-auto mt-20 space-y-4'>
                {/* Left Div */}
                <div className='space-y-4'>
                    <span className='text-gray-700 text-sm'>By {currentEvent?.company_name}</span>

                    <h1 className='text-2xl font-semibold flex items-center gap-2 !mt-0'>{currentEvent?.title} {currentEvent?.paid_event === 1 && <div className="badge badge-soft badge-info">Paid</div>}</h1>

                    {/* Row for Start Date */}
                    <div className='flex gap-2'>
                        <div className='rounded-md grid place-content-center size-10 bg-white'>
                            <p className='uppercase text-orange-500 font-semibold text-xs'>
                                {new Date(startTime).toLocaleString('en-US', {weekday: 'short'}).toUpperCase()}
                            </p>
                            <p className='text-2xl leading-none font-semibold text-brand-gray'>
                                {new Date(startTime).getDate()}
                            </p>
                        </div>
                        <div>
                            <h4 className='font-semibold'>{convertDateFormat(startTime)}</h4>
                            <p className='text-sm text-brand-gray'>{currentEvent?.start_time}:{currentEvent?.start_minute_time}  {currentEvent?.start_time_type} - {currentEvent?.end_time}:{currentEvent?.end_minute_time} {currentEvent?.end_time_type}</p>
                        </div>
                    </div>

                    {/* Row for Location */}
                    <div className='flex gap-2'>
                        <a href={currentEvent?.google_map_link} className='flex gap-2'>
                            <div className='rounded-md grid place-content-center size-10 bg-white'>
                                <IoLocationSharp size={30} className='text-brand-gray' />
                            </div>

                            <div>
                                <h4 className='font-semibold flex items-center'>{currentEvent?.event_venue_name} <IoMdArrowForward size={20} className='-rotate-45' /></h4>
                                <p className='text-sm text-brand-gray'>{currentEvent?.city}, {currentEvent?.pincode}</p>
                            </div>
                        </a>
                    </div>

                    {/* Row for Registration */}
                    <div className='border border-white rounded-[10px]'>
                        <p className='text-sm p-[10px]'>
                            {new Date(currentEvent?.event_date || '') < new Date() ?
                                'Registration Closed' :
                                'Registration'
                            }
                        </p>

                        <div className={`rounded-b-[10px] bg-white ${new Date(currentEvent?.event_date || '') < new Date() ? 'opacity-50' : ''}`}>

                            <div className={`flex gap-2 p-[10px] border-b ${new Date(currentEvent?.event_date || '') < new Date() ? 'blur-[2px]' : ''}`}>
                                <div className='rounded-md grid place-content-center size-10 bg-white'>
                                    {/* < size={30} className='text-brand-gray' /> */}
                                    <img src={Invite} alt="Invite" />
                                </div>

                                <div className=''>
                                    <h4 className='!font-semibold flex items-center'>Pending Approval</h4>
                                    <p className='text-sm -mt-1'>Your registration requires approval from the host.</p>
                                </div>
                            </div>

                            <div className={`p-[10px] ${new Date(currentEvent?.event_date || '') < new Date() ? 'blur-[2px]' : ''}`}>
                                <p className='text-sm'>{currentEvent?.paid_event === 1 ? "This is a paid event, click below to pay the registration fees and get an invite" : "Welcome! Register below to request event access."}</p>
                                {/* <button className="btn" onClick={openModal}>open modal</button> */}
                                <button
                                    className='w-full mt-[10px] p-3 bg-brand-primary rounded-lg text-white'
                                    onClick={openModal}
                                    disabled={new Date(currentEvent?.event_date || '') < new Date()}
                                >
                                    Get an Invite
                                </button>
                                <dialog ref={modalRef} className="modal">
                                    <div className="modal-box bg-brand-lightBlue">
                                        <div className=''>

                                            <h1 className='text-2xl font-semibold text-center'>Registration For Event</h1>

                                            <form onSubmit={handleSubmit} className='my-10 space-y-5 overflow-y-scroll max-h-96 hide-scrollbar overflow-hidden'>
                                                {/* User Name */}
                                                <div className='flex gap-5 flex-col sm:flex-row w-full'>
                                                    {/* First Name */}
                                                    <div className='flex flex-col w-full'>
                                                        <span className='text-sm'>First Name</span>
                                                        <input
                                                            type="text"
                                                            name='first_name'
                                                            value={userDetails.first_name}
                                                            onChange={handleChange}
                                                            className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${formErrors.first_name ? 'border-red-500' : ''}`}
                                                        />
                                                        {formErrors.first_name && <span className="text-red-500 text-xs">{formErrors.first_name}</span>}
                                                    </div>

                                                    {/* Last Name */}
                                                    <div className='flex flex-col w-full'>
                                                        <span className='text-sm'>Last Name</span>
                                                        <input
                                                            type="text"
                                                            name='last_name'
                                                            value={userDetails.last_name}
                                                            onChange={handleChange}
                                                            className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${formErrors.last_name ? 'border-red-500' : ''}`}
                                                        />
                                                        {formErrors.last_name && <span className="text-red-500 text-xs">{formErrors.last_name}</span>}
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div className='flex gap-5 flex-col sm:flex-row w-full'>
                                                    <div className='flex flex-col w-full'>
                                                        <span className='text-sm'>Email</span>
                                                        <input
                                                            type="email"
                                                            name='email_id'
                                                            value={userDetails.email_id}
                                                            onChange={handleChange}
                                                            className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${formErrors.email_id ? 'border-red-500' : ''}`}
                                                        />
                                                        {formErrors.email_id && <span className="text-red-500 text-xs">{formErrors.email_id}</span>}
                                                    </div>

                                                    {/* Phone No. */}
                                                    <div className='flex flex-col w-full'>
                                                        <span className='text-sm'>Phone No.</span>
                                                        <input
                                                            type="tel"
                                                            name='phone_number'
                                                            value={userDetails.phone_number}
                                                            onChange={handleChange}
                                                            className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${formErrors.phone_number ? 'border-red-500' : ''}`}
                                                        />
                                                        {formErrors.phone_number && <span className="text-red-500 text-xs">{formErrors.phone_number}</span>}
                                                    </div>
                                                </div>

                                                {/* Company Name */}
                                                <div className='flex gap-5 flex-col sm:flex-row w-full'>
                                                    <div className='flex flex-col w-full'>
                                                        <span className='text-sm'>Company Name</span>
                                                        <select
                                                            name="company_name"
                                                            value={selectedCompany}
                                                            onChange={handleChange}
                                                            id="company_name"
                                                            className={`bg-white px-3 py-1 w-full focus:outline-none rounded-lg ${formErrors.company_name ? 'border-red-500' : ''}`}
                                                        >
                                                            <option value="">Select Company</option>
                                                            {companies?.map((company) => (
                                                                <option key={company.id} value={company.name}>{company.name}</option>
                                                            ))}
                                                            <option value="Others">Others</option>
                                                        </select>
                                                        {formErrors.company_name && <span className="text-red-500 text-xs">{formErrors.company_name}</span>}
                                                    </div>

                                                    {/* Custom Company Name */}
                                                    {selectedCompany === "Others" && (
                                                        <div className='flex flex-col w-full'>
                                                            <span className='text-sm'>Specify Company Name</span>
                                                            <input
                                                                type="text"
                                                                name='custom_company_name'
                                                                value={customCompanyName}
                                                                onChange={handleChange}
                                                                className={`rounded-lg bg-white px-3 py-1 w-full focus:outline-none ${formErrors.custom_company_name ? 'border-red-500' : ''}`}
                                                            />
                                                            {formErrors.custom_company_name && <span className="text-red-500 text-xs">{formErrors.custom_company_name}</span>}
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    type="submit"
                                                    className='w-full py-1 bg-brand-primary text-white rounded-lg'
                                                >
                                                    Register
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                                        <button>close</button>
                                    </form>
                                </dialog>
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className='mt-6'>
                        <h3 className='font-semibold text-lg'>Event Details</h3>
                        <hr className='border-t-2 border-white my-[10px]' />

                        <p className='text-brand-gray'>{currentEvent?.description}</p>
                    </div>

                    {/* Agenda Details */}
                    <div className='mt-6'>
                        <h3 className='font-semibold text-lg'>Agenda Details</h3>
                        <hr className='border-t-2 border-white !my-[10px]' />


                        {/* Single Day Agenda Details */}
                        <div>
                            {/* <div className='p-2 bg-white rounded-lg font-semibold'>
                                Day 1 (Friday, 17th Jan 2025)
                            </div> */}

                            {/* All Rows Wrapper */}
                            <div>
                                {/* Single Row */}
                                {agendaData.length > 0 ? agendaData.map((agenda) => (
                                    <div key={agenda.id} className='!my-4'>
                                        <h5 className='font-semibold'>{agenda?.start_time}:{agenda?.start_minute_time}  {agenda?.start_time_type} - {agenda?.end_time}:{agenda?.end_minute_time} {agenda?.end_time_type}</h5>
                                        <p className='font-light'>{agenda.description}</p>

                                        {/* All Images */}
                                        <div className='flex gap-5 my-3'>
                                            <div className='grid grid-cols-2 gap-5'>
                                                {agenda.speakers.map((speaker) => (
                                                    <div key={speaker.id} className='flex gap-3 max-w-80 text-ellipsis overflow-hidden text-nowrap'>
                                                        <img src={`${apiBaseUrl}/${speaker.image}`} alt="user" className='size-14 rounded-full' />
                                                        <div className='space-y-1'>
                                                            <p className='font-semibold text-lg leading-none'>{speaker.first_name} {speaker.last_name}</p>
                                                            <p className='text-sm leading-none'>{speaker.company_name}</p>
                                                            <p className='text-xs leading-none'>{speaker.job_title}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )) : <p className='text-brand-gray mb-10'>No agenda available</p>}
                            </div>
                        </div>

                    </div>

                    {/* Speakers */}
                    <div className='mt-6'>
                        <h3 className='font-semibold text-lg'>Agenda Speakers</h3>
                        <hr className='border-t-2 border-white !my-[10px]' />


                        {/* All Speakers */}
                        <div className='grid grid-cols-4 gap-5 justify-between'>

                            {/* Single Speaker Deatils */}
                            {allSpeakers.length > 0 ? allSpeakers.map((speaker, index) => (
                                <div key={index} className='max-w-60 max-h-96 overflow-hidden text-ellipsis text-center'>
                                    <img src={apiBaseUrl + "/" + speaker.image} alt="Speaker" className='rounded-full mx-auto size-24' />
                                    <p className='font-semibold overflow-hidden text-ellipsis whitespace-nowrap'>{speaker.first_name + ' ' + speaker.last_name}</p>
                                    <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{speaker.job_title}</p>
                                    <p className='text-sm font-light overflow-hidden text-ellipsis whitespace-nowrap'>{speaker.company_name}</p>
                                </div>
                            )) : <p className='text-brand-gray mb-10 text-nowrap'>No speakers available</p>}
                        </div>
                    </div>
                </div>

                {/* Right Div */}
                <div className='max-w-full mx-auto md:max-w-[300px]'>
                    <img src={apiBaseUrl + "/" + currentEvent?.image} alt="Background Image" className='rounded-lg w-60 mx-auto md:w-full' />

                    <div className='mt-10 md:mt-[5.8rem]'>
                        <h3 className='font-semibold text-lg'>Location</h3>
                        <hr className='border-t-2 border-white !my-[10px]' />
                        <p className='text-brand-gray'><strong className='text-black'>{currentEvent?.event_venue_name}</strong> <br />
                            {currentEvent?.event_venue_address_2}</p>
                        <div className='rounded-lg w-full h-full mt-[10px] p-2 overflow-hidden md:w-[300px] md:h-[300px]'>
                            <GoogleMapComponent center={center} zoom={18} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='p-5'>
                <Footer />
            </div>
        </div>
    )
}

export default ExploreViewEvent;
