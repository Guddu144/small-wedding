"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import VenueModal from '../Dashboard/Venues/Popup/ViewMore';
import { fetchGetVenueData } from '../../../utils/dashboard';
import { Venue } from '../Dashboard/Venues/Venues';

const venues = [
  {
    name: 'Vineyard Deck',
    gallery:[ '/images/venues/image-1.jpg'],
    area: '3,789 sq ft',
    guests: 350,
    description: 'Exchange vows or entertain guests while enjoying stellar valley views from this alluring outdoor wedding.',
  },
  {
    name: 'Village Lawn',
    gallery: ['/images/venues/image-2.jpg'],
    area: '3,789 sq ft',
    guests: 170,
    description: 'Adjacent to the Meritage Ballroom, the terrace is perfect for outdoor ceremonies and cocktail.',
  },
  {
    name: 'Fountain Courtyard',
    gallery: ['/images/venues/image-3.jpg'],
    area: '2,485 sq ft',
    guests: 295,
    description: 'Located off the spacious Carneros Ballroom, the covered Oakville Terrace can accommodate',
  },
];


export default function VenueSection() {
  const [selectedVenue, setSelectedVenue] = useState<any|null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const fetchNewData = async () => {
      try {
        const fetchData = await fetchGetVenueData(1, 3, undefined,'user');
        const sortedVenues = fetchData.result.venues.sort(
          (a: Venue, b: Venue) =>
            new Date(b.created_date).getTime() -
            new Date(a.created_date).getTime()
        );
        setVenues(sortedVenues);
      } catch (error) {
        console.log(error);
      } 
    };
  
    useEffect(() => {
      fetchNewData();
    }, []);
  const handleOpenModal = (venue: any) => {
        setSelectedVenue(venue);
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };
  return (
    <section className="py-20 bg-[#EAE4DA]">
      {selectedVenue && (
                    <VenueModal
                      isOpen={isModalOpen}
                      onClose={handleCloseModal}
                      venue={selectedVenue}
                      showWishlist={false}
                    />
                  )}
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">VENUES</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {venues.length > 0 ? (
             venues.map((venue) => (
               <div key={venue.venueId} className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col h-full">
                 <div className="relative h-48">
                   <Image 
                     src={venue.gallery[0]}
                     alt={venue.venue_name}
                     fill
                     className="object-cover"
                   />
                 </div>
                 <div className="p-4 flex flex-col flex-grow">
                   <h3 className="text-[#0a3b5b] font-semibold text-xl mb-2">{venue.venue_name}</h3>
                   <p className="text-gray-600 text-sm mb-3 line-clamp-3 overflow-hidden overflow-ellipsis">
                     {venue.description}
                   </p>
                   <div className="flex items-center text-gray-500 mb-4">
                     <svg className="w-5 h-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                     </svg>
                     <span className="text-sm">{`${venue.address?.country}, ${venue.address?.state}, ${venue.address?.city}, ${venue.address?.street}`}</span>
                   </div>
                   <div className="flex justify-between mt-auto">
                    <button onClick={() => handleOpenModal(venue)} className="text-[#0a3b5b] font-medium text-sm border border-gray-200 rounded px-4 py-2 hover:bg-gray-100">
                      View More
                    </button>
                  </div>
                 </div>
               </div>
             ))
           ) : (
             <div className="col-span-full text-center py-8">
               <p className="text-[#0a3b5b] text-lg">No venues match your search criteria. Try adjusting your filters.</p>
             </div>
           )}
        </div>
      </div>
    </section>
  );
} 