import React, { useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import { RootState } from '../../../redux/store';

type attendeeType = {
  uuid: string;
  title: string;
  first_name: string;
  job_title: string;
  company_name: string;
  email_id: string;
  phone_number: string;
  status: string;
  last_name: string;
};

const AllAttendee: React.FC = () => {

  const { allAttendees, loading } = useSelector((state: RootState) => state.attendee);
  console.log(allAttendees);

  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [searchCompany, setSearchCompany] = useState('');
  const [searchDesignation, setSearchDesignation] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  
  const currentAttendees: attendeeType[] = allAttendees;
  // console.log(currentAttendees);
  
  // Filter attendees based on the search terms
  const filteredAttendees = currentAttendees.filter((attendee) => {
    const matchesName = `${attendee.first_name ?? ''} ${attendee.last_name ?? ''}`.toLowerCase().includes(searchName.toLowerCase());
    const matchesCompany = (attendee.company_name ?? '').toLowerCase().includes(searchCompany.toLowerCase());
    const matchesDesignation = (attendee.job_title ?? '').toLowerCase().includes(searchDesignation.toLowerCase());
    const matchesEmail = (attendee.email_id ?? '').toLowerCase().includes(searchEmail.toLowerCase());
    const matchesPhone = (attendee.phone_number ?? '').toLowerCase().includes(searchPhone.toLowerCase());
    return matchesName && matchesCompany && matchesDesignation && matchesEmail && matchesPhone;
  });
  
  const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const attendees: attendeeType[] = filteredAttendees.slice(startIndex, endIndex);
    console.log(currentAttendees);

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

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <span className="text-gray-800 font-semibold">
            Showing {attendees.length} entries out of {allAttendees.length}
          </span>
        </div>
        <div className="flex justify-between flex-col-reverse min-[1440px]:flex-row gap-5 items-center">
          {/* Search inputs */}
          <div className="mb-2 flex justify-center flex-wrap gap-2">
            {/* Show dropdown */}
            <div className="mb-2 flex items-center h-full">
              <label htmlFor="itemsPerPage" className="mr-2 text-gray-800 font-semibold">
                Show:
              </label>
              <select
                id="itemsPerPage"
                className="border border-gray-500 rounded-md px-2 py-1 bg-white outline-none"
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
              className="border border-gray-500 rounded-md p-2 h-full bg-white outline-none text-black"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1); // Reset to the first page when searching
              }}
            />
            <input
              type="text"
              className="border border-gray-500 rounded-md p-2 h-full bg-white outline-none text-black"
              placeholder="Search by company"
              value={searchCompany}
              onChange={(e) => {
                setSearchCompany(e.target.value);
                setCurrentPage(1); // Reset to the first page when searching
              }}
            />
            <input
              type="text"
              className="border border-gray-500 rounded-md p-2 h-full bg-white outline-none text-black"
              placeholder="Search by designation"
              value={searchDesignation}
              onChange={(e) => {
                setSearchDesignation(e.target.value);
                setCurrentPage(1); // Reset to the first page when searching
              }}
            />
            <input
              type="text"
              className="border border-gray-500 rounded-md p-2 h-full bg-white outline-none text-black"
              placeholder="Search by email"
              value={searchEmail}
              onChange={(e) => {
                setSearchEmail(e.target.value);
                setCurrentPage(1); // Reset to the first page when searching
              }}
            />
            <input
              type="text"
              className="border border-gray-500 rounded-md p-2 h-full bg-white outline-none text-black"
              placeholder="Search by phone"
              value={searchPhone}
              onChange={(e) => {
                setSearchPhone(e.target.value);
                setCurrentPage(1); // Reset to the first page when searching
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
          <thead>
            <tr className="bg-klt_primary-500 text-white">
              <th className="py-3 px-4 text-start text-nowrap">#</th>
              <th className="py-3 px-4 text-start text-nowrap">Event</th>
              <th className="py-3 px-4 text-start text-nowrap">Name</th>
              <th className="py-3 px-4 text-start text-nowrap">Designation</th>
              <th className="py-3 px-4 text-start text-nowrap">Company</th>
              <th className="py-3 px-4 text-start text-nowrap">Email</th>
              <th className="py-3 px-4 text-start text-nowrap">Mobile</th>
              <th className="py-3 px-4 text-start text-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length > 0 ? (
              attendees.map((attendee, index) => (
                <tr key={attendee.uuid} className="bg-white border-b border-gray-400 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{startIndex + index + 1}</td>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.title}</td>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.first_name + ' ' + attendee.last_name}</td>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.job_title}</td>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.company_name}</td>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.email_id}</td>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.phone_number}</td>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{attendee.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-2 px-4 text-center text-gray-600">No attendees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total Entries Count and Pagination Controls */}
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
    </>
  );
};

export default AllAttendee;
