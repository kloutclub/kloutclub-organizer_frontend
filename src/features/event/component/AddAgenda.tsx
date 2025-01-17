import axios from 'axios';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TiArrowRight } from "react-icons/ti";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { heading } from '../../heading/headingSlice';
import Swal from 'sweetalert2';

type formInputType = {
    title: string,
    description: string,
    event_date: string,
    start_time: string,
    start_minute_time: string,
    start_time_type: string,
    end_time: string,
    end_minute_time: string,
    end_time_type: string,
    position: number;
    image_path: File | null,
    event_id: string;
};

const AddAgenda: React.FC = () => {
    // const navigate = useNavigate();
    const { token } = useSelector((state: RootState) => (state.auth));
    const dispatch = useDispatch<AppDispatch>();
    const { register, handleSubmit, formState: { errors } } = useForm<formInputType>();
    const [selectedImage, setSelectedImage] = useState('');
    const [image, setImage] = useState(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const dummyImage = "https://via.placeholder.com/150";

    const { currentEventUUID } = useSelector((state: RootState) => state.events);
    const { events } = useSelector((state: RootState) => state.events);

    const currentEvent = events.find((event) => event.uuid === currentEventUUID); // Use find() to directly get the current event
    const eventId = currentEvent?.id;

    const [date, setDate] = useState(currentEvent?.event_date);

    // Handle image upload
    const handleImageUpload = (e: any) => {
        const file = e.target.files?.[0];
        setImage(file)
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const onSubmit: SubmitHandler<formInputType> = async (data) => {
        // Prepare data
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        if (image) {
            formData.append('image_path', image);
        }

        formData.append("event_id", eventId?.toString() ?? ""); // If eventId is undefined, use an empty string
        // formData.append("_method", "PUT");

        console.log(formData);

        axios
            .post(`${apiBaseUrl}/api/agendas`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`
                },
            })
            // .then((res) => {
            //     if (res.data.status === 201) {
            //         swal("Success", res.data.message, "success")
            //             .then(() => {
            //                 navigate("/events/view-agendas");
            //             });
            //     }
            // });
            .then((res) => {
                if (res.data.status === 201) {
                    Swal.fire({
                        title: "Success",
                        icon: "success",
                        // showDenyButton: true,
                        // showCancelButton: true,
                        confirmButtonText: "Ok",
                        // denyButtonText: "Don't save"
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            // Swal.fire("Saved!", "", "success");
                            // navigate(`/events/view-agendas/${uuid}`);
                            window.history.back();
                        }
                    });
                }
            });


    }


    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const priority = Array.from({ length: 100 }, (_, i) => (i + 1));
    const amPm = ['AM', 'PM'];

    return (

        <div className='p-6 pt-3'>
            <div className='flex justify-between items-center'>
                <h2 className='text-black text-2xl font-semibold'>Add Agenda</h2>
                <div className='flex items-center gap-3'>
                    <Link to="/events/view-agendas" onClick={() => dispatch(heading("View Agendas"))} className="btn btn-error text-white btn-sm">
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>
            {/* <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 gap-4"> */}
            <form onSubmit={handleSubmit(onSubmit)} className="gap-4 mt-10">
                <div className='flex flex-col gap-3 my-4'>
                    {/* Title */}
                    <label htmlFor="title" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Agenda Name <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <input id="title" type="text" className="grow" {...register('title', { required: 'Title is required' })} />
                    </label>
                    {errors.title && <p className="text-red-600">{errors.title.message}</p>}
                </div>


                <div className='flex w-full gap-3'>
                    {/* Image Upload */}
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
                    {errors.image_path && <p className="text-red-600">{errors.image_path.message}</p>}

                    {/* Display the uploaded image or dummy image */}
                    <div className="w-full">
                        <img
                            src={selectedImage || dummyImage}
                            alt="Selected Banner"
                            className="w-full h-60 object-cover"
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-3 my-4'>
                    {/* Description */}
                    <label htmlFor="description" className="input input-bordered bg-white text-black flex items-center gap-2">
                        <span className=" font-semibold text-green-700 flex justify-between items-center">Description <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                        <textarea id="description" className="grow bg-white outline-none" {...register('description', { required: 'Description is required' })} />
                    </label>
                    {errors.description && <p className="text-red-600">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-3">
                        {/* Agenda Start Date */}
                        <label htmlFor="event_date" className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className="font-semibold text-green-700 flex justify-between items-center">
                                Event Date <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className="mt-1" />
                            </span>
                            <input
                                value={date}
                                id="event_date"
                                type="date"
                                className="grow bg-white"
                                {...register('event_date', { required: 'Start date is required' })}
                                onChange={(e) => {
                                    setDate(e.target.value)  // Your custom handler
                                }}
                            />
                        </label>

                        {/* Error Message */}
                        {errors.event_date && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.event_date.message}
                            </p>
                        )}
                    </div>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Start Time */}
                        <label className="input input-bordered bg-white text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Start Time <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <div className="flex gap-2 grow">
                                <select id="start_time" className="grow bg-white outline-none" {...register('start_time', { required: 'Start hour is required' })}>
                                    <option value="">HH</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <select id="start_minute_time" className="grow bg-white outline-none" {...register('start_minute_time', { required: 'Start minute is required' })}>
                                    <option value="">MM</option>
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                                <select id="start_time_type" className="grow bg-white outline-none" {...register('start_time_type', { required: 'AM/PM is required' })}>
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
                        <label className="input input-bordered bg-white outline-none text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">End Time <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <div className="flex gap-2 grow">
                                <select id="end_time" className="grow bg-white outline-none" {...register('end_time', { required: 'End hour is required' })}>
                                    <option value="">HH</option>
                                    {hours.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <select id="end_minute_time" className="grow bg-white outline-none" {...register('end_minute_time', { required: 'End minute is required' })}>
                                    <option value="">MM</option>
                                    {minutes.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                                <select id="end_time_type" className="grow bg-white outline-none" {...register('end_time_type', { required: 'AM/PM is required' })}>
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

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 my-4">
                    <div className='flex flex-col gap-3'>
                        {/* Priority */}
                        <label className="input input-bordered bg-white outline-none text-black flex items-center gap-2">
                            <span className=" font-semibold text-green-700 flex justify-between items-center">Priority <span className="text-red-600 ml-1">*</span> &nbsp; <TiArrowRight className='mt-1' /> </span>
                            <select id="priority" className="grow bg-white outline-none" {...register('position', { required: 'Priority is required' })}>
                                <option value="">Select</option>
                                {priority.map((index) => (
                                    <option key={index} value={index}>{index}</option>
                                ))}
                            </select>
                        </label>
                        {errors.position && <p className="text-red-600">{errors.position.message}</p>}
                    </div>
                </div>

                <div className="col-span-3 flex justify-center mt-4">
                    <button type="submit" className="px-4 py-2 rounded-md bg-klt_primary-900 text-white mx-auto w-fit">Add Agenda</button>
                </div>
            </form>
        </div>

    );
};

export default AddAgenda;