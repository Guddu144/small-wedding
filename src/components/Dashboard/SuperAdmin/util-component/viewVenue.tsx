// ViewVenueModal.tsx
import React from 'react';
import Image from 'next/image';
import { Venue } from '../../Venues/Venues';


interface Props {
  isOpen: boolean;
  currentVenue: Venue;
  setIsViewModalOpen: (open: boolean) => void;
  handleEditVenue: (venue: Venue) => void;
  handleDeleteClick: (venue: Venue) => void;
  getStatusBadgeClass: (status: any) => string;
  isValidImageUrl: (url: string) => boolean;
}

const ViewVenueModal: React.FC<Props> = ({
  isOpen,
  currentVenue,
  setIsViewModalOpen,
  handleEditVenue,
  handleDeleteClick,
  getStatusBadgeClass,
  isValidImageUrl
}) => {
  if (!isOpen || !currentVenue) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-[#0a3b5b]">Venue Details</h3>
          <button
            onClick={() => setIsViewModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64 w-full">
              {isValidImageUrl(currentVenue?.gallery[0]) ? (
                <Image
                  src={currentVenue.gallery[0]}
                  alt={currentVenue.venue_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No image available
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-medium text-[#0a3b5b]">{currentVenue.venue_name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(currentVenue?.venue_status === 'active' ? 'active' : 'inactive')}`}>
                  {currentVenue?.venue_status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Owner</p>
                <p className="text-[#0a3b5b]">{currentVenue.venue_user}</p>
                <p className="text-sm text-gray-600">{currentVenue.email}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-[#0a3b5b]">{currentVenue.address.country}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Date Added</p>
                <p className="text-[#0a3b5b]">{new Date(currentVenue.created_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
            <p className="text-gray-700">{currentVenue.description}</p>
          </div>

          <div className="flex justify-end mt-8 gap-3">
            <button
              onClick={() => { setIsViewModalOpen(false); handleEditVenue(currentVenue); }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Venue
            </button>
            <button
              onClick={() => { setIsViewModalOpen(false); handleDeleteClick(currentVenue); }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Venue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVenueModal;
