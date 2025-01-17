import React, { useEffect, useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { Link, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { FaDownload } from 'react-icons/fa';
import { TbClockHour9Filled } from "react-icons/tb";
// import { MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { fetchAllPendingUserRequests } from '../../event/eventSlice';
import Loader from '../../../component/Loader';
import Swal from 'sweetalert2';
import axios from 'axios';
import { heading } from '../../heading/headingSlice';

interface PendingRequestType {
    alternate_mobile_number: string | null;
    check_in: number;
    company_name: string;
    company_turn_over: string | null;
    created_at: string;
    email_id: string;
    employee_size: string | null;
    event_id: number;
    event_invitation: number;
    first_name: string;
    id: number;
    image: string | null;
    industry: string | null;
    job_title: string;
    last_name: string;
    linkedin_page_link: string | null;
    phone_number: string;
    profile_completed: number;
    status: string;
    updated_at: string;
    user_id: number;
    user_invitation_request: number;
    uuid: string;
    virtual_business_card: string | null;
    website: string | null;
}

const PendingUserRequest: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    // const navigate = useNavigate();
    const { token } = useSelector((state: RootState) => state.auth);
    const { pendingRequests, user_id, loading, events } = useSelector((state: RootState) => ({
        pendingRequests: state.events.pendingRequests,
        user_id: state.auth.user?.id,
        loading: state.events.loading,
        events: state.events.events,
    }));

    const currentEvent = events.find((event) => event.uuid === uuid);

    const currentEventUUID = currentEvent?.uuid;

    const event_id: string | undefined = currentEvent?.uuid;

    const [, setRequests] = useState<PendingRequestType[]>();

    useEffect(() => {
        if (currentEventUUID && token && user_id) {
            dispatch(fetchAllPendingUserRequests({ eventuuid: currentEventUUID, token, user_id }));
        }

    }, [currentEventUUID, token, dispatch]);
    // eventuuid: currentEventUUID, token

    const requestAction = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // // Assuming these values are available in the scope
        // const userID = 'someUserID';  // Replace with actual user ID
        // const eventID = 'someEventID';  // Replace with actual event ID
        // const token = 'yourAuthToken';  // Replace with actual auth token

        Swal.fire({
            title: "Approve Now?",
            text: "Approve Attendee for this Event",
            icon: "warning",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: "#3085d6",
            denyButtonColor: "#d33",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Approve",
            denyButtonText: "Disapprove",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                // Approve attendee
                axios.post(`${apiBaseUrl}/api/approved_pending_request`, {
                    id,
                    user_id,
                    event_id,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })
                    .then(function (res) {
                        Swal.fire({
                            icon: "success",
                            title: res.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                        })
                        setTimeout(() => {
                            // navigate("/events/all-attendee");
                            window.history.back();
                        }, 1500);
                        // latestData.
                        // setRequests(prevRequests => prevRequests?.filter(req => req.id !== id));
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: "error",
                            title: "An Error Occurred!",
                            showConfirmButton: true,  // Show the "OK" button
                            confirmButtonText: "OK",  // You can customize the button text if needed
                        });
                        console.error("Error during approve request:", error);
                    });
            } else if (result.isDenied) {
                // Disapprove attendee
                axios.post(`${apiBaseUrl}/api/discard_pending_request`, {
                    id,
                    user_id,
                    event_id,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })
                    .then(function (res) {
                        Swal.fire({
                            icon: "success",
                            title: res.data.message,
                            showConfirmButton: true,  // Show the "OK" button
                            confirmButtonText: "OK",  // You can customize the button text if needed
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);

                        // Optionally update state or reload the page after success
                        setRequests(prevRequests => prevRequests?.filter(req => req.id !== id));
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: "error",
                            title: "An Error Occurred!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        console.error("Error during discard request:", error);
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // User canceled the action
                Swal.fire({
                    icon: "info",
                    title: "Action Canceled",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    };

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;  // Display 10 rows per page

    // Filter States
    const [firstNameFilter, setFirstNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');

    // Calculate filtered data based on the filters
    const filteredAttendees = pendingRequests.filter((attendee) => {
        return (
            attendee.first_name.toLowerCase().includes(firstNameFilter.toLowerCase()) &&
            attendee.email_id.toLowerCase().includes(emailFilter.toLowerCase()) &&
            attendee.company_name.toLowerCase().includes(companyFilter.toLowerCase())
        );
    });


    // Calculate the data to display for the current page
    // Calculate total pages
    const totalPages = Math.ceil(filteredAttendees.length / rowsPerPage);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderPaginationNumbers = () => {
        const paginationNumbers: JSX.Element[] = [];
        const delta = 2; // Number of pages before and after the current page to show

        // Always show the first page
        paginationNumbers.push(
            <button
                key={1}
                onClick={() => handlePageChange(1)}
                className={`p-1 px-3 border rounded-md bg-klt_primary-600 text-white ${currentPage === 1 ? 'bg-green-200' : 'bg-klt_primary-600/30'}`}
            >
                1
            </button>
        );

        // Show the second page if not the first page, and show ellipses if necessary
        if (currentPage > delta + 2) {
            paginationNumbers.push(
                <span key="ellipsis-start" className="p-1 px-3 text-gray-500">...</span>
            );
        }

        // Show the current page and pages around it (if applicable)
        const start = Math.max(2, currentPage - delta); // Start the range near the current page
        const end = Math.min(totalPages - 1, currentPage + delta); // End the range near the current page

        // If we have room, show pages in the middle range (after 1, before last page)
        for (let i = start; i <= end; i++) {
            paginationNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`p-1 px-3 border rounded-md bg-klt_primary-600 text-white ${currentPage === i ? 'bg-green-200' : 'bg-klt_primary-600/30'}`}
                >
                    {i}
                </button>
            );
        }

        // Show ellipses before the last page if needed
        if (currentPage < totalPages - delta - 1) {
            paginationNumbers.push(
                <span key="ellipsis-end" className="p-1 px-3 text-gray-500">...</span>
            );
        }

        // Always show the last page
        if (totalPages > 1) {
            paginationNumbers.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`p-1 px-3 border rounded-md bg-klt_primary-600 text-white ${currentPage === totalPages ? 'bg-green-200' : 'bg-klt_primary-600/30'}`}
                >
                    {totalPages}
                </button>
            );
        }

        return paginationNumbers;
    };

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            {/* Heading and Buttons Wrapper Div */}
            <div className='flex justify-between items-center'>
                <HeadingH2 title={currentEvent?.title} />
                <div className='flex items-center gap-3'>
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
            </div>

            {/* table filters and pagination wrapper div */}
            <div className='bg-white p-6 rounded-lg shadow-md mt-3'>
                <div className='mt-4'>
                    <div className='flex justify-between items-baseline flex-wrap gap-3'>
                        {/* Filters */}
                        <div className='space-x-3 flex'>
                            {/* Filter by first name */}
                            <input
                                type="text"
                                className="border border-gray-500 rounded-md px-2 max-w-96 bg-white outline-none text-black"
                                placeholder="Search by First Name"
                                value={firstNameFilter}
                                onChange={(e) => setFirstNameFilter(e.target.value)}
                            />
                            {/* filter by email */}
                            <input
                                type="text"
                                className="border border-gray-500 rounded-md px-2 max-w-96 bg-white outline-none text-black"
                                placeholder="Search by Email"
                                value={emailFilter}
                                onChange={(e) => setEmailFilter(e.target.value)}
                            />
                            {/* filter by company */}
                            <input
                                type="text"
                                className="border border-gray-500 rounded-md px-2 max-w-96 bg-white outline-none text-black"
                                placeholder="Search by company"
                                value={companyFilter}
                                onChange={(e) => setCompanyFilter(e.target.value)}
                            />

                            <button className="btn bg-klt_primary-500 h-full w-fit px-6 py-2 flex items-center text-white btn-sm">
                                <FaDownload size={20} /> Download Excel
                            </button>
                        </div>
                        <p className='font-semibold w-fit'>Pending Requests: {pendingRequests.length}</p>
                    </div>

                    {/* table */}
                    <div className="overflow-x-auto max-w-full mt-3">
                        <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
                            <thead>
                                <tr className="bg-klt_primary-500 text-white">
                                    <th className="py-3 px-4 text-start text-nowrap">Attendee-ID</th>
                                    <th className="py-3 px-4 text-start text-nowrap">First Name</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Last Name</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Designation</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Company</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Email</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Mobile No.</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Status</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (filteredAttendees?.length != undefined) && filteredAttendees.map((data: PendingRequestType, index: number) => (
                                        <tr key={index}>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.id}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.first_name}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.last_name}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.job_title}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.company_name}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.email_id}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{data.phone_number}</td>
                                            <td>{data.user_invitation_request === 0 ? "Pending" : data.user_invitation_request === 2 ? "Disapprove" : "Approved"}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap flex gap-3">
                                                {/* <Link to={"/events/edit-agenda"} className="text-blue-500 hover:text-blue-700">
                                                    <FaEdit size={20} />
                                                </Link> */}
                                                {data.user_invitation_request !== 2 &&
                                                    <button onClick={(e) => requestAction(data.id, e)} className="text-klt_primary-500 hover:text-klt_primary-600">
                                                        <TbClockHour9Filled size={20} />
                                                    </button>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-end items-center mt-4">
                        <div className="flex items-center space-x-1">
                            {/* Previous Button */}
                            <button
                                className="px-4 py-2 border rounded-md text-klt_primary-600 hover:bg-green-100"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <TiChevronLeft />
                            </button>

                            {renderPaginationNumbers()}

                            {/* Next Button */}
                            <button
                                className="px-4 py-2 border rounded-md text-klt_primary-600 hover:bg-green-100"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <TiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PendingUserRequest;
