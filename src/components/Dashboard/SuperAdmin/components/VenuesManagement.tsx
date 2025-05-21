'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchGetVenueData } from '../../../../../utils/dashboard';
import { isValidImageUrl, Venue } from '../../Venues/Venues';
import Image from 'next/image';
import toast from 'react-hot-toast';


export default function VenuesManagement({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [venues, setVenues] = useState<Venue[]>([]);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    status: 'active' as 'active' | 'inactive'
  });

  const fetchNewData = async () => {
      setLoading(true);
      try {
        const fetchData = await fetchGetVenueData(1,500,userEmail,'superadmin');
        const sortedVenues = fetchData.result.venues.sort(
          (a: Venue, b: Venue) =>
            new Date(b.created_date).getTime() -
            new Date(a.created_date).getTime()
        );
        setVenues(sortedVenues);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
      fetchNewData();
    }, []);

  // Handle add new venue
  const handleAddNewVenue = () => {
    router.push('/dashboard/super-admin/add-venue');
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open view modal
  const handleViewVenue = (venue: Venue) => {
    setCurrentVenue(venue);
    setIsViewModalOpen(true);
  };

  // Open edit modal
  const handleEditVenue = (venue: Venue) => {
    setCurrentVenue(venue);
    // setFormData({
    //   name: venue.name,
    //   description: venue.description,
    //   address: venue.address,
    //   status: venue.status
    // });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (venue: Venue) => {
  setCurrentVenue(venue);
  setIsDeleteModalOpen(true);
};

const handleConfirmDelete = async () => {
  if (currentVenue) {
    try {
      await deleteVenue(currentVenue.venueId);
      await fetchNewData();
      setIsDeleteModalOpen(false);
      toast.success("Venue deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete venue");
      console.error(error);
    }
  }
};

  // Submit form for editing a venue
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // if (currentVenue) {
    //   setVenues(venues.map(venue => 
    //     venue.id === currentVenue.id 
    //       ? { ...venue, ...formData } 
    //       : venue
    //   ));
      setIsEditModalOpen(false);
    }

  const deleteVenue = async (venue_id: string) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/venues/delete?venue_id=${venue_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            next: { revalidate: 0 },
            body: JSON.stringify({
              venue_id: venue_id,
              user_role: 'superadmin',
            }),
          }
        );
  
        if (res.ok) {
          toast.success("Venue Delete Successfully!");
        }
      } catch (error) {
        console.error("Delete error:", error);
      } finally {
        setLoading(false);
      }
    };

  // Get status badge class
  const getStatusBadgeClass = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border border-green-200' 
      : 'bg-red-100 text-red-800 border border-red-200';
  };

  return (
    <div>
      {/* Page Title and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-[#0a3b5b]">VENUES MANAGEMENT</h1>
        <button 
          className="flex items-center gap-2 bg-[#0a3b5b] text-white px-4 py-2 rounded-lg"
          onClick={handleAddNewVenue}
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          ADD NEW VENUE
        </button>
      </div>
      {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0a3b5b]"></div>
          </div>
        )}

      {/* Venues Grid */}
      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <div key={venue.venueId} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48 w-full"> 
          {isValidImageUrl(venue?.gallery[0]) ? (
            <Image
              src={venue.gallery[0]}
              alt={venue.venue_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
              No image available
            </div>
          )}
        </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-[#0a3b5b]">{venue.venue_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Owner: {venue.venue_user}</p>
                </div>
                <div className="flex">
                  <button 
                    onClick={() => handleViewVenue(venue)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleEditVenue(venue)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(venue)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{venue.description}</p>
              <div className="flex items-center text-gray-500 mt-2">
                <svg className="w-4 h-4 mr-1 text-[#957748]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{venue.address.country}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* View Venue Modal */}
      {isViewModalOpen && currentVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#0a3b5b]">
                Venue Details
              </h3>
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
                <div>
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
                    <h4 className="text-xl font-medium text-[#0a3b5b]">{currentVenue.venue_name }</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(currentVenue?.status?'active':'inactive')}`}>
                      {currentVenue?.status === 'active' ? 'Active' : 'Inactive'}
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
      )}

      {/* Edit Venue Modal */}
      {isEditModalOpen && currentVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-[#0a3b5b]">
                Edit Venue
              </h3>
            </div>
            <form onSubmit={handleSubmitEdit}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Current Owner</p>
                  <p className="text-[#0a3b5b]">{currentVenue.venue_user} ({currentVenue.email})</p>
                </div>
              </div>
              <div className="px-6 py-3 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a3b5b] text-white rounded-md hover:bg-[#0c4d76]"
                >
                  Update Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete Venue</h3>
              <p className="text-sm text-gray-500 text-center">
                Are you sure you want to delete {currentVenue.venue_name}? This action cannot be undone and will remove all associated data.
              </p>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 