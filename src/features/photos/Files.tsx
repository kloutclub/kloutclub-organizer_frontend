import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import Loader from '../../component/Loader';

interface FileProps {
    id: string;
    uuid?: string;
    setFiles: Function;
}

interface Response {
    name: string;
    url: string;
    path: string;
}

const Files: React.FC<FileProps> = (props) => {

    const [data, setData] = useState<Response[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        console.log(props.uuid, props.id);
        setLoading(true);
        axios.post("https://app.klout.club/api/organiser/v1/event-checkin/get-event-photos",
            {
                "eventUUID": props.uuid,
                "userID": props.id
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                setData(res.data.files);
                console.log(res);
                setLoading(false);
            })
    }, [props]);

    if (loading) {
        return <Loader />
    }

    return (
        <div className='w-full'>
            <IoMdArrowRoundBack onClick={() => props.setFiles(false)} className='bg-klt_primary-200 text-white cursor-pointer absolute size-8 p-2 rounded-full top-3 right-3' />

            <div className='grid grid-cols-3 mt-3 h-full gap-5 w-full'>
                {
                    data.map((item, index) => (
                        <div className='flex flex-col w-full h-44'>
                            <img src={item.url} alt={`Image ${index + 1}`} className='w-full h-44 object-cover'/>
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default Files;