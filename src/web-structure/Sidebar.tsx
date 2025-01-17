import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { heading } from "../features/heading/headingSlice";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { MdDashboard, MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { MdEmojiEvents } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { GoSponsorTiers } from "react-icons/go";
import { TbReportAnalytics } from "react-icons/tb";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { TbBorderAll } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";
import { IoPieChartSharp } from "react-icons/io5";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [showEvents, setShowEvents] = useState(false);
  const [collapse, setCollapse] = useState<boolean>(true);

  const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

  const { user } = useSelector((state: RootState) => state.auth);

  const toggleEventsMenu = () => {
    setShowEvents(!showEvents);
  };

  const handlePageTitle = (e: React.MouseEvent<HTMLElement>) => {
    dispatch(heading(e.currentTarget.innerText))
  }

  return (
    <div className={`relative min-h-screen ${collapse ? "w-44 xl:w-56" : "w-fit pt-[72px]"} flex-shrink-0 bg-klt_primary-900 text-white`}>
      {collapse && <span>
        {
          user?.company_logo &&
          <div className="border-b border-white">
            <img className="p-4 mx-auto h-[72px]" src={`${imageBaseUrl}/${user.company_logo}`} alt={user.company_name} />
          </div>
        }
        {!user?.company_logo && <div
          className="px-4 py-5 text-2xl font-bold border-b border-white-500"
          style={{ marginBottom: "30px" }}
        >
          KLOUT CLUB
        </div>
        }
      </span>}

      <div onClick={() => setCollapse(prev => !prev)} className="bg-white w-8 h-8 rounded-full absolute grid place-content-center top-1/2 -bottom-1/2 -translate-y-1/2 -right-4 shadow-lg cursor-pointer">
        <MdKeyboardDoubleArrowLeft className={`${!collapse ? "rotate-180" : "rotate-0"} size-7 text-black`} />
      </div>
      <ul className="my-5 space-y-2 h-[80vh] overflow-y-scroll">
        <li>
          <Link to="/" onClick={handlePageTitle} className="p-5 flex items-center gap-3 rounded font-semibold">
            <MdDashboard className="size-6" />
            {collapse &&
              <span>
                Dashboard
              </span>
            }
          </Link>
        </li>
        <li>
          <button
            onClick={toggleEventsMenu}
            className="p-5 rounded w-full text-left flex items-center justify-between"
          >
            <div className="flex gap-3 items-center">
              <MdEmojiEvents className="size-7" />
              {collapse && <span className="font-semibold">Events</span>}
            </div>
            {(showEvents && collapse) ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {showEvents && (
            <ul className={`${collapse ? "mx-4" : "mx-3"} bg-klt_primary-100 rounded`}>
              <li>
                <Link
                  to="/events"
                  onClick={handlePageTitle}
                  className="hover:bg-klt_primary-400 p-5 block rounded"
                >
                  <div className="flex gap-3 items-center">
                    <TbBorderAll className="size-5" />
                    {collapse && <span>
                      All Events
                    </span>}
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="/events/add-event"
                  onClick={handlePageTitle}
                  className="hover:bg-klt_primary-400 p-5 block rounded"
                >
                  <div className="flex gap-3 items-center">
                    <FaPlus className="size-5" />
                    {collapse && <span>
                      Add Event
                    </span>}
                  </div>
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link
            to="/all-attendees"
            onClick={handlePageTitle}
            className="p-5 block rounded font-semibold"
          >
            <div className="flex gap-3 items-center">
              <FaUsers className="size-6" />
              {collapse && <span>
                All Attendees
              </span>}
            </div>
          </Link>
        </li>
        <li>
          <Link
            to="/all-sponsors"
            onClick={handlePageTitle}
            className="p-5 block rounded font-semibold"
          >
            <div className="flex items-center gap-3">
              <GoSponsorTiers className="size-6" />
              {collapse && <span>
                All Sponsors
              </span>}
            </div>
          </Link>
        </li>
        {/* <li>
          <Link
            to="/settings"
            onClick={handlePageTitle}
            className="p-5 block rounded font-semibold"
          >
            Settings
          </Link>
        </li> */}
        {/* <li>
          <Link
            to="/profile"
            onClick={handlePageTitle}
            className="p-5 block rounded font-semibold"
          >
            Profile
          </Link>
        </li> */}
        <li>
          <Link
            to="/all-reports"
            onClick={handlePageTitle}
            className="p-5 block rounded font-semibold"
          >
            <div className="flex items-center gap-3 ">
              <TbReportAnalytics className="size-6" />
              {collapse && <span>
                All Reports
              </span>}
            </div>
          </Link>
        </li>

        <li>
          <Link
            to="/all-charts"
            onClick={handlePageTitle}
            className="p-5 block rounded font-semibold"
          >
            <div className="flex items-center gap-3 ">
              <IoPieChartSharp className="size-5" />
              {collapse && <span>
                All Charts
              </span>}
            </div>
          </Link>
        </li>
        {/* <li>
          <Link
            to="/all-charts"
            onClick={handlePageTitle}
            className="p-5 block rounded font-semibold"
          >
            All Charts
          </Link>
        </li> */}
        <li>
          <Link
            to="/all-photos"
            onClick={handlePageTitle}
            className="p-5 block rounded font-semibold"
          >
            <div className="flex items-center gap-3 ">
              <MdOutlinePhotoSizeSelectActual className="size-6" />
              {collapse && <span>
                All Photos
              </span>}
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
