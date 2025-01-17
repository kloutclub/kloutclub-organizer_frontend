import React, { useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import Loader from '../../../component/Loader';

const AllSponsor: React.FC = () => {

  type sponsorType =  {
    uuid: string;
    title: string;
    first_name: string;
    job_title: string;
    company_name: string;
    email_id: string;
    phone_number: string;
    status: string;
    last_name: string;
  }

  const { allSponsors, loading } = useSelector((state: RootState) => state.sponsor);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allSponsors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentSponsors: sponsorType[] = allSponsors.slice(startIndex, endIndex);
  console.log(currentSponsors);

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

  if(loading) {
    return <Loader />
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-2">
          <span className="text-gray-800 font-semibold">
            Showing {currentSponsors.length} entries out of {allSponsors.length}
          </span>
        </div>
        <div className="mb-2">
          <label htmlFor="itemsPerPage" className="mr-2 text-gray-800 font-semibold">Show:</label>
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
              {currentSponsors.length > 0 ? (
                currentSponsors.map((attendee, index) => (
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
      </div>
    </>
  );
};

export default AllSponsor;
