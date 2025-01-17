import React from 'react';
// import HeadingH2 from '../../component/HeadingH2';
import ChartCard from './components/ChartCard';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import Loader from '../../component/Loader';

const Charts: React.FC = () => {
  const { events, loading } = useSelector((state: RootState) => state.events);
  const imageBaseUrl: string = import.meta.env.VITE_API_BASE_URL;

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div>

        {/* For displaying all reports */}
        <div className='grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5'>
          {
            events.map((event) => (
              <ChartCard
                key={event.uuid}
                uuid={event.uuid}
                title={event.title}
                venue={event.event_venue_name}
                date={event.event_date}
                image={`${imageBaseUrl}/${event.image}`} />
            ))
          }
        </div>

      </div>
    </div>
  )
}

export default Charts;