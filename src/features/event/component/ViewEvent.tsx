import React, { useEffect } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { fetchExistingEvent } from '../eventSlice';
import { RootState, useAppDispatch } from '../../../redux/store';
import Loader from '../../../component/Loader';
import { useSelector } from 'react-redux';

const ViewEvent: React.FC = () => {
    const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

    type eventType = {
        title: string,
        image: string,
        description: string,
        qr_code: string,
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
        google_map_link: string
    }
    const dispatch = useAppDispatch();

    const { token } = useSelector((state: RootState) => state.auth);
    const { currentEvent, currentEventUUID, loading } = useSelector((state: RootState) => ({
        currentEvent: state.events.currentEvent as eventType,
        currentEventUUID: state.events.currentEventUUID,
        loading: state.events.loading
    }));

    useEffect(() => {
        if (token && currentEventUUID) {
            dispatch(fetchExistingEvent({ token, eventuuid: currentEventUUID }));
        }
    }, [dispatch, token, currentEventUUID]);

    // If loading, show the Loader component
    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-6 pt-0">
            {/* Heading */}
            <div className="mb-4">
                <HeadingH2 title={currentEvent.title} />
            </div>


            {/* Banner and QR Code Section */}
            <div className="flex mb-6">
                <div className="w-7/10 pr-4" style={{ flex: '7' }}>
                    <img
                        src={`${imageBaseUrl}/${currentEvent.image}`}
                        alt={currentEvent.title}
                        className="rounded-lg shadow-md"
                        style={{ height: '400px', minHeight: '300px', maxHeight: '450px', objectFit: "cover" }} // Adjusted for better appearance
                    />
                </div>
                <div className="w-3/10 flex flex-col justify-center items-center" style={{ flex: '3' }}>
                    <img
                        src={`${imageBaseUrl}/${currentEvent.qr_code}`}
                        alt="QR Code"
                        className="w-full max-w-sm h-auto rounded-lg shadow-md mb-4"
                        style={{ maxWidth: '250px', height: 'auto' }}
                    />
                    {/* Download Button */}
                    <a
                        href={`${imageBaseUrl}/${currentEvent.qr_code}`} // You can provide an actual download link here
                        download
                        className="bg-klt_primary-900 text-white px-4 py-2 rounded shadow hover:bg-klt_primary-500 transition-colors"
                    >
                        Download
                    </a>
                </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-gray-900 text-xl font-semibold">Description</h3>
                <p className="text-gray-700 mb-2">{currentEvent.description}</p>

                {/* Date and Time */}
                <h3 className="text-gray-900 text-xl font-semibold">Date</h3>
                <p className="text-gray-700 mb-2">
                    {currentEvent.event_start_date + ' - ' + currentEvent.event_end_date}
                </p>

                <h3 className="text-gray-900 text-xl font-semibold">Time</h3>
                <p className="text-gray-700 mb-4">
                    {currentEvent.start_time + ':' + currentEvent.start_minute_time + ' ' + currentEvent.start_time_type + ' - ' + currentEvent.end_time + ':' + currentEvent.end_minute_time + ' ' + currentEvent.end_time_type}
                </p>

                {/* Location */}
                <h3 className="text-gray-900 text-xl font-semibold">Location</h3>
                <p className="text-gray-700 mb-2">
                    {currentEvent.event_venue_name} <br />
                    {currentEvent.event_venue_address_1}
                </p>

                {/* Google Map Link */}
                <h3 className="text-gray-900 text-xl font-semibold">Google Map</h3>
                <p className="text-gray-700">

                    <a
                        href={currentEvent.google_map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                    >
                        View Location on Google Maps
                    </a>
                </p>
            </div>
        </div>
    );
};

export default ViewEvent;
