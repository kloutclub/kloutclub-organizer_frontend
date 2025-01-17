import React, { useEffect, useState } from 'react';
import { TiChevronLeft, TiChevronRight } from 'react-icons/ti';

type MessageState = {
  _id: string;
  messageID: string | null;
  customerPhoneNumber?: string | null;
  customerEmail?: string | null;
  messageStatus: string | null;
  timestamp: string | null;
  __v: number;
}

type ReciptState = {
  _id: string;
  eventUUID: string;
  userID: string;
  firstName: string;
  messageID: MessageState | null; // Allowing null if messageID is not provided
  templateName: string;
  __v: number;
}

type DataTableProps = {
  data: ReciptState[];
  cardStatus: string;
  type: "whatsapp" | "email";
};

const DataTable: React.FC<DataTableProps> = ({ data, cardStatus, type }) => {
  // console.log(data, cardStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');

  useEffect(() => {
    setCurrentPage(1);
  }, [cardStatus]);

  const filteredData = data.filter((data: ReciptState) => {
    const nameMatch = nameFilter ? data.firstName.toLowerCase().includes(nameFilter.toLowerCase()) : true;
    const phoneMatch = phoneFilter
      ? data.messageID?.customerPhoneNumber?.includes(phoneFilter)
      : true;
    const emailMatch = emailFilter ? data.messageID?.customerEmail?.includes(emailFilter) : true;
    // const emailMatch = emailFilter ? data.messageID?.customerEmail?.toLowerCase().includes(emailFilter.toLowerCase()) : true;


    // Handle messageStatus filter logic: handle cases where messageStatus might be missing
    const cardStatusMatch = cardStatus
      ? cardStatus === "Sent"
        ? data.messageID && ["Sent", "Delivered", "Read", "Bounce", "Delivery"].includes(data.messageID.messageStatus || "")
        : data.messageID && data.messageID.messageStatus === cardStatus
      : true;

    // Ensure that records with missing fields like messageID or messageStatus are still included in filtering
    if (type === "email") {
      return nameMatch && emailMatch && cardStatusMatch;
    }
    else {
      return nameMatch && phoneMatch && cardStatusMatch;
    }
  });

  console.log("Filtered Data is: ", filteredData);

  function normalDateFormat(date: string | null) {
    if (!date) return 'N/A';  // Gracefully handle missing date
    const newDate = new Date(date);
    return newDate.toLocaleString();
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const renderPaginationNumbers = () => {
    const paginationNumbers: JSX.Element[] = [];
    const delta = 2;

    paginationNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`p-1 px-3 border rounded-md bg-klt_primary-600 text-white ${currentPage === 1 ? 'bg-green-200' : 'bg-klt_primary-600/30'}`}
      >
        1
      </button>
    );

    if (currentPage > delta + 2) {
      paginationNumbers.push(
        <span key="ellipsis-start" className="p-1 px-3 text-gray-500">...</span>
      );
    }

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

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

    if (currentPage < totalPages - delta - 1) {
      paginationNumbers.push(
        <span key="ellipsis-end" className="p-1 px-3 text-gray-500">...</span>
      );
    }

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

  return (
    <div className="text-black py-10 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <div className="mb-2 flex items-center">
          <label htmlFor="itemsPerPage" className="mr-2 text-gray-800 font-semibold">
            Show:
          </label>
          <select
            id="itemsPerPage"
            className="border border-gray-500 rounded-md p-2 bg-white outline-none"
            value={itemsPerPage}
            onChange={(e) => { setCurrentPage(1); setItemsPerPage(Number(e.target.value)) }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="mb-2 flex gap-2">
          <input
            type="text"
            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
            placeholder="Search by name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          {type === "whatsapp" && <input
            type="tel"
            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
            placeholder="Search by Phone No."
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
          />}
          {type === "email" && <input
            type="email"
            className="border border-gray-500 rounded-md p-2 bg-white outline-none text-black"
            placeholder="Search by Email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />}
        </div>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-gray-100 rounded-lg shadow-md border border-gray-400">
          <thead>
            <tr className="bg-klt_primary-500 text-white">
              <th className="py-3 px-4 text-start text-nowrap">S.No</th>
              <th className="py-3 px-4 text-start text-nowrap">Name</th>
              <th className="py-3 px-4 text-start text-nowrap">{type === "whatsapp" ? "Phone No." : "Email"}</th>
              <th className="py-3 px-4 text-start text-nowrap">Message Status</th>
              <th className="py-3 px-4 text-start text-nowrap">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-3 px-4 text-center text-gray-500">
                  Nothing found
                </td>
              </tr>
            ) : (
              currentData.map((data, index) => (
                <tr key={data._id}>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{startIndex + index + 1}</td>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">{data.firstName}</td>
                  {type === "whatsapp" && <td className="py-3 px-4 text-gray-800 text-nowrap">
                    {data.messageID?.customerPhoneNumber || 'N/A'} {/* Fallback for missing phone number */}
                  </td>}
                  {type === "email" && <td className="py-3 px-4 text-gray-800 text-nowrap">
                    {data.messageID?.customerEmail || 'N/A'} {/* Fallback for missing email */}
                  </td>}
                  <td className="py-3 px-4 text-gray-800 text-nowrap">
                    {data.messageID?.messageStatus || 'Pending'} {/* Fallback for missing message status */}
                  </td>
                  <td className="py-3 px-4 text-gray-800 text-nowrap">
                    {normalDateFormat(data.messageID?.timestamp || null)} {/* Fallback for missing timestamp */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
  );
};

export default DataTable;
