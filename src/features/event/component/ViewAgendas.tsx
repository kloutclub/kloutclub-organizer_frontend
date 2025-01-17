import React, { useEffect, useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { TiChevronLeft, TiChevronRight, TiPlus } from "react-icons/ti";
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { agendaUUID } from '../eventSlice';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import axios from 'axios';
import { heading } from '../../heading/headingSlice';
import Swal from 'sweetalert2';
import Loader from '../../../component/Loader';
import { FaFileImport } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

// Define the AgendaType interface
type AgendaType = {
  id: number;
  uuid: string;
  event_id: number;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  start_time_type: string;
  end_time: string;
  end_time_type: string;
  image_path: string;
  created_at: string;
  updated_at: string;
  start_minute_time: string;
  end_minute_time: string;
  position: number;
};

interface ViewAgendasProps {
  uuid: string | undefined;
}

const ViewAgendas: React.FC<ViewAgendasProps> = ({ uuid }) => {
  const dispatch = useDispatch<AppDispatch>();
  const dummyImage = "https://via.placeholder.com/150";

  const { token } = useSelector((state: RootState) => (state.auth));
  const [agendaData, setAgendaData] = useState<AgendaType[]>([]); // Fix agendaData to be an array
  const [filteredAgendaData, setFilteredAgendaData] = useState<AgendaType[]>([]); // To store filtered data
  const [filterTitle, setFilterTitle] = useState(""); // State for the filter input
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const { events, loading } = useSelector((state: RootState) => state.events);
  const [eventId, setEventId] = useState<number>();

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const [button, setButton] = useState<boolean>(false);

  const currentEvent = events.find((event) => event.uuid === uuid); // Use find() to directly get the current event

  // console.log("Current Event is: ",currentEvent?.id);

  if (currentEvent === undefined) {
    console.log("Cannot find the currentevent");
    return;
  }

  // console.log("Current event is: ", currentEvent);

  useEffect(() => {
    if (currentEvent) {
      axios.get(`${apiBaseUrl}/api/all-agendas/${currentEvent.id}`)
        .then((res) => {
          if (res.data) {
            console.log(currentEvent);

            // Sort the data in descending order to show the highest position at the top
            const sortedData = res.data.data.sort((a: AgendaType, b: AgendaType) => a.position - b.position);

            setAgendaData(sortedData);
            setFilteredAgendaData(sortedData); // Initialize filtered data with sorted data
          }
        });
    }
  }, [currentEvent]);

  const deleteAgenda = async (uuid: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "info",
      showDenyButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Delete the agenda from the server
        await axios.delete(`${apiBaseUrl}/api/agendas/${uuid}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "Your agenda has been deleted.",
          icon: "success",
        });

        // Call the callback function to remove the row from the UI
        deleteRow(uuid);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "There was an error deleting the agenda.",
          icon: "error",
        });
      }
    }
  };

  const deleteRow = (uuid: string) => {
    setFilteredAgendaData(prevAgendas => prevAgendas.filter(agenda => agenda.uuid !== uuid));
  };

  // Handle title filter input change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setFilterTitle(query);

    // Filter the agendaData based on the title input
    const filtered = agendaData.filter((agenda) =>
      agenda.title.toLowerCase().includes(query)
    );
    setFilteredAgendaData(filtered); // Update filtered data
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;  // Display 10 rows per page

  // Calculate the data to display for the current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAgendaData.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAgendaData.length / rowsPerPage);

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

  const handleImportAgenda = () => {
    const currentDate = currentEvent.event_date;
    const newEventId = currentEvent.id;

    try {
      axios.post(
        `${apiBaseUrl}/api/duplicate-agendas`,
        {
          event_id: eventId,
          new_event_id: newEventId,
          date: currentDate,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      ).then((res) => {
        if (res.data.status === 200) {
          const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
          if (modal) {
            modal.close(); // Using the `.close()` method of the <dialog> element
          }

          swal("Success", res.data.message, "success").then(() => {
            window.location.reload();
          });
        };
      });
    } catch (error: any) {
      throw error;
    }
  };

  const showImage = (imgBase: string, agendaTitle: string, agendaDescription: string, eventDate: string, startTime: string, endTime: string, startMinuteTime: string, endTimeType: string, endMinuteTime: string, position: number, startTimeType: string) => {
    const agendaImage = `${apiBaseUrl}/${imgBase}`;

    if (imgBase === " ") {
      imgBase = "";
    }

    Swal.fire({
      title: agendaTitle,
      text: agendaDescription,
      imageUrl: imgBase ? agendaImage : dummyImage,
      width: "600px",
      imageHeight: "300px",
      imageWidth: "300px",
      confirmButtonText: 'OK',
      html: `
                <div style="display: flex; font-size: 16px; padding-top: 12px; gap: 64px; justify-content: center">
                <div style="min-width: fit; display: flex; flex-direction: column; gap: 12px">
                <div style="width:fit; text-align: left;"><strong>Start Time:</strong> ${startTime + ':' + startMinuteTime + ' ' + startTimeType.toUpperCase() + ' '}</div>
                <div style="width:fit; text-align: left;"><strong>Event Date:</strong> ${eventDate}</div>
                </div>
    
                <div style="min-width: fit; display: flex; flex-direction: column; gap: 12px">
                <div style="width:fit; text-align: left;"><strong>End Time:</strong> ${endTime + ':' + endMinuteTime + ' ' + endTimeType.toUpperCase() + ' '}</div>
                <div style="width:fit; text-align: left;"><strong>Priority:</strong> ${position}</div>
                </div>
                </div>
            `,
    });
  }


  if (loading) {
    return <Loader />
  }

  return (
    <div>
      {/* Heading and Buttons Wrapper Div */}
      <div className='flex justify-between items-center'>
        <HeadingH2 title={currentEvent.title} />
        <div className='flex items-center gap-3'>
          <Link
            to="#"
            onClick={() => {
              window.history.back(); // Go back to the previous page
              // dispatch(heading("All Events")); // Optional: You can still dispatch the action if needed
            }}
            className="btn btn-error text-white btn-sm"
          >
            <IoMdArrowRoundBack size={20} /> Go Back
          </Link>
        </div>
      </div>

      <div className='flex gap-3'>
        <Link to="/events/add-agenda" onClick={() => dispatch(heading("Add Agenda"))} className="btn mt-5 btn-secondary w-fit flex items-center text-white btn-sm">
          <TiPlus size={20} /> Add Agenda
        </Link>
        <button
          className="btn mt-5 btn-info w-fit flex items-center text-white btn-sm"
          onClick={() => {
            const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
            if (modal) {
              modal.showModal();
            }
          }}
        >
          <FaFileImport size={14} /> Import Agenda
        </button>
      </div>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">Please select an event</h3>

          <ul className="max-h-96 overflow-scroll">
            {events.map((event) => {
              // Only render if event.id is not equal to currentEvent.id
              if (event.id === currentEvent.id) {
                return null; // Do not render this event
              }

              return (
                <li key={event.id}>
                  <label className="flex items-center justify-between p-3 rounded-sm hover:bg-neutral-200 cursor-pointer">
                    {/* Display the event title */}
                    {event.title}
                    <input
                      type="radio"
                      name="event"
                      value={event.title}
                      checked={selectedEvent === event.title}
                      onChange={() => {
                        setButton(true);
                        // Log the event id only when the radio button is clicked
                        console.log('Selected event id:', event.id);
                        setEventId(event.id);
                        console.log("Event id is: ", event.id);
                        // Update the selectedEvent state
                        setSelectedEvent(event.title);
                      }}
                    />
                  </label>
                </li>
              );
            })}
          </ul>

          {button && <button
            onClick={handleImportAgenda}
            className="btn mx-auto btn-info w-fit flex items-center text-white btn-sm"
          >
            <FaFileImport size={14} /> Import Agenda
          </button>}
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* table filters and pagination wrapper div */}
      <div className='bg-white p-6 rounded-lg shadow-md mt-3'>
        <div className='mt-4'>
          {/* Filters */}
          <div className='flex justify-between items-baseline'>
            <input
              type="text"
              className="border border-gray-500 rounded-md p-2 w-96 bg-white outline-none text-black"
              placeholder="Search by Title"
              value={filterTitle} // bind the filter state to the input
              onChange={handleFilterChange} // Update the filter state on input change
            />
            <p className='font-semibold'>Total Agendas: {filteredAgendaData.length}</p>
          </div>

          {/* table */}
          <div className="overflow-x-auto max-w-full mt-3">
            <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
              <thead>
                <tr className="bg-klt_primary-500 text-white">
                  <th className="py-3 px-4 text-start text-nowrap">S.No</th>
                  <th className="py-3 px-4 text-start text-nowrap">Title</th>
                  <th className="py-3 px-4 text-start text-nowrap">Event Date</th>
                  <th className="py-3 px-4 text-start text-nowrap">Time</th>
                  <th className="py-3 px-4 text-start text-nowrap">Priority</th>
                  <th className="py-3 px-4 text-start text-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  currentRows.length === 0 && <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-600">
                      No Agenda found.
                    </td>
                  </tr>
                }
                {currentRows.map((data: AgendaType, index: number) => (
                  <tr key={data.uuid}>
                    <td className="py-3 px-4 text-gray-800 text-nowrap">{indexOfFirstRow + index + 1}</td>
                    <td className="py-3 px-4 text-gray-800 text-nowrap">{data.title}</td>
                    <td className="py-3 px-4 text-gray-800 text-nowrap">{data.event_date}</td>
                    <td className="py-3 px-4 text-gray-800 text-nowrap">{data.start_time + ':' + data.start_minute_time + ' ' + data.start_time_type.toUpperCase() + ' ' + '-' + ' ' + data.end_time + ':' + data.end_minute_time + ' ' + data.end_time_type.toUpperCase()}</td>
                    <td className="py-3 px-4 text-gray-800 text-nowrap">{data.position}</td>
                    <td className="py-3 px-4 text-gray-800 text-nowrap flex items-center gap-3">
                      <span onClick={() => showImage(data.image_path, data.title, data.description, data.event_date, data.start_time, data.end_time, data.start_minute_time, data.end_time_type, data.end_minute_time, data.position, data.start_time_type)} className='w-6 h-6 p-1 cursor-pointer bg-zinc-100 hover:bg-zinc-200 rounded-full grid place-content-center'>
                        <FaEye className='text-black/70' />
                      </span>
                      <Link to={`/events/edit-agenda/${data.uuid}/${currentEvent.id}`} onClick={() => { dispatch(agendaUUID(data.uuid)); dispatch(heading("Edit Agenda")) }} className="text-blue-500 hover:text-blue-700">
                        <FaEdit size={20} />
                      </Link>
                      <button onClick={() => deleteAgenda(data.uuid)} className="text-red-500 hover:text-red-700">
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {currentRows.length !== 0 &&
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
            </div>}
        </div>
      </div>
    </div>
  );
};

export default ViewAgendas;
