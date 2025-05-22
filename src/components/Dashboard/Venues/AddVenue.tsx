"use client";
import { useEffect, useState } from 'react';
import { Images } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isValidImageUrl } from './Venues';

const AddVenueDrawer = ({ value, drawerOpen, setDrawerOpen, userRole, userEmail, formstate, fetchNewData }: 
  { value: any, drawerOpen: boolean, setDrawerOpen: any, userRole: string, userEmail: string, formstate: "add" | "edit", fetchNewData: () => Promise<void> }) => {
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const initialFormState = {
    user_role: "admin",
    venue_user: userEmail,
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
    gallery: [] as string[],
    description: "",
    venue_type: "event",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (drawerOpen && formstate === "add") {
      setFormData(initialFormState);
    }
    else if (drawerOpen && value) {
      setFormData({
        user_role: "admin",
        venue_user: userEmail,
        venue_name: value?.venue_name || "",
        phone_no: value?.phone_no || "",
        email: userEmail,
        address: {
          country: value?.address?.country || "",
          state: value?.address?.state || "",
          city: value?.address?.city || "",
          street: value?.address?.street || "",
          zip: value?.address?.zip || "",
        },
        region_state: value?.region_state || "",
        gallery: value?.gallery || [],
        description: value?.description || "",
        venue_type: value?.venue_type || "event",
      });
    }
  }, [drawerOpen, value, userEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target as HTMLInputElement;
    const addressFields = ["country", "state", "city", "street", "zip"];
    
    if (addressFields.includes(id)) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [id]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
    const requestData = {
      user_role: formData.user_role,
      venue_user: formData.venue_user,
      venue_name: formData.venue_name,
      phone_no: formData.phone_no,
      email: formData.email,
      address: {
        country: formData.address.country,
        state: formData.address.state,
        city: formData.address.city,
        street: formData.address.street,
        zip: formData.address.zip,
      },
      description: formData.description,
      venue_type: formData.venue_type,
      gallery: formData.gallery, // Include the gallery URLs
    };
      // Append gallery images (you'll need to implement actual file upload)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/venues/post`,
        {
          method: "POST",
          body: JSON.stringify(requestData),
        }
      );

      const data = await res.json();
      setDrawerOpen(false);
      await fetchNewData();

      if (res.ok) {
        toast.success("Venue created successfully!");
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (error) {
      console.error("Post error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEditVenue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value?.venueId) {
      toast.error("Venue ID is missing");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/venues/update?venue_id=${value.venueId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), 
        }
      );

      const data = await response.json();
      setDrawerOpen(false);
      await fetchNewData();
      
      if (response.ok) {
        toast.success("Venue updated successfully!");
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
    <div className={`fixed inset-0 bg-black/60 bg-opacity-50 z-40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white transform transition-transform duration-300 ease-in-out shadow-xl overflow-y-auto ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#0a3b5b]">{formstate === "add" ? `Add New Venue` : `Edit Venue`}</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setDrawerOpen(false)}
            >
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={formstate === "add" ? handleSubmit : handleEditVenue} className="space-y-6">
            {/* Venue Name */}
            <div>
              <label htmlFor="venue_name" className="block text-[#0a3b5b] font-medium mb-2">Venue Name</label>
              <input 
                type="text" 
                id="venue_name" 
                value={formData.venue_name}
                onChange={handleChange}
                placeholder="e.g. Ocean View Terrace" 
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-[#0a3b5b] font-medium mb-2">Description</label>
              <textarea 
                id="description" 
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your venue..." 
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone_no" className="block text-[#0a3b5b] font-medium mb-2">Phone No</label>
              <input 
                id="phone_no" 
                value={formData.phone_no}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
                required
              />
            </div>

            {/* Email (disabled) */}
            <div>
              <label htmlFor="email" className="block text-[#0a3b5b] font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
              />
            </div>

            {/* Address Fields */}
            <div>
              <label htmlFor="country" className="block text-[#0a3b5b] font-medium mb-2">Country</label>
              <input
                id="country"
                type="text"
                value={formData.address.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-[#0a3b5b] font-medium mb-2">State</label>
              <input
                id="state"
                type="text"
                value={formData.address.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-[#0a3b5b] font-medium mb-2">City</label>
              <input
                id="city"
                type="text"
                value={formData.address.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
              />
            </div>

            <div>
              <label htmlFor="street" className="block text-[#0a3b5b] font-medium mb-2">Street</label>
              <input
                id="street"
                type="text"
                value={formData.address.street}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
              />
            </div>

            <div>
              <label htmlFor="zip" className="block text-[#0a3b5b] font-medium mb-2">Zip Code</label>
              <input
                id="zip"
                type="text"
                value={formData.address.zip}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
              />
            </div>

            <div>
              <label htmlFor="venue_type" className="block text-[#0a3b5b] font-medium mb-2">Venue Type</label>
              <input
                id="venue_type"
                type="text"
                value={formData.venue_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
              />
            </div>
            
            {/* Gallery Section */}
            <div>
              <label className="block text-[#0a3b5b] font-medium mb-2">Gallery Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
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

              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input 
                  id="gallery"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="gallery" className="block cursor-pointer">
                  <Images className="mx-auto h-12 w-12 text-gray-300" strokeWidth={1.5} />
                  <p className="mt-4 text-[#0a3b5b]">Drag and drop image files or click to upload</p>
                  <p className="mt-1 text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="h-12 px-8 py-4 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#a89578] inline-flex justify-center items-center transition-colors hover:brightness-110"
                disabled={loading}
              >
                {loading ? (
                  <span className="text-center text-white font-semibold font-serif uppercase tracking-tight">Processing...</span>
                ) : (
                  <span className="text-center text-white font-semibold font-serif uppercase tracking-tight">
                    {formstate === "add" ? `ADD VENUE` : `UPDATE VENUE`}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVenueDrawer;