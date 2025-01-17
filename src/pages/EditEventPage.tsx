import React from 'react';
import EditEvent from '../features/event/component/EditEvent';
import { useParams } from 'react-router-dom';

const AllAttendeePage: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    return <EditEvent uuid={uuid}/>
}

export default AllAttendeePage;