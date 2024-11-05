import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import HeadingH2 from '../../../component/HeadingH2';
import ScoreCard from '../../../component/ScoreCard';
import DataTable from './DataTable';
import MessageCard from './MessageCard';

const WhatsAppReport: React.FC = () => {

    const [activeTab, setActiveTab] = useState<number>(1);

    const { id } = useParams();
    console.log(id);

    return (
        <div>
            {/* Heading  */}
            <div className="mb-6 flex justify-between items-center">
                <HeadingH2 title='WhatsApp Report' />
            </div>

            {/* Custom Tab Menu */}
            <div className='flex rounded-md border border-klt_primary-500 w-fit'>
                <div className={`font-medium py-2 px-4 cursor-pointer rounded-l-md grid place-content-center ${activeTab===1? "text-white bg-klt_primary-500":"text-black"}`} onClick={()=>setActiveTab(1)}>Invitation</div>
                <div className={`font-medium py-2 px-4 border-x border-klt_primary-500 cursor-pointer grid place-content-center ${activeTab===2? "text-white bg-klt_primary-500":"text-black"}`} onClick={()=>setActiveTab(2)}>Reminder</div>
                <div className={`font-medium py-2 px-4 cursor-pointer rounded-r-md grid place-content-center ${activeTab===3? "text-white bg-klt_primary-500":"text-black"}`} onClick={()=>setActiveTab(3)}>Same Day Invitation</div>
            </div>

            {/* Rendering Cards */}
            <div className='flex gap-5'>
                <MessageCard color='blue' number={0} title='Sent Messages'/>
                <MessageCard color='green' number={0} title='Delivered Messages'/>
                <MessageCard color='yellow' number={0} title='Read Messages'/>
                <MessageCard color='red' number={0} title='Failed Messages'/>
                {/* <ScoreCard cardColor='blue' content={0} title='Sent Messages' key={1}/>
                <ScoreCard cardColor='green' content={0} title='Delivered Messages' key={2}/>
                <ScoreCard cardColor='yellow' content={0} title='Sent Messages' key={3}/>
                <ScoreCard cardColor='red' content={0} title='Sent Messages' key={4}/> */}
            </div>

            {/* Rendering Table */}
            <DataTable />

        </div>
    )
}

export default WhatsAppReport;