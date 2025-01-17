import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventUUID } from '../features/event/eventSlice';
import { useDispatch } from 'react-redux';
import { heading } from '../features/heading/headingSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

interface EventRowProps {
    title?: string,
    image?: string,
    event_start_date?: string,
    uuid: string,
    event_venue_name?: string,
    total_checkedin?: number,
    total_attendee?: number,
    total_checkedin_speaker?: number,
    total_checkedin_sponsor?: number,
    total_pending_delegate?: number,
    start_time?: string,
    start_minute_time?: string,
    start_time_type?: string,
    end_time?: string,
    end_minute_time?: string,
    end_time_type?: string,
    date: string,
    id: number,
}

const EventRow: React.FC<EventRowProps> = (props) => {

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const [isLive, setIsLive] = useState(false);

    const eventStartTime: string = `${props.start_time}:${props.start_minute_time} ${props.start_time_type}`;
    const eventEndTime: string = `${props.end_time}:${props.end_minute_time} ${props.end_time_type}`;

    // Function to parse time string to Date object
    const parseEventTime = (time: string, date: string) => {
        const [timeStr, period] = time.split(' ');
        const [hours, minutes] = timeStr.split(':').map(Number);
        let adjustedHours = hours;

        if (period === 'PM' && hours !== 12) adjustedHours += 12;
        if (period === 'AM' && hours === 12) adjustedHours = 0;

        return new Date(`${date}T${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
    };

    // Effect to check if the event is live
    useEffect(() => {
        const startDate = parseEventTime(eventStartTime, props.date);
        const endDate = parseEventTime(eventEndTime, props.date);

        const currentDate = new Date();

        // Check if the current date is within the event's start and end time
        if (currentDate >= startDate && currentDate <= endDate) {
            setIsLive(true);
        } else {
            setIsLive(false);
        }
    }, [eventStartTime, eventEndTime, props.date]);

    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const generatePDF = (uuid: string) => {
        axios.get(`${apiBaseUrl}/api/generatePDF/${uuid}`)
            .then(res => {
                if (res.data.status === 200) {
                    const url = imageBaseUrl + "/" + res.data.data.pdf_path;
                    window.open(url, '_blank');
                }
            });
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showDenyButton: true,
            text: "You won't be able to revert this!",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                // Delete the event from the server
                await axios.delete(`${apiBaseUrl}/api/events/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Show success message
                const successResult = await Swal.fire({
                    title: "Deleted!",
                    text: "Your event has been deleted.",
                    icon: "success",
                    confirmButtonText: "OK",
                });

                // Reload the page when the "OK" button is clicked
                if (successResult.isConfirmed) {
                    window.location.reload();
                }

            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "There was an error deleting the event.",
                    icon: "error",
                });
            }
        }
    };

    return (
        <div className='p-5 overflow-scroll relative border-b flex items-center bg-white mb-3 justify-between gap-5 rounded-lg'>

            {/* Display Live Tag */}
            {isLive && <div className='p-2 absolute left-0 right-0 mx-auto w-fit top-2'>
                <span className='text-xs font-bold  absolute right-1 top-1 px-1 rounded border text-red-600 border-red-600 flex items-center gap-1'>Live <span className='w-2 h-2 rounded-full bg-red-600 liveBlink' /></span>
            </div>}

            {/* Displaying Image */}
            <img src={props.image} alt={props.title} className='max-w-60 2xl:max-w-96 w-full h-40 2xl:h-60 object-cover object-center rounded-lg' />

            {/* Title */}
            <h3 className='text-lg font-semibold w-[236px] max-w-[236px]'>{props.title}</h3>

            {/* Date, Time and Venue */}
            <div className='flex flex-col gap-2 text-sm w-[160px] 2xl:text-base'>
                <div>
                    <span className="font-semibold text-black">Date</span> - {props.event_start_date}
                </div>
                <div>
                    <span className="font-semibold text-black">Time</span> - {props.start_time + ':' + props.start_minute_time + ' ' + props.start_time_type}
                </div>
                <div>
                    <span className="font-semibold text-black">Venue</span> - {props.event_venue_name}
                </div>
            </div>

            {/* Event Joiners Info */}
            <div className='h-full flex flex-col gap-y-2 min-w-40 text-sm 2xl:text-base'>
                <div className='flex items-center gap-2 font-semibold'>Total Registrations: <p className='font-medium'>{props.total_attendee}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Total Attendees: <p className='font-medium'>{props.total_checkedin}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Checked In Speakers: <p className='font-medium'>{props.total_checkedin_speaker}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Checked In Sponsors: <p className='font-medium'>{props.total_checkedin_sponsor}</p></div>
                <div className='flex items-center gap-2 font-semibold'>Pending Delegates: <p className='font-medium'>{props.total_pending_delegate}</p></div>
            </div>

            {/* Links */}
            <div className='min-w-fit'>
                <Link to={`/events/view-event/${props.uuid}`} className="text-pink-500 hover:underline px-3 inline-block mb-1 rounded-md text-xs" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('View Event'));
                }}>View Event</Link> <br />
                <Link 
                    to={`/events/edit-event/${props.uuid}`}
                className="text-sky-500 hover:underline px-3 inline-block mb-1 rounded-md text-xs" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('Edit Event'));
                }} >Edit Event</Link> <br />
                <Link to={`/events/all-attendee/${props.uuid}`} className="text-blue-500 hover:underline px-3 rounded-md text-xs inline-block mb-1" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('All Attendee'));
                }}>All Attendees</Link> <br />
                <Link to={`/events/all-requested-attendees/${props.uuid}`} className="text-teal-500 hover:underline px-3 rounded-md text-xs inline-block mb-1" onClick={() => {
                    dispatch(eventUUID(props.uuid)); dispatch(heading('Send Invitations'));
                }}>Send Invitations</Link> <br />
                <Link to={`/events/view-agendas/${props.uuid}`} className="text-yellow-500 hover:underline px-3 rounded-md text-xs inline-block mb-1" onClick={() => {
                    dispatch(heading('View Agendas')); dispatch(eventUUID(props.uuid));
                }} >View Agendas</Link> <br />

                <button className="text-purple-500 hover:underline px-3 rounded-md text-xs inline-block mb-1"
                    onClick={() => generatePDF(props.uuid)}>Generate PDF</button> <br />
                <button className="text-red-500 hover:underline px-3 rounded-md text-xs inline-block mb-1"
                    onClick={() => {
                        if (props.id !== undefined) {
                            handleDelete(props.id);
                        }
                    }}
                >Delete Event</button>
            </div>
        </div >
    );
};

export default EventRow;
