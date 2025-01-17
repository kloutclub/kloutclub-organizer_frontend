import React from 'react';
import ViewEvent from '../features/event/component/ViewEvent';
import { useParams } from 'react-router-dom';

// interface ViewEventPageProps {
//     uuid: string; // Make 'id' optional since it will be accessed via `useParams`
// }

const ViewEventPage: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    return <ViewEvent uuid={uuid} />
}

export default ViewEventPage;