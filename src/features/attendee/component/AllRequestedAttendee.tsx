import React, { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FaEdit, FaFileExcel, FaEye, FaUserFriends } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { heading } from '../../heading/headingSlice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import Swal from 'sweetalert2';
import axios from 'axios';
import HeadingH2 from '../../../component/HeadingH2';
import Loader from '../../../component/Loader';
import { IoMdArrowRoundBack } from 'react-icons/io';

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

const AllRequestedAttendee: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const dispatch = useAppDispatch();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const { user } = useSelector((state: RootState) => state.auth);

    const [deleteArray, setDeleteArray] = useState<number[]>([]);

    const [deletingAttendee, setDeletingAttendee] = useState<boolean>(false);

    // const [selectedAction, setSelectedAction] = useState('');

    const { token } = useSelector((state: RootState) => state.auth);
    const { currentEventUUID, loading, allEvents } = useSelector((state: RootState) => ({
        currentEventUUID: state.events.currentEventUUID,
        loading: state.events.attendeeLoader,
        allEvents: state.events.events,
    }));

    const [eventAttendee, setEventAttendee] = useState<attendeeType[]>([]);

    const currentEvent = allEvents.find(event => uuid === event.uuid);

    useEffect(() => {
        if (currentEvent && token) {
            axios.post(`${apiBaseUrl}/api/show-all-requested-attendees`, {
                user_id: user?.id,
                event_id: currentEvent.id,
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                setEventAttendee(res.data.data);
                console.log("The data is: ", eventAttendee);
            })
        }

        // console.log("Checked Users are: ", checkedUsers);
    }, [currentEventUUID, token]);


    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [searchCompany, setSearchCompany] = useState('');
    const [searchDesignation, setSearchDesignation] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Filter attendees based on the search terms
    const filteredAttendees = eventAttendee
        .filter((attendee) => {
            const matchesName = `${attendee.first_name ?? ''} ${attendee.last_name ?? ''}`.toLowerCase().includes(searchName.toLowerCase());
            const matchesCompany = (attendee.company_name ?? '').toLowerCase().includes(searchCompany.toLowerCase());
            const matchesDesignation = (attendee.job_title ?? '').toLowerCase().includes(searchDesignation.toLowerCase());
            const matchesRole = roleFilter === '' || (attendee.status ?? '').toLowerCase() === roleFilter.toLowerCase();
            return matchesName && matchesCompany && matchesDesignation && matchesRole;
        })

    // console.log("Checked Users are: ", checkedUsers2ndDay);

    const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // const [currentAttendees, setCurrentAttendees] = useState<attendeeType[]>(filteredAttendees.slice(startIndex, endIndex));

    const currentAttendees: attendeeType[] = filteredAttendees.slice(startIndex, endIndex);
    // console.log(currentAttendees);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleExport = () => {
        const data = filteredAttendees.map((attendee) => ({
            'First Name': attendee.first_name,
            'Last Name': attendee.last_name,
            'Email': attendee.email_id,
            'Mobile': attendee.phone_number,
            'Role': attendee.status,
            'Altername Mobile': attendee.alternate_mobile_number,
            'Alternate Email': attendee.alternate_email,
            'Designation': attendee.job_title,
            'Company': attendee.company_name,
            'Event Name': attendee.event_name,
        }));

        // Create a new workbook and a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendees');

        // Generate Excel file and offer download
        XLSX.writeFile(workbook, eventAttendee[0].event_name + '.xlsx');
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

        return (
            <div className="flex items-center space-x-1">
                {startPage > 1 && <span className="text-klt_primary-500">1</span>}
                {startPage > 2 && <span className="text-klt_primary-500">...</span>}
                {paginationNumbers.map((number) => (
                    <button
                        key={number}
                        className={`px-3 py-1 border rounded-md ${number === currentPage ? 'bg-klt_primary-500 text-white' : 'text-klt_primary-500 hover:bg-green-100'
                            }`}
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

    const handleDelete = async (uuid: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${apiBaseUrl}/api/requested-attendee/${uuid}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(function (res) {
                        Swal.fire({
                            icon: "success",
                            title: res.data.message,
                            showConfirmButton: true,
                        }).then(() => window.location.reload());

                        // setFilteredAgendaData(prevAgendas => prevAgendas.filter(agenda => agenda.uuid !== uuid));
                        // setCurrentAttendees(prevAttendee => prevAttendee.filter(attendee => attendee.id !== id));
                    })
                    .catch(function () {
                        Swal.fire({
                            icon: "error",
                            title: "An Error Occured!",
                        });
                    });
            }
        });
    }

    const showImage = (
        firstName: string,
        lastName: string,
        email: string,
        jobTitle: string,
        companyName: string,
        phoneNumber: string,
        alternateEmail: string,
        status: string
    ) => {


        // console.log(img);

        Swal.fire({
            title: `${firstName} ${lastName}`,
            width: "500px",
            text: email,
            html: `
                <div style="display: flex; font-size: 14px; gap: 64px; justify-content: center">
                <div style="min-width: fit; display: flex; flex-direction: column; gap: 12px; margin-top: 30px;">
                <div style="width:fit; text-align: left;"><strong>Job Title:</strong> ${jobTitle}</div>
                <div style="width:fit; text-align: left;"><strong>Email:</strong> ${email}</div>
                <div style="width:fit; text-align: left;"><strong>Company:</strong> ${companyName}</div>
                </div>
    
                <div style="min-width: fit; display: flex; flex-direction: column; gap: 12px; margin-top: 30px;">
                <div style="width:fit; text-align: left;"><strong>Phone:</strong> ${phoneNumber}</div>
                <div style="width:fit; text-align: left;"><strong>Alternate Email:</strong> ${alternateEmail || '-'}</div>
                <div style="width:fit; text-align: left;"><strong>Status:</strong> ${status}</div>
                </div>
                </div>
            `,
            confirmButtonText: 'OK'
        });
    }


    const deleteAttendee = (id: number, checked: boolean) => {
        setDeleteArray((prevDeleteArray) => {
            if (checked) {
                // Add the ID to the deleteArray if not already present
                if (!prevDeleteArray.includes(id)) {
                    return [...prevDeleteArray, id];
                }
            } else {
                // Remove the ID from deleteArray
                return prevDeleteArray.filter(item => item !== id);
            }
            return prevDeleteArray; // No change if the id is already in the array
        });
    };

    // Handle "Select All" checkbox
    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            const allIds = filteredAttendees.map((attendee) => attendee.id);
            setDeleteArray(allIds); // Select all attendees
        } else {
            setDeleteArray([]); // Deselect all attendees
        }
    };

    // useEffect to track changes in deleteArray (optional, for logging or side effects)
    useEffect(() => {
        console.log('Delete array updated:', deleteArray);
    }, [deleteArray]);

    const handleDeleteAttendees = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Your selected attendees will be deleted forever.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((res) => {
            if (res.isConfirmed) {
                setDeletingAttendee(true);
                console.log("The array is going to delete is: ", deleteArray);
                axios.post(`${apiBaseUrl}/api/bulk-delete-requested-attendee`, {
                    ids: deleteArray,
                    user_id: user?.id,
                    event_id: currentEvent?.id,
                },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                ).then(res => {
                    Swal.fire({
                        icon: "success",
                        title: res.data.message,
                        showConfirmButton: true,
                    }).then(_ => {
                        setDeletingAttendee(false);
                        window.location.reload();
                    }
                    );
                }).catch(res => {
                    Swal.fire({
                        icon: "error",
                        title: res.data.message,
                        showConfirmButton: true,
                    }).then(_ => {
                        setDeletingAttendee(false);
                        window.location.reload();
                    })
                })
            }
        })
    }

    if (loading || deletingAttendee) {
        return <Loader />
    }

    return (
        <>
            <div className='flex justify-between items-center'>
                <HeadingH2 title={currentEvent?.title} />

                <div className='flex items-center gap-3'>
                    {/* <button onClick={() => showQRCode(currentEvent?.title)} className='btn-sm text-white bg-amber-400 hover:bg-amber-500 btn'>QR Code</button> */}
                    <Link
                        to="#"
                        onClick={() => {
                            window.history.back(); // Go back to the previous page
                        }}
                        className="btn btn-error text-white btn-sm"
                    >
                        <IoMdArrowRoundBack size={20} /> Go Back
                    </Link>
                </div>
            </div>
            <br />

            <div className="flex items-center flex-wrap gap-2 mb-4">
                <Link
                    to={`/events/add-requested-attendee/${uuid}`}
                    onClick={() => { dispatch(heading('Add Attendee')) }}
                    className="btn btn-secondary text-white btn-xs"
                    title="Add a new attendee"
                >
                    <FaUserFriends /> Add Attendee
                </Link>

                <Link
                    to={`/events/invite-registrations/${uuid}`}
                    onClick={() => { dispatch(heading('Invited Registrations')) }}
                    className="btn btn-accent text-white btn-xs"
                    title="Invited Registration"
                >
                    <FaUserFriends /> Invite Registrations
                </Link>

                <button
                    className="btn btn-success btn-outline btn-sm ml-auto"
                    onClick={handleExport}
                    title="Export attendee data"
                >
                    <FaFileExcel /> Export Data
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between flex-col-reverse min-[1440px]:flex-row gap-5 items-center">
                    {/* Search inputs */}
                    <div className="mb-2 flex justify-start flex-wrap gap-2">
                        {/* Show dropdown */}
                        <div className="mb-2 flex items-center h-full">
                            <label htmlFor="itemsPerPage" className="mr-2 text-gray-800 font-semibold">
                                Show:
                            </label>
                            <select
                                id="itemsPerPage"
                                className="border border-gray-500 rounded-md p-2 bg-white outline-none"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            className="border border-gray-500 rounded-md p-1 max-h-[40px] bg-white outline-none text-black"
                            placeholder="Search by name"
                            value={searchName}
                            onChange={(e) => {
                                setSearchName(e.target.value);
                                setCurrentPage(1); // Reset to the first page when searching
                            }}
                        />
                        <input
                            type="text"
                            className="border border-gray-500 rounded-md p-1 max-h-[40px] bg-white outline-none text-black"
                            placeholder="Search by company"
                            value={searchCompany}
                            onChange={(e) => {
                                setSearchCompany(e.target.value);
                                setCurrentPage(1); // Reset to the first page when searching
                            }}
                        />
                        <input
                            type="text"
                            className="border border-gray-500 rounded-md p-1 max-h-[40px] bg-white outline-none text-black"
                            placeholder="Search by designation"
                            value={searchDesignation}
                            onChange={(e) => {
                                setSearchDesignation(e.target.value);
                                setCurrentPage(1); // Reset to the first page when searching
                            }}
                        />

                        {/* Role filter */}
                        <select
                            className="border border-gray-500 rounded-md p-1 max-h-[40px] bg-white outline-none text-black"
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setCurrentPage(1); // Reset to the first page when filtering
                            }}
                        >
                            <option value="">Role</option>
                            <option value="speaker">Speaker</option>
                            <option value="delegate">Delegate</option>
                            <option value="sponsor">Sponsor</option>
                            <option value="panelist">Panelist</option>
                            <option value="moderator">Moderator</option>
                        </select>

                        {/* For Deleting multiple Attendees */}
                        <button onClick={handleDeleteAttendees} disabled={deleteArray.length === 0 ? true : false} className='bg-red-500 disabled:bg-neutral-300 text-white btn-sm max-h-[40px] h-full rounded-md'>Delete Attendees</button>
                    </div>

                    {/* Total Attendee Info */}
                    <div className="mb-2 text-right min-w-fit">
                        <span className="text-gray-800 font-semibold">
                            Total Attendee: {eventAttendee.length}
                        </span>
                        <br />

                        <span className="text-gray-800 font-semibold">
                            Search Result: {filteredAttendees.length}
                        </span>
                    </div>
                </div>

                {/* Table */}
                {/* Table or Loader */}
                <div className="overflow-x-auto max-w-full">
                    {loading ? (
                        <div className="flex justify-center items-center py-6">
                            <Loader /> {/* Display the loader component */}
                        </div>
                    ) : (

                        <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
                            <thead>
                                <tr className="bg-klt_primary-500 text-white">
                                    <th className="py-3 px-4 text-start text-nowrap"><input type="checkbox" className='size-5' onClick={(e: any) => handleSelectAll(e.target.checked)} /></th>
                                    <th className="py-3 px-4 text-start text-nowrap">#</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Name</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Designation</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Company</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Email</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Alternate Email</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Mobile</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Alternate Mobile</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Role</th>
                                    <th className="py-3 px-4 text-start text-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAttendees.length > 0 ? (
                                    currentAttendees.map((attendee: attendeeType, index) => (
                                        <tr key={attendee.uuid}
                                            // style={{
                                            //     backgroundColor: attendee.not_invited === "1" ? 'yellow' : '', // Convert conditional class to style here
                                            // }}
                                            className={`${attendee.not_invited ? "bg-yellow-100" : ""}`}
                                        >
                                            <td className='py-3 px-4 !size-5'><input type='checkbox' checked={deleteArray.includes(attendee.id)} onClick={(e: any) => deleteAttendee(attendee.id, e.target.checked)} /></td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{startIndex + index + 1}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{`${attendee.first_name} ${attendee.last_name}`}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.job_title}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.company_name}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.email_id}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.alternate_email ? attendee.alternate_email : "-"}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.phone_number}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.alternate_mobile_number ? attendee.alternate_mobile_number : "-"}</td>
                                            <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.status}</td>

                                            <td className="py-3 px-4 text-gray-800 text-nowrap flex items-center gap-2">
                                                <span
                                                    onClick={() => showImage(
                                                        attendee.first_name,
                                                        attendee.last_name,
                                                        attendee.email_id,
                                                        attendee.job_title,
                                                        attendee.company_name,
                                                        attendee.phone_number,
                                                        attendee.alternate_email,
                                                        attendee.status
                                                    )}
                                                    className='w-6 h-6 p-1 cursor-pointer bg-zinc-100 hover:bg-zinc-200 rounded-full grid place-content-center'>
                                                    <FaEye className='text-black/70' />
                                                </span>

                                                <Link to={`/events/edit-requested-attendee/${attendee.uuid}/${currentEvent?.id}`} onClick={() => { dispatch(heading("Edit Attendee")) }} className="text-blue-500 hover:text-blue-700">
                                                    <FaEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(attendee.uuid)} className="text-red-500 hover:text-red-700">
                                                    <MdDelete />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-4 text-center text-gray-600">
                                            No attendees found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    )}
                </div>


                {/* Pagination */}
                <div className="flex justify-end items-center mt-4">
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
                </div>
            </div>
        </>
    );
};


export default AllRequestedAttendee;