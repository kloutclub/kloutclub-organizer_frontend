import { useEffect, useRef, useState } from 'react';
import { Image } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import Template1 from "/templates/template_1.jpg";
import Template2 from "/templates/template_2.jpg";
import Template3 from "/templates/template_3.jpg";
import Template4 from "/templates/template_4.jpg";
import Template5 from "/templates/template_5.jpg";
import React from 'react';
import AccountCreate from './AccountCreate';
import axios from 'axios';
import { apiKey, domain, options } from './constants';
import { formatDate, formatTime } from './utils';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import WhiteLogo from "/white_logo.png";
import { Heart } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import GoogleMapComponent from './GoogleMapComponent';

interface FormUI {
    title: string;
    image: File | string | null; // This can be either a File from the file input or a string for selected template URLs
    description: string;
    event_start_date: string;
    event_end_date: string;
    event_date: string;
    start_time: string; // New field for formatted start time (e.g., '16:05')
    start_minute_time: string; // New field for start time minute part (e.g., '05')
    start_time_type: string; // New field for AM/PM designation (e.g., 'PM')
    end_time: string; // New field for formatted end time (e.g., '17:05')
    end_minute_time: string; // New field for end time minute part (e.g., '05')
    end_time_type: string; // New field for AM/PM designation (e.g., 'PM')
    status: number;
    feedback: number;
    event_otp: string;
    paid_event: number;
    event_fee: string;
    view_agenda_by: number;
}

const addGoogleMapsScript = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
};

addGoogleMapsScript();

