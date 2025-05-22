'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchGetVenueData } from '../../../../../utils/dashboard';
import { isValidImageUrl, Venue } from '../../Venues/Venues';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ViewVenueModal from '../util-component/viewVenue';

export default function VenuesManagement({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [venues, setVenues] = useState<Venue[]>([]);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState({
    user_role: "superadmin",
    venue_name: "",
    phone_no: "",
    email: userEmail,
    address: {
      country: "",
      state: "",
      city: "",
      street: "",
      zip: "",
    },
    region_state: "",
    description: "",
    venue_type: "event",
    venue_status: "",
    gallery: [] as string[]
  });

  const fetchNewData = async () => {
    setLoading(true);
    try {
      const fetchData = await fetchGetVenueData(1, 600, userEmail, 'superadmin');
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
    // router.push('/dashboard/super-admin/add-venue');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const files = (e.target as HTMLInputElement).files;

    const addressFields = ["country", "state", "city", "street", "zip"];
    if (addressFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else if (name === "gallery") {
      const fileList = files;
      if (fileList) {
        const fileNames = Array.from(fileList).map((file) => file.name);
        setFormData((prev) => ({ ...prev, gallery: fileNames }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Open view modal
  const handleViewVenue = (venue: Venue) => {
    setCurrentVenue(venue);
    setIsViewModalOpen(true);
  };

  // Open edit modal
  const handleEditVenue = (venue: Venue) => {
    setCurrentVenue(venue);
    setFormData({
      user_role: "superadmin",
      description: venue.description || "",
      venue_name: venue?.venue_name || "",
      phone_no: venue?.phone_no || "",
      email: userEmail,
      address: {
        country: venue?.address?.country || "",
        state: venue?.address?.state || "",
        city: venue?.address?.city || "",
        street: venue?.address?.street || "",
        zip: venue?.address?.zip || "",
      },
      region_state: venue?.region_state || "",
      venue_type: venue?.venue_type || "event",
      venue_status: venue?.venue_status || "active",
      gallery: venue.gallery ? [...venue.gallery] : []
    });
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

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev?.gallery?.filter((_, i) => i !== index) || []
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const formData = new FormData();
  Array.from(files).forEach(file => formData.append('gallery', file));

  const res = await fetch('/api/upload-to-s3', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (data.success) {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...data.urls], 
    }));
  } else {
    toast.error('Upload failed');
  }
};


  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentVenue?.venueId) {
      toast.error("Venue ID is missing");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        user_role: formData.user_role,
        venue_name: formData.venue_name,
        phone_no: formData.phone_no,
        email: formData.email,
        description: formData.description,
        address: {
          country: formData.address.country,
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          zip: formData.address.zip,
        },
        venue_status: formData.venue_status,
        gallery: formData.gallery,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/venues/update?venue_id=${currentVenue.venueId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Venue updated successfully!");
        await fetchNewData();
        setIsEditModalOpen(false);
      } else {
        toast.error("Error: " + (data.error || "Failed to update venue"));
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Something went wrong while updating the venue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Title and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-[#0a3b5b]">VENUES MANAGEMENT</h1>
        {/* <button
          className="flex items-center gap-2 bg-[#0a3b5b] text-white px-4 py-2 rounded-lg"
          onClick={handleAddNewVenue}
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          ADD NEW VENUE
        </button> */}
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
                {venue?.gallery?.[0] && isValidImageUrl(venue.gallery[0]) ? (
                  <Image
                    src={venue.gallery[0]}
                    alt={venue.venue_name || 'Venue image'}
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
                    <h3 className="text-lg font-medium text-[#0a3b5b]">{venue.venue_name || 'Unnamed Venue'}</h3>
                    <p className="text-sm text-gray-500 mt-1">Owner: {venue.venue_user || 'Unknown'}</p>
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
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{venue.description || 'No description available'}</p>
                <div className="flex items-center text-gray-500 mt-2">
                  <svg className="w-4 h-4 mr-1 text-[#957748]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{`${venue.address?.country}, ${venue.address?.state}, ${venue.address?.city}, ${venue.address?.street}` || 'Location not specified'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Venue Modal */}
      {isViewModalOpen && currentVenue && (
        <ViewVenueModal
          isOpen={isViewModalOpen}
          currentVenue={currentVenue}
          setIsViewModalOpen={setIsViewModalOpen}
          handleEditVenue={handleEditVenue}
          handleDeleteClick={handleDeleteClick}
          getStatusBadgeClass={getStatusBadgeClass}
          isValidImageUrl={isValidImageUrl}
        />
      )}

      {/* Edit Venue Modal */}
      {isEditModalOpen && currentVenue && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-[#0a3b5b]">
                Edit Venue - {currentVenue.venue_name}
              </h3>
            </div>
            <form onSubmit={handleSubmitEdit}>
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h4 className="text-md font-medium text-[#0a3b5b] mb-3">Basic Information</h4>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name*</label>
                  <input
                    type="text"
                    name="venue_name"
                    value={formData.venue_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Type*</label>
                  <select
                    name="venue_type"
                    value={formData.venue_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                    required
                  >
                    <option value="event">Event</option>
                    <option value="photographer">Photographer</option>
                    <option value="catering">Catering</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                  <select
                    name="venue_status"
                    value={formData.venue_status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Address Information */}
                <div className="md:col-span-2 mt-4">
                  <h4 className="text-md font-medium text-[#0a3b5b] mb-3">Address Information</h4>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.address.zip}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  />
                </div>

                {/* Descriptions */}
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                    ></textarea>
                  </div>
                </div>

                {/* Gallery Section */}
                <div className="md:col-span-2">
                  <h4 className="text-md font-medium text-[#0a3b5b] mb-3">Gallery Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.gallery.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg">
                          {isValidImageUrl(imageUrl) ? (
                            <Image
                              src={imageUrl}
                              alt={`Venue image ${index + 1}`}
                              width={200}
                              height={200}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">Invalid image</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Image Upload */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add More Images</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        Upload Images
                      </label>
                      <span className="text-sm text-gray-500">Max 5 images</span>
                    </div>
                  </div>
                </div>

                {/* Owner Information (readonly) */}
                <div className="md:col-span-2">
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-1">Current Owner</p>
                    <p className="text-[#0a3b5b]">{currentVenue.venue_user} ({formData.email})</p>
                  </div>
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
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
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