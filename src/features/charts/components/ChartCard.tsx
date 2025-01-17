import React from 'react';
// import { FaWhatsapp } from "react-icons/fa";
import { IoPieChartSharp } from "react-icons/io5";
// import { FiMail } from "react-icons/fi";
import { MdDateRange, MdMyLocation } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import { eventUUID } from '../../event/eventSlice';
import { eventUUID } from '../../event/eventSlice';
import { heading } from '../../heading/headingSlice';

interface ChartCardProps {
    uuid: string;
    image: string;
    title: string;
    venue: string;
    date: string;
}

const ChartCard: React.FC<ChartCardProps> = (props) => {

    // console.log()

    const dispatch = useDispatch();

    return (
        <div className="card bg-base-100 shadow-xl rounded-lg">
            <figure>
                <img
                    src={props.image}
                    alt={"image"}
                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                />
            </figure>
            <div className="card-body p-3 text-black bg-white rounded-bl-lg rounded-br-lg">
                <h2 className="card-title mb-2">{props.title}</h2>
                <p className="inline-flex gap-2 items-start"><MdMyLocation className="text-2xl" /> {props.venue}</p>
                <p className="font-semibold inline-flex gap-2 items-center"><MdDateRange className="text-2xl" /> {props.date}</p>
                <div className="mt-2 flex items-center gap-2 rounded-bl-lg rounded-br-lg">

                    {/* Whatsapp Button */}
                    <Link to={`/all-charts/event-chart/${props.uuid}`} onClick={()=>{dispatch(eventUUID(props.uuid)); dispatch(heading("Chart Report"))}} className='active:scale-90 duration-300 w-full p-2 rounded-lg bg-amber-500 text-white text-xl grid place-content-center'>
                        <IoPieChartSharp />
                    </Link>

                    {/* Mail Button */}
                    {/* <Link to={`/all-reports/mail-report/${props.id}`} className='active:scale-90 duration-300 w-full p-2 rounded-lg bg-blue-500 text-white text-xl grid place-content-center'>
                        <FiMail />
                    </Link> */}
                </div>
                {/* <div className="card-actions justify-end">
                    <Link to='/events/view-event/' onClick={() => handleClick(eventuuid)} className="underline text-blue-800 hover:text-blue-900">{buttonTitle}</Link>
                </div> */}
            </div>
        </div>
        // <div className="card bg-base-100 shadow-xl rounded-lg min-w-96">
        //     <figure>
        //         <img
        //             src={props.image}
        //             alt={"image"}
        //             style={{ height: '200px', width: '100%', objectFit: 'cover' }}
        //         />
        //     </figure>
        //     <div className="card-body p-3 bg-white flex flex-row items-center gap-2 rounded-bl-lg rounded-br-lg">
        //         {/* Whatsapp Button */}
        //         <Link to={`/all-reports/whatsapp-report/${props.id}`} className='active:scale-90 duration-300 w-full p-2 rounded-lg bg-green-500 text-white text-xl grid place-content-center'>
        //             <FaWhatsapp />
        //         </Link>

        //         {/* Mail Button */}
        //         <button className='active:scale-90 duration-300 w-full p-2 rounded-lg bg-blue-500 text-white text-xl grid place-content-center'>
        //             <FiMail />
        //         </button>
        //     </div>
        // </div>
    )
}

export default ChartCard;