const AddEvent: React.FC = () => {
    // State to hold form data
    const [formData, setFormData] = useState<FormUI>({
        title: '',
        image: null,
        description: '',
        event_start_date: '',
        event_end_date: '',
        event_date: '',
        start_time: '', // New field
        start_minute_time: '', // New field
        start_time_type: '', // New field
        end_time: '', // New field
        end_minute_time: '', // New field
        end_time_type: '', // New field
        feedback: 1,
        status: 1,
        event_otp: "000000",
        view_agenda_by: 0,
        paid_event: 0,
        event_fee: "0",
    });
    const navigate = useNavigate();
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [color, setColor] = useState<string>("#FFFFFF");
    const [textSize, setTextSize] = useState<number>(20);
    const { token } = useSelector((state: RootState) => state.auth);
    const [userLoginDetails,] = useState({
        email: "",
        password: ""
    });
    const formRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useRef<HTMLDialogElement | null>(null);

    const year = new Date().getFullYear();
    const nextYear = (new Date().getFullYear() + 1) % 100;

    const openModal = () => {
        const modal = modalRef.current;
        if (modal) {
            modal.showModal();
        }
    };

    const closeModal = () => {
        const modal = modalRef.current;
        if (modal) {
            modal.close();
        }
    };

    const [selectedStartTime, setSelectedStartTime] = useState({
        formattedHour: "00",
        formattedMinutes: "00",
        ampm: "AM"
    });

    const [selectedEndTime, setSelectedEndTime] = useState({
        formattedHour: "00",
        formattedMinutes: "00",
        ampm: "AM"
    });

    const [creatingBanner, setCreatingBanner] = useState<boolean>(false);
    const [, setShowRegistrationPopup] = useState<boolean>(false);
    const [isPopupComplete,] = useState<boolean>(false);


    // Google Maps Location
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [locationInfo, setLocationInfo] = useState<any>(null);
    const [location, setLocation] = useState<string>("");
    const [center, setCenter] = useState<{ lat: number; lng: number }>({
        lat: -3.745,  // Default latitude (you can change it to a default location)
        lng: -38.523, // Default longitude
    });


    // const [createAccount, setCreateAccount] = useState<boolean>(false);
    const templates = [Template1, Template2, Template3, Template4, Template5];
    const imageRef = useRef<HTMLDivElement | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [templateImageData, setTemplateImageData] = useState<string | undefined>(undefined);

    const handleStartDateChange = (e: any) => {
        setFormData((prev) => ({
            ...prev,
            event_start_date: e.target.value,
        }));
        const formatted = formatDate(e.target.value);
        setSelectedStartDate(formatted);
    };

    const handleEndDateChange = (e: any) => {
        setFormData((prev) => ({
            ...prev,
            event_end_date: e.target.value,
        }));
        const formatted = formatDate(e.target.value);
        setSelectedEndDate(formatted);
    };

    const handleStartTimeChange = (e: any) => {
        const formattedTime = formatTime(e.target.value);
        setFormData((prev) => ({
            ...prev,
            start_time: formattedTime.formattedHour,
            start_time_type: formattedTime.ampm,
            start_minute_time: formattedTime.formattedMinutes
        }));

        console.log(formData);
        setSelectedStartTime(formattedTime);
    };

    const handleEndTimeChange = (e: any) => {
        const formattedTime = formatTime(e.target.value);
        setFormData((prev) => ({
            ...prev,
            end_time: formattedTime.formattedHour,
            end_time_type: formattedTime.ampm,
            end_minute_time: formattedTime.formattedMinutes
        }));

        console.log(formData);
        setSelectedEndTime(formattedTime);
    };

    // State for validation errors
    const [errors, setErrors] = useState<any>({});

    // Handle input change
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        // Reset the specific error when the user starts typing in the field
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: '', // Clear the error for this field
        }));

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    // Handle file input (for the banner image)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const image = URL.createObjectURL(file);
            setSelectedImage(image);
            setFormData((prevData) => ({
                ...prevData,
                image: file,
            }));
        }
    };

    // Handle Templates Change
    const handleTemplateChange = (template: string) => {
        setSelectedImage(template);
        if (imageRef.current) {
            // Generate the image from the HTML content
            htmlToImage.toPng(imageRef.current).then((dataUrl) => {
                setTemplateImageData(dataUrl);
            });
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (templateImageData) {
            // Convert the Data URL to a Blob
            fetch(templateImageData)
                .then((res) => res.blob())
                .then((blob) => {
                    const image = URL.createObjectURL(blob);
                    const file = new File([blob], 'image.png', { type: 'image/png' });
                    console.log("The file is: ", file);
                    setSelectedImage(image);
                    setFormData((prevData) => ({
                        ...prevData,
                        image: file,
                    }));
                })
                .catch((err) => console.error('Error converting Data URL to Blob:', err));
        }

        // Update the data directly before making the request
        // const updatedFormData = {
        //     ...formData,
        //     event_venue_address_2: formData.event_venue_address_1,
        //     event_date: formData.event_start_date,
        // };


        // Validate form data
        let validationErrors: any = {};

        // Check if all required fields are filled
        if (!formData.title) validationErrors.title = 'Event Name is required.';
        if (!formData.image) validationErrors.image = 'Banner is required.';
        if (!formData.description) validationErrors.description = 'Description is required.';
        if (!formData.event_start_date) validationErrors.event_start_date = 'Start Date is required.';
        if (!formData.event_end_date) validationErrors.event_end_date = 'End Date is required.';
        if (!formData.start_time) validationErrors.start_time = 'Start Time is required.'; // Updated field name
        if (!formData.start_minute_time) validationErrors.start_minute_time = 'Start Minute is required.'; // Updated field name
        if (!formData.start_time_type) validationErrors.start_time_type = 'Start Time Type is required.'; // Updated field name
        if (!formData.end_time) validationErrors.end_time = 'End Time is required.'; // Updated field name
        if (!formData.end_minute_time) validationErrors.end_minute_time = 'End Minute is required.'; // Updated field name
        if (!formData.end_time_type) validationErrors.end_time_type = 'End Time Type is required.'; // Updated field name
        if (!locationInfo) validationErrors.locationInfo = 'Location is required.'; // Updated field name

        // If validation fails, set the errors state
        // If validation fails, set the errors state and scroll to top
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            // Scroll to the top of the form or a specific element
            if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth' });
            }

            return;
        }

        let city;
        let state;
        let country;
        let pincode;

        locationInfo.address_components.forEach((component: any) => {
            const types = component.types;
            if (types.includes('locality')) {
                city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
                state = component.long_name;
            }
            if (types.includes('country')) {
                country = component.long_name;
            }
            if (types.includes('postal_code')) {
                pincode = component.long_name;
            }
        });

        const updatedFormData = {
            ...formData,
            event_date: formData.event_start_date,
            event_venue_name: locationInfo.name,
            event_venue_address_1: locationInfo.formatted_address,
            event_venue_address_2: locationInfo.vicinity,
            state,
            city,
            country,
            pincode,
            google_map_link: locationInfo.url
        };

        // console.log("The updated form data is: ", updatedFormData);


        // return;


        if (!token) {
            openModal();
            setShowRegistrationPopup(true);
        }

        if (isPopupComplete || token) {
            console.log("The token is:", token);
            try {
                console.log("The form data for event creation is: ", updatedFormData);
                const response = await axios.post(`${domain}/api/events`, updatedFormData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log("The response is: ", response.data);
                alert("Event Created Successfully");

                setFormData({
                    title: '',
                    image: null,
                    description: '',
                    event_start_date: '',
                    event_end_date: '',
                    event_date: '',
                    start_time: '', // New field
                    start_minute_time: '', // New field
                    start_time_type: '', // New field
                    end_time: '', // New field
                    end_minute_time: '', // New field
                    end_time_type: '', // New field
                    feedback: 1,
                    status: 1,
                    event_otp: "000000",
                    view_agenda_by: 0,
                    paid_event: 0,
                    event_fee: "0",
                });
                validationErrors = [];

                try {
                    const { email, password } = userLoginDetails;
                    axios.post(`${domain}/api/login`, { email, password }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(() => {
                        navigate("/");
                    })
                } catch (error) {
                    // console.log(error);
                    throw error;
                }

            } catch (error) {
                console.error("Error occurred: ", error);
            }
        }
    };


    useEffect(() => {
        if (inputRef.current && window.google) {
            console.log(inputRef.current.value)
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, options);

            // Add listener for when a place is selected
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place && place.name) {
                    setLocationInfo(place);
                    setLocation(place.name);  // Store the place name in the state

                    const longitude = place.geometry?.location?.lng();
                    const latitude = place.geometry?.location?.lat();

                    if (longitude && latitude) {
                        setCenter({
                            lat: latitude,
                            lng: longitude
                        })
                    }
                }
            }
            )
        }
    }, [inputRef.current]); // Only run when the inputRef is set


    return (
        <div className='w-full h-full overflow-auto top-0 absolute left-0 bg-brand-foreground text-black'>
            <Helmet>
                <title>Add Your Event | Effortless Event Setup With Klout Club</title>
                <meta name="title" content="Add Your Event | Effortless Event Setup With Klout Club" />
                <meta name="description" content="Easily add and customize your event with Klout Club. Set up event details, venue, and location - all in one place. Get started today!" />
            </Helmet>
            <div className='!text-black w-full z-30 fixed top-0 left-0'>
                <Navbar />
            </div>

            {/* All Fields Wrapper */}
            <div ref={formRef} className='justify-center w-full items-center md:items-start flex flex-col-reverse md:flex-row gap-5 p-5 absolute top-20'>
                <div className='space-y-5 max-w-screen-sm w-full'>
                    {/* Event Name */}
                    <div className='flex flex-col'>
                        <span className='text-xl'>Event Name</span>
                        <input
                            type="text"
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            className={`rounded-lg bg-white px-3 py-1 focus:outline-none ${errors.title ? 'border-rose-600' : ''}`}
                        />
                        {errors.title && <span className='text-rose-600 text-xs'>{errors.title}</span>}
                    </div>

                    <div className='flex gap-3'>
                        {/* Event Type */}
                        <div className='flex flex-col w-full'>
                            <span className='text-xl'>Event Type</span>
                            <div className='flex items-center gap-3 bg-white rounded-lg px-3 py-1'>
                                <span className='text-sm text-gray-600'>Free</span>
                                <input
                                    type="checkbox"
                                    checked={formData.paid_event === 1}
                                    onChange={(e) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            paid_event: e.target.checked ? 1 : 0,
                                            event_fee: e.target.checked ? "1" : "0" // Set to "1" when switching to paid
                                        }));
                                    }}
                                    className="toggle toggle-md hover:bg-brand-primary bg-brand-primary outline:bg-brand-primary"
                                />
                                <span className='text-sm text-gray-600'>Paid</span>
                            </div>
                        </div>

                        {/* Event Fee */}
                        {formData.paid_event === 1 && (
                            <div className='flex flex-col w-full'>
                                <span className='text-xl'>Event Fee (₹) (min. ₹1)</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.event_fee}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            event_fee: value
                                        }));
                                    }}
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        if (!value || value === "0") {
                                            setFormData(prev => ({
                                                ...prev,
                                                event_fee: "1"
                                            }));
                                        }
                                    }}
                                    className="rounded-lg bg-white px-3 py-1 focus:outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* Banner */}
                    <div className='flex flex-col'>
                        <span className='text-xl'>Banner</span>
                        <div className='flex gap-2 md:gap-5 flex-col md:flex-row items-center'>
                            <input
                                name='image'
                                type='file'
                                disabled={creatingBanner}
                                onChange={handleFileChange}
                                className={`bg-white cursor-pointer w-full px-3 py-1 rounded-lg text-sm ${creatingBanner ? "opacity-50 cursor-not-allowed" : ""} ${errors.image ? 'border-rose-600' : ''}`}
                            />
                            <span>Or</span>
                            <button onClick={() => setCreatingBanner(prev => !prev)} className='px-3 py-1 rounded-lg w-full bg-brand-primary text-white'>
                                {!creatingBanner ? "Create Event Banner" : "Upload Event Banner"}
                            </button>
                        </div>
                        {errors.image && <span className='text-rose-600 text-xs'>{errors.image}</span>}
                    </div>

                    {/* Description */}
                    <div className='flex flex-col'>
                        <span className='text-xl'>Description</span>
                        <textarea
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            id="description"
                            className={`focus:outline-none px-3 py-1 rounded-lg ${errors.description ? 'border-rose-600' : ''}`}
                        />
                        {errors.description && <span className='text-rose-600 text-xs'>{errors.description}</span>}
                    </div>

                    {/* Start & End */}
                    <div className='flex gap-3 max-[964px]:flex-col w-full'>
                        {/* Start Time */}
                        <div className='flex flex-col w-full'>
                            <span className='text-xl'>Start</span>
                            <div className='w-full p-[3px] rounded-[10px] bg-white'>
                                <div className='w-full h-full flex gap-[1px] bg-white border-white rounded-[10px]'>

                                    {/* Date Picker */}
                                    <div className='relative bg-brand-lightBlue rounded-l-[10px] px-3 py-1 w-full'>
                                        <input type='date' onChange={handleStartDateChange} className='w-full custom-input h-full absolute z-20 top-0 left-0 rounded-l-[10px] opacity-0' />
                                        <span className='w-full h-full flex pl-2 items-center absolute left-0 z-10 top-0 rounded-l-[10px]'>{selectedStartDate}</span>
                                    </div>

                                    {/* Time Picker */}
                                    <div className='w-32 bg-brand-lightBlue rounded-r-[10px] px-3 py-1 h-full'>
                                        <div className='h-full relative bg-brand-lightBlue rounded-l-[10px] py-2 w-full'>
                                            <input type="time" name="" id="" onChange={handleStartTimeChange} className='w-full custom-input h-full absolute z-20 top-0 left-0 rounded-l-[10px] opacity-0' />
                                            <span className='w-full h-full flex items-center absolute left-0 z-10 top-0 rounded-l-[10px]'>{`${selectedStartTime.formattedHour}:${selectedStartTime.formattedMinutes}:${selectedStartTime.ampm}`}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {errors.start_time && <span className='text-rose-600 text-xs mt-1'>{errors.start_time}</span>}
                        </div>

                        {/* End Time */}
                        <div className='flex flex-col w-full'>
                            <span className='text-xl'>End</span>
                            <div className='w-full p-[3px] rounded-[10px] bg-white'>
                                <div className='w-full h-full flex gap-[1px] bg-white border-white rounded-[10px]'>

                                    {/* Date Picker */}
                                    <div className='relative bg-brand-lightBlue rounded-l-[10px] px-3 py-1 w-full'>
                                        <input type='date' onChange={handleEndDateChange} className='w-full custom-input h-full absolute z-20 top-0 left-0 rounded-l-[10px] opacity-0' />
                                        <span className='w-full h-full flex pl-2 items-center absolute left-0 z-10 top-0 rounded-l-[10px]'>{selectedEndDate}</span>
                                    </div>

                                    {/* Time Picker */}
                                    <div className='w-32 bg-brand-lightBlue rounded-r-[10px] px-3 py-1 h-full'>
                                        <div className='h-full relative bg-brand-lightBlue rounded-l-[10px] py-2 w-full'>
                                            <input type="time" name="" id="" onChange={handleEndTimeChange} className='w-full custom-input h-full absolute z-20 top-0 left-0 rounded-l-[10px] opacity-0' />
                                            <span className='w-full h-full flex items-center absolute left-0 z-10 top-0 rounded-l-[10px]'>{`${selectedEndTime.formattedHour}:${selectedEndTime.formattedMinutes}:${selectedEndTime.ampm}`}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {errors.end_time && <span className='text-rose-600 text-xs mt-1'>{errors.end_time}</span>}
                        </div>
                    </div>

                    {/* Location */}
                    <div className='flex flex-col gap-5'>
                        <div>
                            <label htmlFor="location" className='text-xl'>Location</label>
                            <input
                                ref={inputRef}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)} // Update the location state while typing
                                type="text"
                                placeholder="Search for a location"
                                className='rounded-lg bg-white px-3 py-1 focus:outline-none w-full'
                            />
                            {errors.locationInfo && <span className='text-rose-600 text-xs mt-1'>{errors.locationInfo}</span>}

                        </div>
                        <div className='rounded-lg overflow-hidden'>
                            <GoogleMapComponent center={center} zoom={12} />
                        </div>
                    </div>

                    <div className='flex items-center justify-center'>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className='px-3 py-1 max-w-60 w-full text-white bg-brand-primary rounded-lg'>
                            Add Event
                        </button>
                    </div>

                    <footer className='w-full mt-10 flex absolute left-0 p-5 justify-between flex-col gap-4 md:flex-row items-center'>
                        <Link to={"/home"}>
                            <img src={WhiteLogo} alt="Klout Club" width={96} height={96} className="filter invert" />
                        </Link>

                        <div className='text-xs lg:text-sm font-light'>
                            <p className='flex gap-1 items-center flex-wrap'>Copyright &copy; {year}-{nextYear} All rights reserved | The Klout Club is made with <Heart size={18} /></p>
                            <div className='flex gap-2 mt-2 items-center justify-center'>
                                <a href="https://www.klout.club/privacypolicy.html" target='_blank' className='underline underline-offset-1'>Privacy Policy</a>
                                <span>|</span>
                                <a href="https://www.klout.club/terms-and-condition" target='_blank' className='underline underline-offset-1'>Terms and Conditions</a>
                                <span>|</span>
                                <a href="https://www.klout.club/cancellation-policy" target='_blank' className='underline underline-offset-1'>Refund Policy</a>
                            </div>
                        </div>

                        <div className='flex gap-4'>
                            <a target='_blank' href="https://www.facebook.com/thekloutclub">
                                <FaFacebookF />
                            </a>
                            <a target='_blank' href="https://www.facebook.com/thekloutclub">
                                <FaXTwitter />
                            </a>
                            <a target='_blank' href="https://www.linkedin.com/company/klout-club/">
                                <FaLinkedinIn />
                            </a>
                            <a target='_blank' href="https://www.instagram.com/klout_club/">
                                <FaInstagram />
                            </a>
                        </div>
                    </footer>
                </div>

                {/* Sticky Box */}
                <div className='w-fit h-72 mt-7 flex gap-2 md:sticky top-20 right-0 rounded-lg'>
                    <div className='space-y-5'>
                        <div className='max-w-72 w-full flex flex-col gap-2'>
                            <div ref={imageRef} className='w-72 h-72 grid relative place-content-center rounded-lg bg-brand-lightBlue'>
                                {creatingBanner && <span className='inline-block absolute backdrop-blur text-center w-full bg-white/10 p-3 rounded-b-full text-white'>{selectedStartDate}</span>}
                                {selectedImage ? <img src={selectedImage} className='object-cover object-center h-72 w-72 rounded-lg' /> :
                                    <Image className='size-20 text-brand-primary/20' />}
                                <div className='w-full h-full grid place-content-center top-0 left-0 absolute rounded-lg p-2'>
                                    {creatingBanner && <p className='text-wrap font-bold text-center leading-none' style={{ color: color, fontSize: textSize }}>
                                        {formData.title}
                                    </p>}
                                </div>
                            </div>
                        </div>

                        {creatingBanner && <div className='xl:hidden flex w-72 overflow-scroll hide-scrollbar justify-between gap-2'>
                            {templates.map((template, index) => (
                                <img src={template} onClick={() => handleTemplateChange(template)} key={index} className='w-16 h-12 cursor-pointer hover:scale-105 duration-500 rounded-md object-cover' alt={"Template" + " " + index + 1} />
                            ))}
                        </div>}

                        {creatingBanner && <div className='space-y-5'>
                            <div className='space-y-2'>
                                <h3>Select Color</h3>
                                <input type='color' onChange={(e) => setColor(e.target.value)} />
                            </div>

                            <div className='space-y-2'>
                                <h3>Select Text Size</h3>
                                <input type="range" className='w-full cursor-pointer' min={16} max={60} onChange={(e) => setTextSize(Number(e.target.value))} />
                            </div>
                        </div>}
                    </div>

                    {creatingBanner && <div className='hidden xl:flex flex-col justify-between gap-2'>
                        {templates.map((template, index) => (
                            <img src={template} onClick={() => handleTemplateChange(template)} key={index} className='w-16 h-16 cursor-pointer hover:scale-105 duration-500 rounded-md object-cover' alt={"Template" + " " + index + 1} />
                        ))}
                    </div>}
                </div>
            </div>

            <div>
                {/* <button className="btn" onClick={openModal}>Open Modal</button> */}

                <dialog ref={modalRef} className="modal">
                    <div className="modal-box bg-brand-lightBlue w-fit m-5 max-w-screen-sm p-5">
                        <AccountCreate closeModal={closeModal} eventDetails={formData} />
                    </div>
                    <form method="dialog" className="modal-backdrop" onSubmit={closeModal}>
                        <button type="submit">Close</button>
                    </form>
                </dialog>
            </div>
        </div>
    );
};

export default AddEvent;
