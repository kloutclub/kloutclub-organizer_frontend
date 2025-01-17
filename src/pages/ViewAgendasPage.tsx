import React from 'react';
import ViewAgendas from '../features/event/component/ViewAgendas';
import { useParams } from 'react-router-dom';

const ViewAgendasPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  return (
    <ViewAgendas uuid={uuid}/>
  )
}

export default ViewAgendasPage;