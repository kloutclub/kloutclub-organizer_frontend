import React, { useEffect, useState } from 'react';
import HeadingH2 from '../../../component/HeadingH2';
import DataTable from './DataTable';
import ScoreCard from '../../../component/ScoreCard';
import axios from 'axios';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import { useParams } from 'react-router-dom';

type MessageState = {
    _id: string;
    messageID: string;
    customerPhoneNumber: string;
    messageStatus: string;
    timestamp: string;
    __v: number;
}

type ReciptState = {
    _id: string;
    eventUUID: string;
    userID: string;
    firstName: string;
    messageID: MessageState;
    templateName: string;
    __v: number;
}


const WhatsAppReport: React.FC = () => {
    const {uuid} = useParams<{uuid: string}>();

    const [activeTab, setActiveTab] = useState<number>(1);
    const [selectedTemplate, setSelectedTemplate] = useState('event_downloadapp');
    const [allData, setAllData] = useState([]);
    const { user, loading } = useSelector((state: RootState) => state.auth);
    // const { currentEventUUID } = useSelector((state: RootState) => (state.events));
    const [totalMessage, setTotalMessage] = useState(0);
    const [totalDelivered, setTotalDelivered] = useState(0);
    const [totalRead, setTotalRead] = useState(0);
    const [totalFailed, setTotalFailed] = useState(0);
    const [changeCardStatus, setChangeCartStatus] = useState<string>("Sent");

    const userID = user?.id;
    console.log(userID);

    useEffect(() => {

        axios.post("https://app.klout.club/api/organiser/v1/whatsapp/all-recipt",
            {
                eventUUID: uuid,
                templateName: selectedTemplate,
                userID,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(res => {
                console.log(res.data.data);
                setAllData(res.data.data);
                setTotalMessage(res.data.data.length)
                const delivered = res.data.data.filter((item: ReciptState) => item.messageID && item.messageID.messageStatus !== "Failed");
                setTotalDelivered(delivered.length);
                const read = res.data.data.filter((item: ReciptState) => item.messageID && item.messageID.messageStatus === "Read");
                setTotalRead(read.length)
                const failed = res.data.data.filter((item: ReciptState) => item.messageID && item.messageID.messageStatus === "Failed");
                setTotalFailed(failed.length)
            })
    }, [selectedTemplate]);

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            {/* Heading  */}
            <div className="flex justify-between items-center w-full mb-6">
                <HeadingH2 title='WhatsApp Report' />

                {/* Custom Dropdown Menu */}
                <div className="flex justify-center rounded-md w-fit">
                    <select
                        className="font-medium text-sm text-black border border-klt_primary-600 p-2 rounded-md cursor-pointer"
                        value={activeTab}
                        onChange={(e) => {
                            const selectedTab = Number(e.target.value);
                            setActiveTab(selectedTab);
                            switch (selectedTab) {
                                case 1:
                                    setSelectedTemplate("event_downloadapp");
                                    break;
                                case 2:
                                    setSelectedTemplate("event_reminder_today");
                                    break;
                                case 3:
                                    setSelectedTemplate("event_poll_feedback");
                                    break;
                                case 4:
                                    setSelectedTemplate("reminder_iimm_v1");
                                    break;
                                case 5:
                                    setSelectedTemplate("session_reminder");
                                    break;
                                case 6:
                                    setSelectedTemplate("reminder_to_visit_booth");
                                    break;
                                case 7:
                                    setSelectedTemplate("day_2_reminder");
                                    break;
                                case 8:
                                    setSelectedTemplate("day_2_same_day_reminder");
                                    break;
                                case 9:
                                    setSelectedTemplate("post_thank_you_messageevent");
                                    break;
                                case 10:
                                    setSelectedTemplate("event_invitation");
                                    break;
                                default:
                                    break;
                            }
                            setChangeCartStatus("Sent");
                        }}
                    >
                        <option value={1}>Reminder</option>
                        <option value={2}>Same Day Invitation</option>
                        <option value={3}>Event Poll</option>
                        <option value={4}>Send Template Message</option>
                        <option value={5}>Session Reminder</option>
                        <option value={6}>Visit Booth</option>
                        <option value={7}>Day 2 Reminder</option>
                        <option value={8}>Day 2 Same Day Reminder</option>
                        <option value={9}>Thank You Message</option>
                        <option value={10}>Requested Attendees</option>
                    </select>
                </div>
            </div>
            {/* Custom Tab Menu */}
            {/* <div className='flex justify-center mx-auto rounded-md gap-3 flex-wrap w-fit'>
                    <div className={`font-medium rounded-md text-sm text-nowrap p-2 border border-klt_primary-600 cursor-pointer grid place-content-center ${activeTab === 1 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(1); setSelectedTemplate("event_downloadapp");  setChangeCartStatus("Sent")}}>Reminder</div>
                    <div className={`font-medium rounded-md text-sm text-nowrap p-2 border border-klt_primary-600 cursor-pointer rounded-x-md grid place-content-center ${activeTab === 2 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(2); setSelectedTemplate("event_reminder_today");  setChangeCartStatus("Sent")}}>Same Day Invitation</div>
                    <div className={`font-medium rounded-md text-sm text-nowrap p-2 border border-klt_primary-600 cursor-pointer rounded-x-md grid place-content-center ${activeTab === 3 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(3); setSelectedTemplate("event_poll_feedback");  setChangeCartStatus("Sent")}}>Event Poll</div>
                    <div className={`font-medium rounded-md text-sm text-nowrap p-2 border border-klt_primary-600 cursor-pointer rounded-x-md grid place-content-center ${activeTab === 4 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(4); setSelectedTemplate("reminder_iimm_v1");  setChangeCartStatus("Sent")}}>Send Template Message</div>
                    <div className={`font-medium rounded-md text-sm text-nowrap p-2 border border-klt_primary-600 cursor-pointer rounded-x-md grid place-content-center ${activeTab === 5 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(5); setSelectedTemplate("session_reminder");  setChangeCartStatus("Sent")}}>Session Reminder</div>
                    <div className={`font-medium rounded-md text-sm text-nowrap p-2 border border-klt_primary-600 cursor-pointer rounded-x-md grid place-content-center ${activeTab === 6 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(6); setSelectedTemplate("reminder_to_visit_booth");  setChangeCartStatus("Sent")}}>Visit Booth</div>
                    <div className={`font-medium rounded-md text-sm text-nowrap p-2 border border-klt_primary-600 cursor-pointer rounded-x-md grid place-content-center ${activeTab === 7 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(7); setSelectedTemplate("day_2_reminder");  setChangeCartStatus("Sent")}}>Day 2 Reminder</div>
                    <div className={`font-medium rounded-md text-sm text-nowrap p-2 border border-klt_primary-600 cursor-pointer rounded-x-md grid place-content-center ${activeTab === 8 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(8); setSelectedTemplate("day_2_same_day_reminder");  setChangeCartStatus("Sent")}}>Day 2 Same Day Reminder</div>
                    <div className={`font-medium rounded-md text-sm text-nowrap p-2 border border-klt_primary-600 cursor-pointer rounded-r-md grid place-content-center ${activeTab === 9 ? "text-white bg-klt_primary-500" : "text-black"}`} onClick={() => { setActiveTab(9); setSelectedTemplate("post_thank_you_messageevent");  setChangeCartStatus("Sent")}}>Thank You Message</div>
                </div> */}


            {/* Rendering Cards */}
            <div className='flex gap-5'>
                <div className='w-full grid grid-cols-4 gap-3'>
                    <div onClick={() => { setChangeCartStatus("Sent") }} className='cursor-pointer hover:scale-105 duration-500'>
                        <ScoreCard cardColor='blue' content={totalMessage} title='Sent Messages' />
                    </div>
                    <div onClick={() => { setChangeCartStatus("Delivered") }} className='cursor-pointer hover:scale-105 duration-500'>
                        <ScoreCard cardColor='green' content={totalDelivered} title='Delivered Messages' />
                    </div>
                    <div onClick={() => { setChangeCartStatus("Read") }} className='cursor-pointer hover:scale-105 duration-500'>
                        <ScoreCard cardColor='yellow' content={totalRead} title='Read Messages' />
                    </div>
                    <div onClick={() => { setChangeCartStatus("Failed") }} className='cursor-pointer hover:scale-105 duration-500'>
                        <ScoreCard cardColor='red' content={totalFailed} title='Failed Messages' />
                    </div>
                </div>
            </div>

            {/* Rendering Table */}
            <DataTable data={allData} cardStatus={changeCardStatus} type="whatsapp"/>

        </div>
    )
}

export default WhatsAppReport;