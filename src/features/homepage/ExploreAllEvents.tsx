import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Calender from "./calender.svg";
import { IoLocationSharp } from 'react-icons/io5';
import { convertDateFormat } from './utils';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../../component/Loader';
import { FaChevronDown } from "react-icons/fa6";
import { Helmet } from 'react-helmet-async';

const ExploreAllEvents: React.FC = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>("upcoming");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${apiBaseUrl}/api/all_events`)
      .then((res: any) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = res.data.data.filter((event: any) => {
          const eventDate = new Date(event.event_start_date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });

        const pastEvents = res.data.data.filter((event: any) => {
          const eventDate = new Date(event.event_start_date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate < today;
        }).sort((a: any, b: any) => {
          return new Date(b.event_start_date).getTime() - new Date(a.event_start_date).getTime();
        });

        // Extract unique cities from events
        const uniqueCities: any[] = Array.from(new Set(res.data.data.map((event: any) => {
          return event.city;
        })));

        setCities(uniqueCities);
        setAllEvents(upcomingEvents);
        setPastEvents(pastEvents);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const filterEventsByCity = (events: any[]) => {
    if (selectedCity === "all") return events;
    return events.filter(event => {
      return event.city === selectedCity;
    });
  };

  if (isLoading) {
    return <div className='w-full h-screen flex justify-center items-center'>
      <Loader />
    </div>
  }

  return (
    <div className='w-full h-full overflow-auto top-0 absolute left-0 bg-brand-foreground text-black'>
      <Helmet>
        <meta name="title" content="Discover & Attend Top Business Events in India | Klout Club" />
        <meta name="description" content="Explore exclusive corporate events, business summits, networking meetups, and industry conferences in India with Klout Club. Find top business summits, connect with professionals, and enhance your event experience." />
      </Helmet>
      <div className='!text-black w-full z-30 fixed top-0 left-0'>
        <Navbar />
      </div>

      {/* All events div */}
      <div className='max-w-screen-lg mx-auto mt-24 p-5'>
        <div className='space-y-5'>
          <h1 className='text-2xl font-semibold leading-none'>All Events</h1>
          <p className='leading-none'>Explore popular events near you, browse by category, or check out some of the great community calendars.</p>
        </div>

        <div className='mt-10'>
          <div className="mb-5 flex gap-4">
            <div className="relative">
              <select
                className="px-4 py-2 pr-10 border max-w-40 w-full border-gray-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
                value={selectedType}
                onChange={handleSelectChange}
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                className="px-4 py-2 pr-10 border border-gray-300 max-w-40 w-full rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
                value={selectedCity}
                onChange={handleCityChange}
              >
                <option value="all">All Cities</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            {selectedType === "upcoming" ? filterEventsByCity(allEvents).map((event, index) => (
              <Link to={`/explore-events/${event.slug}`} key={index}>
                <div className='flex gap-3 max-h-24'>
                  <img src={apiBaseUrl + "/" + event.image} alt="background" className='w-24 h-24 rounded-md object-center object-cover' />
                  <div className='space-y-2 overflow-hidden'>
                    <p className='text-sm text-brand-gray !leading-none truncate'>by {event?.company_name}</p>
                    <h1 className='text-xl font-semibold leading-none truncate'>{event.title}</h1>
                    <div className='flex gap-2 items-center'>
                      <img src={Calender} alt="calendar" className='w-4 h-4 flex-shrink-0' />
                      <p className='text-sm font-light text-brand-gray !leading-none truncate'>
                        {convertDateFormat(event.event_start_date)} | {event.start_time}:{event.start_minute_time} {event.start_time_type} - {event.end_time}:{event.end_minute_time} {event.end_time_type}
                      </p>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <IoLocationSharp className='w-4 h-4 text-brand-gray flex-shrink-0' />
                      <p className='text-sm font-light text-brand-gray !leading-none truncate'>{event.event_venue_name}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )) : filterEventsByCity(pastEvents).map((event, index) => (
              <Link to={`/explore-events/${event.slug}`} key={index}>
                <div className='flex gap-3 max-h-24'>
                  <img src={apiBaseUrl + "/" + event.image} alt="background" className='w-24 h-24 rounded-md object-center object-cover' />

                  <div className='space-y-2 overflow-hidden'>
                    <p className='text-sm text-brand-gray !leading-none truncate'>by {event?.company_name}</p>
                    <h1 className='text-xl font-semibold leading-none truncate'>{event.title}</h1>
                    <div className='flex gap-2 items-center'>
                      <img src={Calender} alt="calendar" className='w-4 h-4 flex-shrink-0' />
                      <p className='text-sm font-light text-brand-gray !leading-none truncate'>
                        {convertDateFormat(event.event_start_date)} | {event.start_time}:{event.start_minute_time} {event.start_time_type} - {event.end_time}:{event.end_minute_time} {event.end_time_type}
                      </p>
                    </div>
                    <div className='flex gap-2 items-center'>
                      <IoLocationSharp className='w-4 h-4 text-brand-gray flex-shrink-0' />
                      <p className='text-sm font-light text-brand-gray !leading-none truncate'>{event.event_venue_name}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExploreAllEvents;
