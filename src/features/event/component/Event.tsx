import React, { useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { MdAdd } from "react-icons/md";
import { Link } from 'react-router-dom';
import { heading } from '../../../features/heading/headingSlice';
import EventRow from '../../../component/EventRow';
import Loader from '../../../component/Loader';

type eventType = {
    title: string,
    image: string,
    event_start_date: string,
    uuid: string,
    event_venue_name: string,
    total_checkedin: number,
    total_attendee: number,
    total_checkedin_speaker: number,
    total_checkedin_sponsor: number,
    total_pending_delegate: number,
    start_time: string,
    start_minute_time: string,
    start_time_type: string,
    end_time: string,
    end_minute_time: string,
    end_time_type: string,
    id: number
}

const Event: React.FC = () => {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const itemsPerPage: number = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

    // Get events data from the store
    const { events, loading } = useSelector((state: RootState) => state.events);

    const today = new Date().toISOString().slice(0, 10);;

    const pastEvents = events.filter((event: eventType) => {
        const eventDate = event.event_start_date;
        return eventDate <= today;
    });

    const upcomingEvents = events.filter((event: eventType) => {
        const eventDate = event.event_start_date;
        return eventDate >= today;
    });

    const handleTabChange = (tab: 'upcoming' | 'past') => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset page to 1 when switching tabs
    };

    const handleHeading = () => {
        dispatch(heading('Add Event'))
    }

    const eventType = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

    // Pagination logic
    const totalPages = Math.ceil(eventType.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEvents: eventType[] = eventType.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationNumbers = () => {
        const paginationNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationNumbers.push(i);
        }

        if (loading) {
            return <Loader />
        }

        return (
            <div className="flex items-center space-x-1">
                {startPage > 1 && <span className="text-klt_primary-500">1</span>}
                {startPage > 2 && <span className="text-klt_primary-500">...</span>}
                {paginationNumbers.map((number) => (
                    <button
                        key={number}
                        className={`px-3 py-1 border rounded-md ${number === currentPage ? 'bg-klt_primary-500 text-white' : 'text-klt_primary-500 hover:bg-green-100'}`}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                ))}
                {endPage < totalPages - 1 && <span className="text-gray-600">...</span>}
                {endPage < totalPages && <span className="text-gray-600">{totalPages}</span>}
            </div>
        );
    };

    return (
        <>

            <div className="px-6">

                {/* Heading */}
                <div className="flex justify-between items-center mb-6">
                    {/* Tab Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleTabChange('upcoming')}
                            className={`px-2 py-1 text-sm rounded ${activeTab === 'upcoming' ? 'bg-klt_primary-900 text-white' : 'bg-gray-300 text-gray-700'}`}
                        >
                            Upcoming Events
                        </button>
                        <button
                            onClick={() => handleTabChange('past')}
                            className={`px-2 py-1 text-sm rounded ${activeTab === 'past' ? 'bg-klt_primary-900 text-white' : 'bg-gray-300 text-gray-700'}`}
                        >
                            Past Events
                        </button>
                    </div>
                    <Link to='/events/add-event' onClick={handleHeading} className="btn btn-secondary text-white btn-sm"><MdAdd /> Create New Event</Link>
                </div>



                {/* Event Table */}
                <div className="overflow-x-auto rounded-lg">
                    {
                        currentEvents.length === 0 ? (
                            <div className="text-center py-4 mt-10">
                                No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events
                            </div>
                        ) : (
                            currentEvents.map((event) => (
                                <EventRow
                                    key={event.uuid}
                                    uuid={event.uuid}
                                    date={event.event_start_date}
                                    id={event.id}
                                    image={`${imageBaseUrl}/${event.image}`}
                                    title={event.title}
                                    event_start_date={event.event_start_date}
                                    event_venue_name={event.event_venue_name}
                                    start_minute_time={event.start_minute_time}
                                    start_time={event.start_time}
                                    start_time_type={event.start_time_type}
                                    end_minute_time={event.end_minute_time}
                                    end_time={event.end_time}
                                    end_time_type={event.end_time_type}
                                    total_attendee={event.total_attendee}
                                    total_pending_delegate={event.total_pending_delegate}
                                    total_checkedin={event.total_checkedin}
                                    total_checkedin_speaker={event.total_checkedin_speaker}
                                    total_checkedin_sponsor={event.total_checkedin_sponsor}
                                />
                            ))
                        )
                    }
                </div>


                {/* Pagination */}
                {currentEvents.length > 1 && <div className="flex justify-end items-center mt-4">
                    <div className="flex items-center space-x-1">
                        <button
                            className="px-4 py-2 border rounded-md text-klt_primary-600 hover:bg-green-100"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <TiChevronLeft />
                        </button>
                        {renderPaginationNumbers()}
                        <button
                            className="px-4 py-2 border rounded-md text-klt_primary-600 hover:bg-green-100"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <TiChevronRight />
                        </button>
                    </div>
                </div>}

            </div >
        </>
    );
};

export default Event;
