import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas-pro';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';
import { TiArrowRight } from "react-icons/ti";
import '../component/style/addEvent.css';
import { addNewEvent, fetchEvents } from '../eventSlice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../../../component/Loader';
import Bg1 from "/background.jpg";
import Bg2 from "/bg2.jpeg";
import Bg3 from "/bg3.jpg";
import Bg4 from "/bg4.jpg";

type formInputType = {
    title: string,
    description: string,
    event_start_date: string,
    event_end_date: string,
    start_time: string,
    start_minute_time: string,
    start_time_type: string,
    end_time: string,
    end_minute_time: string,
    end_time_type: string,
    event_venue_name: string,
    event_venue_address_1: string,
    event_venue_address_2: string,
    event_date: string,
    country: string,
    state: string,
    city: string,
    pincode: string,
    image: File | null,
    feedback: number,
    status: number,
    google_map_link: string;
    printer_count: number;
};



const AddEvent: React.FC = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { token, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<formInputType>();
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [, setPrinters] = useState<number>(0);
    const [selectedImage, setSelectedImage] = useState('');
    const [, setImage] = useState<File | null>(null);
    const [eventBannerImage, setEventBannerImage] = useState<File | null>(null);
    const selectedCountryCode = watch('country');
    const dummyImage = "https://via.placeholder.com/150";

    const eventDetailsRef = useRef<HTMLDivElement>(null);

    const companyLogo: string = `${apiBaseUrl}/${user?.company_logo}`;

    const [eventCreate, setEventCreate] = useState<Boolean>(false);
    const [eventName, setEventName] = useState<string>("");
    const [templateImage, setTemplateImage] = useState<string | Blob>(Bg1);
    const [textColor, setTextColor] = useState<string>("#FFFFFF");
    const [textSize, setTextSize] = useState<number>(48);
    const [eventStartDate, setEventStartDate] = useState<string>("");
    const [eventEndDate, setEventEndDate] = useState<string>("");
    const [, setEventVenueName] = useState<string>("");
    const [, setEventCity] = useState<string>("");


    // Handle image upload
    const handleImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        setEventBannerImage(file);

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleCustomTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTemplateImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        // Load countries on component mount
        const countryList = Country.getAllCountries();
        setCountries(countryList);
    }, []);

    if (!countries) {
        return <Loader />
    }

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountry = e.target.value;
        setValue('country', selectedCountry);
        // Reset states and cities
        setStates(State.getStatesOfCountry(selectedCountry));
        setCities([]); // Clear cities when country changes
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedState = e.target.value;
        setValue('state', selectedState);
        // Set cities based on selected state and country
        setCities(City.getCitiesOfState(selectedCountryCode, selectedState));
    };

    const handleStartDateChange = (e: any) => {
        const dateString = e.target.value;  // e.g., "12/4/2024"
        const date = new Date(dateString);  // Convert to Date object

        const formatted = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        setEventStartDate(formatted);
    };

    const captureAsImage = async () => {

        if (eventDetailsRef.current) {
            const canvas = await html2canvas(eventDetailsRef.current, {
                useCORS: true, // Allow cross-origin images
                logging: true, // Enable logging for debugging
                allowTaint: true, // Allow tainting, which might let it capture more images
                x: 0, // Adjust the x-position to fix capture area
                y: 0, // Adjust the y-position to fix capture area
            });
            const imgData = canvas.toDataURL('image/png'); // Convert canvas to base64 image

            const base64Data = imgData.replace(/^data:image\/png;base64,/, "");

            // Convert base64 to binary data (blob)
            const binaryData = atob(base64Data);

            // Create a uint8array to hold the binary data
            const byteArray = new Uint8Array(binaryData.length);

            // Fill the byte array with the binary data
            for (let i = 0; i < binaryData.length; i++) {
                byteArray[i] = binaryData.charCodeAt(i);
            }

            // Create a Blob from the byteArray
            const blob = new Blob([byteArray], { type: 'image/png' });

            // Convert the Blob to a File by providing a filename
            const file = new File([blob], 'image.png', { type: 'image/png' });

            return file; // Return the captured image file
        }
        return null; // If eventDetailsRef.current is not available, return null
    };

    // Convert eventStartDate to YYYY-MM-DD format
    const formatDate = (dateString: string) => {
        return new Date(dateString).getTime(); // Convert to string format in milliseconds
    };

    // onSubmit function to handle form submission
    const onSubmit: SubmitHandler<formInputType> = async (data) => {

        const startDate = formatDate(eventStartDate);
        const endDate = formatDate(eventEndDate);

        if (startDate > endDate) {
            Swal.fire({
                title: 'Error',
                text: 'Event start date cannot be bigger than end date',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            return;
        }

        // Step 1: Show confirmation dialog to ask if the user wants to submit the event
        const result = await Swal.fire({
            title: 'Do you want to add this event?',
            icon: 'info',
            showDenyButton: true,
            confirmButtonText: 'Yes, add it!',
            denyButtonText: 'No, cancel',
        });

        // If the user confirms, proceed with the submission
        if (result.isConfirmed) {
            // Capture image and check if it was successful
            const imageCaptured = await captureAsImage();

            // Check if the image was captured successfully
            if (!imageCaptured && eventCreate) {
                Swal.fire({
                    title: 'Error',
                    text: 'There was an issue capturing the image. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
                return; // Stop the form submission if the image capture failed
            }

            // Use a temporary variable to store the image (instead of state)
            const capturedImage = imageCaptured;

            // Set the captured image to state
            setImage(capturedImage); // State update for later usage

            // Check if image is provided
            console.log("Captured Image and Event Banner Image is: ", capturedImage, eventBannerImage);
            if (!(capturedImage instanceof File) && !(eventBannerImage instanceof File)) {
                Swal.fire({
                    title: 'Error',
                    text: 'Please upload an image before submitting the event.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return; // Stop the form submission if no image
            }

            // Prepare data for form submission
            data.event_venue_address_2 = data.event_venue_address_1; // Duplicate address
            data.event_date = data.event_start_date; // Map event date
            data.feedback = 1; // Set default feedback
            data.status = 1; // Set default status

            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value as string);
            });

            // Append image if available
            if (capturedImage) {
                formData.append('image', capturedImage);
            }

            if (eventBannerImage) {
                formData.append("image", eventBannerImage);
            }

            // formData.append("printer_count", printers);

            try {
                console.log("The form data is: ", formData);
                // Dispatch the addNewEvent action
                await dispatch(addNewEvent({ eventData: formData, token })).unwrap(); // unwrap if using createAsyncThunk

                // Fetch events after adding the new one
                await dispatch(fetchEvents(token));

                // Show success message
                Swal.fire({
                    title: 'Success',
                    text: 'Event added successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    // Navigate to the home page after success
                    navigate('/');
                });

                // Clear the form
                reset();
            } catch (error: any) {
                // Show error message
                const errorMessage = error.response?.data?.message || error.message || 'Something went wrong!';
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        }
    };

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const amPm = ['AM', 'PM'];

    return (

        <div className='p-6 pt-3'>
            {/* <h2 className='text-black text-2xl font-semibold ps-5'>Add Details to create new event</h2> */}
            {/* <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 gap-4"> */}
            <form onSubmit={handleSubmit(onSubmit)} className="gap-4">
                <div className='flex flex-col gap-3 my-4'>
                    {/* Title */}
                    <label htmlFor="title" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Event Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        {/* <input id="title" type="text" className="grow" {...register('title', { required: 'Title is required', onChange=(e)=>setEventName(e.target.value)})} /> */}
                        <input
                            id="title"
                            type="text"
                            className="grow"
                            {...register('title', {
                                required: 'Title is required',
                            })}
                            onChange={(e) => setEventName(e.target.value)} // Correctly add onChange handler here
                        />
                    </label>
                    {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Description */}
                    <label htmlFor="description" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Description <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <textarea id="description" className="grow bg-white" {...register('description', { required: 'Description is required' })} />
                    </label>
                    {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <div className='flex flex-col gap-3'>
                        {/* Event Start Date */}
                        <label htmlFor="event_start_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Event Start Date <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="event_start_date" type="date" className="grow bg-white" {...register('event_start_date', { required: 'Start date is required' })} onChange={handleStartDateChange} />
                        </label>
                        {errors.event_start_date && <p className="text-red-600">{errors.event_start_date.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* Event End Date */}
                        <label htmlFor="event_end_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Event End Date <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="event_end_date" type="date" className="grow" {...register('event_end_date', { required: 'End date is required' })} onChange={(e) => setEventEndDate(e.target.value)} />
                        </label>
                        {errors.event_end_date && <p className="text-red-600">{errors.event_end_date.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Start Time */}
                        <label className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Start Time <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <div className="flex gap-2 grow">
                                <select id="start_time" className="grow bg-white" {...register('start_time', { required: 'Start hour is required' })}>
                                    <option value="">HH</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <select id="start_minute_time" className="grow bg-white" {...register('start_minute_time', { required: 'Start minute is required' })}>
                                    <option value="">MM</option>
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                                <select id="start_time_type" className="grow bg-white" {...register('start_time_type', { required: 'AM/PM is required' })}>
                                    <option value="">AM/PM</option>
                                    {amPm.map((ampm) => (
                                        <option key={ampm} value={ampm}>{ampm}</option>
                                    ))}
                                </select>
                            </div>
                        </label>
                        {errors.start_time && <p className="text-red-600">{errors.start_time.message}</p>}
                        {errors.start_minute_time && <p className="text-red-600">{errors.start_minute_time.message}</p>}
                        {errors.start_time_type && <p className="text-red-600">{errors.start_time_type.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* End Time */}
                        <label className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">End Time <span className="text-red-600 ml-1">*</span>&nbsp; <TiArrowRight className='mt-1' /> </span>
                            <div className="flex gap-2 grow">
                                <select id="end_time" className="grow bg-white" {...register('end_time', { required: 'End hour is required' })}>
                                    <option value="">HH</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <select id="end_minute_time" className="grow bg-white" {...register('end_minute_time', { required: 'End minute is required' })}>
                                    <option value="">MM</option>
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                                <select id="end_time_type" className="grow bg-white" {...register('end_time_type', { required: 'AM/PM is required' })}>
                                    <option value="">AM/PM</option>
                                    {amPm.map((ampm) => (
                                        <option key={ampm} value={ampm}>{ampm}</option>
                                    ))}
                                </select>
                            </div>
                        </label>
                        {errors.end_time && <p className="text-red-600">{errors.end_time.message}</p>}
                        {errors.end_minute_time && <p className="text-red-600">{errors.end_minute_time.message}</p>}
                        {errors.end_time_type && <p className="text-red-600">{errors.end_time_type.message}</p>}
                    </div>
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Venue Name */}
                    <label htmlFor="event_venue_name" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Venue Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="event_venue_name" type="text" className="grow" {...register('event_venue_name', { required: 'Venue name is required' })} onChange={(e) => setEventVenueName(e.target.value)} />
                    </label>
                    {errors.event_venue_name && <p className="text-red-600">{errors.event_venue_name.message}</p>}
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Venue Address */}
                    <label htmlFor="event_venue_address_1" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Venue Address <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="event_venue_address_1" type="text" className="grow" {...register('event_venue_address_1', { required: 'Address is required' })} />
                    </label>
                    {errors.event_venue_address_1 && <p className="text-red-600">{errors.event_venue_address_1.message}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Country */}
                        <label htmlFor="country" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Country <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="country" className="grow bg-white" {...register('country', { required: 'Country is required' })} onChange={handleCountryChange}>
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.country && <p className="text-red-600">{errors.country.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* State */}
                        <label htmlFor="state" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">State <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="state" className="grow bg-white" {...register('state', { required: 'State is required' })} onChange={handleStateChange}>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.isoCode} value={state.isoCode}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.state && <p className="text-red-600">{errors.state.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* City */}
                        <label htmlFor="city" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">City <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="city" className="grow bg-white" {...register('city', { required: 'City is required' })} onChange={(e) => setEventCity(e.target.value)}>
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.isoCode} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {errors.city && <p className="text-red-600">{errors.city.message}</p>}
                    </div>

                    <div className='flex flex-col gap-3'>
                        {/* Pincode */}
                        <label htmlFor="pincode" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Pincode <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <input id="pincode" type="text" className="grow" {...register('pincode', { required: 'Pincode is required', minLength: { value: 6, message: 'Pincode must be at least 5 characters' } })} />
                        </label>
                        {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
                    </div>
                </div>


                <div className='flex flex-col gap-3 my-4'>
                    {/* Google Map Link */}
                    <label htmlFor="google_map_link" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Google Map Link &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="google_map_link" type="url" className="grow" {...register('google_map_link', { required: false, pattern: { value: /^https?:\/\//, message: 'Link must start with http or https' } })} />
                    </label>
                    {errors.google_map_link && <p className="text-red-600">{errors.google_map_link.message}</p>}
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Printer Count */}
                    <label htmlFor="printer_count" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">No. Of Printers &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="printer_count" type="text" className="grow" {...register('printer_count', { required: false, onChange: (e) => setPrinters(e.target.value) })} />
                    </label>
                    {errors.printer_count && <p className="text-red-600">{errors.printer_count.message}</p>}
                </div>

                {!eventCreate && <div className='flex flex-row-reverse items-center gap-3'>
                    {/* Image Upload */}
                    <div className='flex flex-col gap-3'>
                        <label htmlFor="image" className="input w-full input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Banner Image &nbsp; <TiArrowRight className='mt-1' />
                            </span>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="grow"
                                onChange={handleImageUpload}
                            />
                        </label>
                        <span className='block text-center'>Or</span>
                        <button onClick={() => { setEventCreate(true); setEventBannerImage(null); }} className='px-4 py-2 rounded-md hover:bg-orange-600 w-fit mx-auto bg-orange-500 p-3 text-white'>Create Event Banner</button>
                    </div>

                    {/* Display the uploaded image or dummy image */}
                    <div className="mt-3 w-full">
                        <img
                            src={selectedImage || dummyImage}
                            alt="Selected Banner"
                            style={{
                                height: "350px",
                                width: "350px",
                            }}
                            className="rounded-md object-cover"
                        />
                    </div>
                </div>}

                {eventCreate && <>
                    <div className="flex">
                        <div id='bannerDiv' ref={eventDetailsRef} style={{
                            backgroundImage: `url(${templateImage})`,
                            color: textColor,
                            height: "350px",
                            width: "350px",
                            backgroundSize: 'cover', // Ensures the image covers the div
                            backgroundPosition: 'center', // Centers the background image
                            backgroundRepeat: 'no-repeat', // Prevents repeating the background image
                        }} className='mx-auto shadow-lg bg-white rounded-md border border-gray-300'>
                            {/* <p className="text-center text-3xl font-bold mb-4">{eventName}</p> */}
                            <div className='flex flex-col space-y-4 relative h-full'>

                                <div className='flex justify-between items-center'>
                                    {eventStartDate && (
                                        <div className='flex justify-center items-center w-full'>
                                            <span className='shadow-lg bg-white/20 backdrop-blur-lg rounded-b-full p-3 w-full'>
                                                <p className='ml-1 mt-3 text-center font-["Outfit"] font-normal text-xl'>{eventStartDate}</p>
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p
                                    style={{ fontSize: `${textSize}px`, lineHeight: `${textSize * 1.1}px`, fontFamily: "Outfit" }}
                                    className="text-center font-bold mb-4 tracking-wide absolute top-1/2 -translate-y-1/2 w-full text-wrap h-fit">
                                    {eventName}
                                </p>
                                {(user?.company_logo && eventStartDate && eventName) && <div className='ml-3 absolute bottom-2 right-2 z-50'>
                                    <div
                                        style={{
                                            // backgroundImage: `url(${Bg4})`,
                                            backgroundImage: `url(${companyLogo})`,
                                            color: textColor,
                                            height: "50px",
                                            width: "100px",
                                            backgroundSize: 'contain', // Ensures the image covers the div
                                            backgroundPosition: 'center', // Centers the background image
                                            backgroundRepeat: 'no-repeat',
                                        }}
                                        className='' />
                                </div>}
                            </div>
                        </div>

                        {/* Images, Font and Text Color Div */}
                        <div className='flex flex-col justify-between gap-3'>
                            <div className=''>
                                <h3 className='font-semibold mb-2'>Select Template Image</h3>
                                <div className='flex gap-3'>
                                    <img onClick={() => setTemplateImage(Bg1)} src={Bg1} alt="Background 1" className='rounded-md cursor-pointer w-20 h-20 object-cover object-center' />
                                    <img onClick={() => setTemplateImage(Bg2)} src={Bg2} alt="Background 2" className='rounded-md cursor-pointer w-20 h-20 object-cover object-center' />
                                    <img onClick={() => setTemplateImage(Bg3)} src={Bg3} alt="Background 3" className='rounded-md cursor-pointer w-20 h-20 object-cover object-center' />
                                    <img onClick={() => setTemplateImage(Bg4)} src={Bg4} alt="Background 4" className='rounded-md cursor-pointer w-20 h-20 object-cover object-center' />
                                </div>
                            </div>


                            {/* Set here the template image when selected */}
                            <span className="text-center">Or</span>
                            <div className=''>
                                <h3 className='font-semibold mb-2'>Upload Template Image</h3>
                                <input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    className="grow"
                                    onChange={handleCustomTemplate}
                                />
                            </div>

                            <div className=''>
                                <h3 className="font-semibold mb-2">Select Text Color</h3>
                                <input
                                    type="color"
                                    name="textColors"
                                    id="textColorPicker"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                />
                            </div>

                            <div className=''>
                                <h3 className="font-semibold mb-2">Text Size</h3>
                                {/* <input type="range" min="16" max="96" value={textSize} className="range range-primary p-1 h-4 " /> */}
                                <input
                                    type="range"
                                    min="16"
                                    max="96"
                                    value={textSize}
                                    className="range range-primary p-1 h-4"
                                    onChange={(e) => setTextSize(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { setEventCreate(false); setEventBannerImage(null) }} className='block mt-3 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md mx-auto text-center text-white'>Upload Event Image</button>
                </>
                }

                <div className="col-span-3 flex justify-center mt-10">
                    <button type="submit" className="px-4 py-2 rounded-md bg-klt_primary-900 text-white mx-auto w-fit">Add Event</button>
                </div>
            </form>
        </div>

    );
};

export default AddEvent;
