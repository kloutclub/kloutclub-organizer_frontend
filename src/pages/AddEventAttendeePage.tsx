import React from 'react';
import AddEventAttendee from '../features/attendee/component/AddEventAttendee';
import { useParams } from 'react-router-dom';

const AddEventPage: React.FC = () => {
    const {uuid} = useParams<{uuid: string}>();
    return <AddEventAttendee uuid={uuid}/>
}

export default AddEventPage;