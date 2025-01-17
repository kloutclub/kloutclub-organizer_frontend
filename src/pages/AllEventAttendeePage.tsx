import React from 'react';
import AllEventAttendee from '../features/attendee/component/AllEventAttendee';
import { useParams } from 'react-router-dom';

const AllEventAttendeePage: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    return <AllEventAttendee uuid={uuid}/>
}

export default AllEventAttendeePage;