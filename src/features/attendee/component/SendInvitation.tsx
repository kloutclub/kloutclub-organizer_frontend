import React, { useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom';
import { RiWhatsappFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch } from 'react-redux';
import { eventUUID } from '../../event/eventSlice';
import { heading } from '../../heading/headingSlice';

const SendInvitation: React.FC = () => {
    // State to keep track of selected roles and selected sending method
    const [selectedRoles, setSelectedRoles] = useState<string[]>(['all', 'speaker', 'delegate', 'sponsor', 'moderator', 'panelist']);
    const [_, setSelectedMethod] = useState<'whatsapp' | 'mail' | null>("mail");
    const [sendTime, setSendTime] = useState<'now' | 'later' | null>("now"); // State for "now" and "later" radio buttons

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const dispatch = useDispatch<AppDispatch>();

    const { currentEvent } = useSelector((state: RootState) => state.events);

    console.log(currentEvent);

    // Handle change of checkboxes
    const handleCheckboxChange = (role: string) => {
        if (role === 'all') {
            // Toggle "All" checkbox: Select all roles or deselect all
            if (selectedRoles.includes('all')) {
                // If "All" is already selected, deselect all roles
                setSelectedRoles([]);
            } else {
                // Otherwise, select all roles
                setSelectedRoles(['all', 'speaker', 'delegate', 'sponsor', 'moderator', 'panelist']);
            }
        } else {
            // For other roles, toggle individual role
            setSelectedRoles(prevRoles =>
                prevRoles.includes(role)
                    ? prevRoles.filter(r => r !== role) // Deselect if already selected
                    : [...prevRoles, role] // Select if not selected
            );
        }
    };

    // Handle method selection (WhatsApp or Mail)
    const handleMethodChange = (method: 'whatsapp' | 'mail') => {
        setSelectedMethod(method);
    };

    // Handle sending time selection (Now or Later)
    const handleSendTimeChange = (time: 'now' | 'later') => {
        setSendTime(time);
    };

    if (!currentEvent) {
        return;
    }

    return (
        <div>
            <div className='flex justify-between items-baseline'>
                <HeadingH2 title='Send Email / SMS to Attendee' />
                <Link to="/events/all-attendee" className="btn btn-error text-white btn-sm">
                    <IoMdArrowRoundBack size={20} /> Go Back
                </Link>
            </div>

            <div className='flex gap-5 mt-10 text-black'>
                {/* Message Div Wrapper */}
                <div className='border border-zinc-400 w-4/6 rounded-xl h-fit'>
                    <div className="card-header p-3 border-b border-zinc-400 bg-zinc-200 rounded-t-xl">
                        <h6 className="m-0 font-bold text-klt_primary-500">Send Email / SMS to Attendee for {currentEvent.title}</h6>
                    </div>

                    {/* All Fields Wrapper Div */}
                    <div className='p-5'>
                        {/* Select Roles */}
                        <div className='mt-2'>
                            <h5 className='font-semibold mb-3'>Select Roles</h5>
                            <div className="flex flex-row items-center gap-10 pl-5">
                                {/* Checkbox for All Roles */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('all')}
                                        onChange={() => handleCheckboxChange('all')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>All</span>
                                </label>

                                {/* Checkbox for Speaker */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('speaker')}
                                        onChange={() => handleCheckboxChange('speaker')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Speaker</span>
                                </label>

                                {/* Checkbox for Delegate */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('delegate')}
                                        onChange={() => handleCheckboxChange('delegate')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Delegate</span>
                                </label>

                                {/* Checkbox for Sponsor */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('sponsor')}
                                        onChange={() => handleCheckboxChange('sponsor')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Sponsor</span>
                                </label>

                                {/* Checkbox for Moderator */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('moderator')}
                                        onChange={() => handleCheckboxChange('moderator')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Moderator</span>
                                </label>

                                {/* Checkbox for Panelist */}
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes('panelist')}
                                        onChange={() => handleCheckboxChange('panelist')}
                                        className="checkbox checkbox-sm rounded-sm border-zinc-400"
                                    />
                                    <span>Panelist</span>
                                </label>
                            </div>
                        </div>

                        {/* Select WhatsApp or Mail */}
                        <div className='mt-10'>
                            <h5 className='font-semibold mb-3'>Send By</h5>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="sendMethod"
                                    checked
                                    onChange={() => handleMethodChange('whatsapp')}
                                    className="bg-transparent border-zinc-400"
                                />
                                <RiWhatsappFill size={24} className='text-green-500 ml-2' />
                            </label>
                        </div>

                        {/* WhatsApp Message */}
                        <div className="mt-10">
                            <label htmlFor="Subject" className='block font-semibold'>Your Message</label>
                            <div className='w-1/2 bg-zinc-200 mt-5 rounded-xl p-5'>
                                <p>
                                    Hi "<strong>firstname</strong>", just a reminder for our event "<strong>Event-Title</strong>". We're excited to welcome you to this exclusive event. "<strong>Event-Date-Time</strong>". <br /> <br /> To ensure a smooth check-in experience, please download the  Klout Club app in advance. You can download it here <a href="https://onelink.to/r3fzb9" className='font-bold'>https://onelink.to/r3fzb9</a>
                                </p>
                            </div>
                        </div>

                        {/* Send Time: Now or Later */}
                        <div className='mt-10'>
                            <h5 className='font-semibold mb-3'>Delivery Schedule</h5>
                            <div className="flex gap-10 pl-5">
                                {/* Radio button for Now */}
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

                                {/* Radio button for Later */}
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
                        <button className='px-4 py-3 mt-10 bg-klt_primary-500 text-white font-semibold rounded-md'>Submit Now</button>
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
                            <Link to={"/events/view-event/"} onClick={() => { dispatch(eventUUID(currentEvent?.uuid)); dispatch(heading('View Event')); }} className="btn btn-error text-white btn-sm ">
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
}

export default SendInvitation;
