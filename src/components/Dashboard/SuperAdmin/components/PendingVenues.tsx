'use client';

import { useState } from 'react';
import Image from 'next/image';

type PendingVenue = {
  id: number;
  name: string;
  description: string;
  address: string;
  image: string;
  ownerName: string;
  submittedDate: string;
};

export default function PendingVenues() {
  const [pendingVenues, setPendingVenues] = useState<PendingVenue[]>([
    {
      id: 1,
      name: 'River View Halls',
      description: 'A serene venue overlooking the beautiful river with spacious halls for gatherings.',
      address: '123 Riverside Dr, Riverdale',
      image: '/images/venues/image-1.jpg',
      ownerName: 'John Smith',
      submittedDate: '2023-12-10'
    },
    {
      id: 2,
      name: 'Mountain View Retreat',
      description: 'Peaceful sanctuary nestled in the mountains with panoramic views and natural surroundings.',
      address: '456 Mountain Ridge Rd, Hillside',
      image: '/images/venues/image-1.jpg',
      ownerName: 'Sarah Johnson',
      submittedDate: '2023-12-15'
    },
    {
      id: 3,
      name: 'Seaside Memorial Center',
      description: 'Elegant waterfront venue perfect for memorial services with ocean views.',
      address: '789 Coastal Hwy, Beachtown',
      image: '/images/venues/image-1.jpg',
      ownerName: 'Michael Davis',
      submittedDate: '2023-12-18'
    }
  ]);

  // Handle venue approval
  const handleApproveVenue = (id: number) => {
    // Here you would call an API to approve the venue
    setPendingVenues(pendingVenues.filter(venue => venue.id !== id));
    alert(`Venue ID: ${id} has been approved`);
  };

  // Handle venue rejection
  const handleRejectVenue = (id: number) => {
    // Here you would call an API to reject the venue
    setPendingVenues(pendingVenues.filter(venue => venue.id !== id));
    alert(`Venue ID: ${id} has been rejected`);
  };

  return (
    <div>
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-[#0a3b5b]">PENDING VENUE LISTINGS</h1>
      </div>

      {pendingVenues.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">No pending venues to approve</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingVenues.map((venue) => (
            <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative">
                  <img 
                    src={venue.image} 
                    alt={venue.name}
                    className="w-full h-full object-cover object-center"
                    style={{ minHeight: '200px' }}
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-medium text-[#0a3b5b]">{venue.name}</h2>
                      <p className="text-sm text-gray-500 mb-2">
                        Submitted by: {venue.ownerName} on {new Date(venue.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApproveVenue(venue.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectVenue(venue.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mt-3">{venue.description}</p>
                  
                  <div className="flex items-center text-gray-500 mt-3">
                    <svg className="w-4 h-4 mr-1 text-[#957748]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{venue.address}</span>
                  </div>
                  
                  <div className="mt-4">
                    <button className="text-[#0a3b5b] flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 