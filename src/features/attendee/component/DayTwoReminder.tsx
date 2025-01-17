import React, { useEffect, useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import { RiWhatsappFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { eventUUID } from '../../event/eventSlice';
import { heading } from '../../heading/headingSlice';
import Swal from 'sweetalert2';
import axios from 'axios';

type Role = 'all' | 'speaker' | 'delegate' | 'sponsor' | 'moderator' | 'panelist';

const DayTwoReminder: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { token, user } = useSelector((state: RootState) => state.auth);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>(['all']);
    const [selectedMethod, setSelectedMethod] = useState<'whatsapp' | null>("whatsapp");  // Default to whatsapp only
    const [selectedCheckedUser, setSelectedCheckedUser] = useState<'checkedIn' | 'nonCheckedIn' | 'all'>("all");
    const [sendTime, setSendTime] = useState<'now' | 'later' | null>("now");

    const [loading, setLoading] = useState<boolean>(false);

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const dispatch = useDispatch<AppDispatch>();

    const { events } = useSelector((state: RootState) => state.events);
    const currentEvent = events.find((event) => event.uuid === uuid);


    // Effect to ensure 'all' is checked if no other roles are selected
    useEffect(() => {
        if (selectedRoles.length === 0) {
            setSelectedRoles(['all']);
        }
    }, [selectedRoles]);

    // Handle change of checkboxes
    const handleCheckboxChange = (role: Role) => {
        let updatedRoles = [...selectedRoles];

        if (role === 'all') {
            // If "All" is checked, uncheck all other roles
            if (updatedRoles.includes('all')) {
                updatedRoles = [];
            } else {
                updatedRoles = ['all'];
            }
        } else {
            // If a role is checked or unchecked, update the list
            if (updatedRoles.includes(role)) {
                updatedRoles = updatedRoles.filter(item => item !== role);
                // Uncheck "All" if any specific role is deselected
                if (updatedRoles.includes('all')) {
                    updatedRoles = updatedRoles.filter(item => item !== 'all');
                }
            } else {
                updatedRoles.push(role);
                // Uncheck "All" if any specific role is selected
                if (updatedRoles.includes('all')) {
                    updatedRoles = updatedRoles.filter(item => item !== 'all');
                }
            }
        }

        setSelectedRoles(updatedRoles);
    };

    // Function to capitalize the first letter of a role
    const capitalizeRole = (role: Role): string => {
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    // Converting selectedRoles array to a comma-separated string with capitalized roles
    // const selectedRolesString = selectedRoles.map(capitalizeRole).join(',');



    // Handle method selection (WhatsApp only now)
    const handleMethodChange = () => {
        setSelectedMethod('whatsapp');
    };

    // Handle selection of user status (All, CheckedIn, Non-CheckedIn)
    const handleCheckedUser = (status: 'checkedIn' | 'nonCheckedIn' | 'all') => {
        setSelectedCheckedUser(status);
    };

    // Handle sending time selection (Now or Later)
    const handleSendTimeChange = (time: 'now' | 'later') => {
        setSendTime(time);
    };

    const handleSubmit = () => {
        let dataObj = {};
        if (currentEvent) {
            dataObj = {
                // "link": link,
                "event_id": currentEvent?.uuid,
                "send_to": 'All',
                "send_method": "whatsapp",
                "subject": "",
                "message": "Template",
                "start_date": currentEvent?.event_start_date,
                "delivery_schedule": sendTime,
                "start_date_time": "01",
                "start_date_type": "am",
                "end_date": currentEvent?.event_end_date,
                "end_date_time": "01",
                "end_date_type": "pm",
                "no_of_times": "1",
                "hour_interval": "1",
                "status": 1,
                "check_in": selectedCheckedUser === 'all' ? 2 :
                    selectedCheckedUser === 'checkedIn' ? 1 : 0
            };
        }

        // console.log(dataObj); // Check if `check_in` is added correctly

        setLoading(true);

        try {
            axios.post(`${imageBaseUrl}/api/day-two-reminder`, dataObj, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
            })
                .then(res => {
                    // Check if the response is successful (status 200)
                    setLoading(false);
                    if (res.status === 200) {
                        // Show success message using SweetAlert
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'The day two reminder was sent successfully!',
                        }).then((result) => {
                            // Check if the OK button was clicked
                            if (result.isConfirmed) {
                                // Navigate to the '/events/all-attendee' route
                                // window.location.href = "/events/all-attendee";
                                window.history.back();
                            }
                        });
                    }
                })
                .catch(error => {
                    // Show error message if there is any issue
                    setLoading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went wrong',
                        text: error.response?.data?.message || 'An error occurred. Please try again.'
                    });
                });
        } catch (error) {
            // Catch any unexpected errors
            console.log(error)
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                text: 'An unexpected error occurred.'
            });
        }
    }

    // Check if all roles are selected
    // const isAllSelected = selectedRoles.length === 6;

    if (!currentEvent) {
        return null;
    }

    return (
        <div>
            {loading && (
                <div className="w-full h-screen fixed top-0 left-0 bg-black/50 grid place-content-center">
                    <span className="loading loading-spinner text-klt_primary-500"></span>
                </div>
            )}
            <div className='flex justify-between items-baseline'>
                <HeadingH2 title='Send WhatsApp to Attendee' />
                <Link
                    to="#"
                    onClick={() => {
                        window.history.back(); // Go back to the previous page
                        dispatch(heading("All Attendees")); // Optional: You can still dispatch the action if needed
                    }}
                    className="btn btn-error text-white btn-sm"
                >
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>

            <div className='flex gap-5 mt-10 text-black'>
                <div className='border border-zinc-400 w-4/6 rounded-xl h-fit'>
                    <div className="card-header p-3 border-b border-zinc-400 bg-zinc-200 rounded-t-xl">
                        <h6 className="m-0 font-bold text-klt_primary-500">Send WhatsApp to Attendee for {currentEvent.title}</h6>
                    </div>

                    <div className='p-5'>

                        <div className='mt-2'>
                            <h5 className='font-semibold mb-3'>Select Roles</h5>
                            <div className="flex flex-row items-center flex-wrap gap-5 pl-5">
                                {/* Checkbox for All Roles */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('all')}
                                        onChange={() => handleCheckboxChange('all')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>{capitalizeRole('all')}</span>
                                </label>

                                {/* Checkbox for Speaker */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('speaker')}
                                        onChange={() => handleCheckboxChange('speaker')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>{capitalizeRole('speaker')}</span>
                                </label>

                                {/* Checkbox for Delegate */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('delegate')}
                                        onChange={() => handleCheckboxChange('delegate')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>{capitalizeRole('delegate')}</span>
                                </label>

                                {/* Checkbox for Sponsor */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('sponsor')}
                                        onChange={() => handleCheckboxChange('sponsor')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>{capitalizeRole('sponsor')}</span>
                                </label>

                                {/* Checkbox for Moderator */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('moderator')}
                                        onChange={() => handleCheckboxChange('moderator')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>{capitalizeRole('moderator')}</span>
                                </label>

                                {/* Checkbox for Panelist */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('panelist')}
                                        onChange={() => handleCheckboxChange('panelist')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>{capitalizeRole('panelist')}</span>
                                </label>
                            </div>

                            {/* Display the selected roles
                            <div>
                                <h6>Selected Roles: {selectedRolesString}</h6>
                            </div> */}
                        </div>

                        {/* Send By */}
                        <div className='mt-10'>
                            <h5 className='font-semibold mb-3'>Send By</h5>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sendMethod"
                                    checked={selectedMethod === 'whatsapp'}
                                    onChange={handleMethodChange}
                                    className="bg-transparent border-zinc-400"
                                />
                                <RiWhatsappFill size={24} className='text-green-500' />
                            </label>
                        </div>

                        {/* User Status */}
                        <div className='mt-10'>
                            <h5 className='font-semibold mb-3'>Send to</h5>
                            <div className="flex gap-5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userStatus"
                                        checked={selectedCheckedUser === 'all'}
                                        onChange={() => handleCheckedUser('all')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>All</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userStatus"
                                        checked={selectedCheckedUser === 'checkedIn'}
                                        onChange={() => handleCheckedUser('checkedIn')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>Checked In</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="userStatus"
                                        checked={selectedCheckedUser === 'nonCheckedIn'}
                                        onChange={() => handleCheckedUser('nonCheckedIn')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>Non-Checked In</span>
                                </label>
                            </div>
                        </div>

                        {/* WhatsApp Message */}
                        <div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Your Message</label>
                            <div className='w-2/3 bg-zinc-200 mt-5 rounded-xl p-5'>
                                <p>
                                    Hi <strong>"Attendee Name"</strong> <br /> <br />

                                    This is a friendly reminder that Day 2 of <strong>{currentEvent.title}</strong> will commence at <strong>{currentEvent.start_time + ":" + currentEvent.start_minute_time + " " + currentEvent.start_time_type}</strong> at <strong>{currentEvent.event_venue_name}</strong> <br /> <br />

                                    We request you to check in and mark your attendance by scanning the QR code at the registration desk. <br /><br />

                                    The agenda, speaker details, and participant list are all available on the Klout Club app <strong>"Link"</strong> <br /> <br />

                                    Looking forward to seeing you. <br /><br />

                                    Regards, <br />
                                    <strong>{user?.company_name}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Poll Link */}
                        {/* <div className='mt-10'>
                            <label htmlFor="link" className="block text-gray-700 font-semibold">
                                Link <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="link"
                                type="text"
                                value={link}
                                onChange={handleChange}
                                className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Enter your link here"
                            />
                            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
                        </div> */}

                        {/* WhatsApp Message */}
                        {/*<div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Your Message</label>
                            <div className='w-1/2 bg-zinc-200 mt-5 rounded-xl p-5'>
                                <p>
                                    Hi <strong>User</strong>, <br /> <br />
                                    Hope you're enjoying the <strong>{currentEvent.title}</strong> 🎉 We'd love for you to take a moment to fill out this quick poll/survery: <strong>link</strong> <br /> <br />
                                    Thank you for your time! <br />
                                </p>
                            </div>
                        </div>*/}

                        {/* Send Time: Now or Later */}
                        <div className='mt-10'>
                            <h5 className='font-semibold mb-3'>Delivery Schedule</h5>
                            <div className="flex gap-10 pl-5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sendTime"
                                        checked={sendTime === 'now'}
                                        onChange={() => handleSendTimeChange('now')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>Now</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sendTime"
                                        checked={sendTime === 'later'}
                                        onChange={() => handleSendTimeChange('later')}
                                        className="bg-transparent border-zinc-400"
                                    />
                                    <span>Later</span>
                                </label>
                            </div>
                        </div>

                        <button onClick={handleSubmit} className='px-4 py-3 mt-10 bg-klt_primary-500 text-white font-semibold rounded-md'>Submit Now</button>
                    </div>
                </div>

                {/* Event Details Div Wrapper */}
                <div className='border border-zinc-400 w-2/6 rounded-xl'>
                    <div className="card-header p-3 border-b border-zinc-400 bg-zinc-200 rounded-t-xl">
                        <h6 className="m-0 font-bold text-klt_primary-500">Event Details</h6>
                    </div>

                    <div className='p-5'>
                        <img
                            className='w-full rounded-xl'
                            src={`${imageBaseUrl}/${currentEvent?.image}`} alt="event image" />

                        <h3 className='text-xl mt-2 font-medium'>{currentEvent?.title}</h3>
                        <div className='grid place-content-end mt-2'>
                            <Link to={`/events/view-event/${uuid}`} onClick={() => { dispatch(eventUUID(currentEvent?.uuid)); dispatch(heading('View Event')); }} className="btn btn-error text-white btn-sm ">
                                View Event <IoMdArrowRoundBack size={20} className='rotate-180' />
                            </Link>
                        </div>

                        <div className='w-full bg-zinc-200 mt-5 rounded-xl p-5'>
                            <div>
                                <h4 className='font-bold mb-2'>Date</h4>
                                <p>Start Date - {currentEvent.event_start_date}</p>
                                <p>End Date - {currentEvent.event_end_date}</p>
                            </div>

                            <div className='mt-4'>
                                <h4 className='font-bold mb-2'>Time</h4>
                                <p>From {currentEvent.start_time + ':' + currentEvent.start_minute_time + ' ' + currentEvent.start_time_type} - {currentEvent.end_time + ':' + currentEvent.end_minute_time + ' ' + currentEvent.end_time_type}</p>
                            </div>

                            <div className='mt-4'>
                                <h4 className='font-bold mb-2'>Location</h4>
                                <p>{currentEvent.event_venue_name} <br />
                                    {currentEvent.event_venue_address_1}</p>
                            </div>
                        </div>

                        <div className='mt-4'>
                            <h4 className='font-bold mb-2'>Description</h4>
                            <p>{currentEvent.description}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayTwoReminder;
