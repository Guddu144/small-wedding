import { useState } from 'react';
import Image from 'next/image';
import { Images } from 'lucide-react';
import { uploadFilesToS3 } from '../../../../utils/uploadFilesTos3';


const AddVenueDrawer = ({ value, drawerOpen, setDrawerOpen, userRole, userEmail }:{value:any, drawerOpen:boolean, setDrawerOpen:any, userRole:string, userEmail:string}) => {
  const [newVenue, setNewVenue] = useState({
  name: '',
  description: '',
  address: '',
  location: 'california',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  phone: '',
  email: '',
  type: '',
  images: [] as File[],
  imagePreviewUrls: [] as string[]
});

  const handleVenueChange = (e) => {
    const { name, value } = e.target;
    setNewVenue(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
    
  //   const newImageUrls = files.map(file => URL.createObjectURL(file));
    
  //   setNewVenue(prev => ({
  //     ...prev,
  //     imagePreviewUrls: [...prev.imagePreviewUrls, ...newImageUrls]
  //   }));
  // };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  const newImageUrls = files.map(file => URL.createObjectURL(file));

  setNewVenue(prev => ({
    ...prev,
    images: [...prev.images, ...files],
    imagePreviewUrls: [...prev.imagePreviewUrls, ...newImageUrls]
  }));
};

const removeImage = (index: number) => {
  setNewVenue(prev => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index),
    imagePreviewUrls: prev.imagePreviewUrls.filter((_, i) => i !== index)
  }));
};

  // const removeImage = (index) => {
  //   setNewVenue(prev => ({
  //     ...prev,
  //     imagePreviewUrls: prev.imagePreviewUrls.filter((_, i) => i !== index)
  //   }));
  // };

const addVenue = async () => {
  try {
    const uploadedUrls = await uploadFilesToS3(newVenue.images);
    const payload = {
      venue_user: userEmail,
      venue_name: newVenue.name,
      phone_no: newVenue.phone,
      email: newVenue.email,
      address: {
        street: newVenue.street,
        city: newVenue.city,
        state: newVenue.state,
        zip: newVenue.zip,
        country: newVenue.country
      },
      gallery: uploadedUrls, 
      description: newVenue.description,
      type: newVenue.type,
      user_role: userRole
    };

    const reqOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_VENUE_URL}/venues`, reqOptions);

    if (!response.ok) throw new Error(`Failed to post data: ${response.statusText}`);

    setNewVenue({
      name: '',
      description: '',
      address: '',
      location: 'california',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: '',
      email: '',
      type: '',
      images: [],
      imagePreviewUrls: []
    });

    setDrawerOpen(false);
  } catch (error) {
    console.error("Error adding venue:", error);
    alert("Failed to add venue. Please try again.");
  }
};


  return (
    <div className={`fixed inset-0 bg-black/60 bg-opacity-50 z-40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white transform transition-transform duration-300 ease-in-out shadow-xl overflow-y-auto ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#0a3b5b]">Add New Venue</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setDrawerOpen(false)}
            >
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Venue Name */}
            <div>
              <label htmlFor="name" className="block text-[#0a3b5b] font-medium mb-2">Venue Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                placeholder="e.g. Ocean View Terrace" 
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
                value={newVenue.name}
                onChange={handleVenueChange}
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-[#0a3b5b] font-medium mb-2">Description</label>
              <textarea 
                id="description" 
                name="description"
                rows={4}
                placeholder="Describe your venue..." 
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
                value={newVenue.description}
                onChange={handleVenueChange}
                required
              />
            </div>
            
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-[#0a3b5b] font-medium mb-2">Address</label>
              <input 
                type="text" 
                id="address" 
                name="address"
                placeholder="Full street address" 
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
                value={newVenue.address}
                onChange={handleVenueChange}
                required
              />
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-[#0a3b5b] font-medium mb-2">Location</label>
              <select 
                id="location" 
                name="location"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#a89578] text-[#0a3b5b]"
                value={newVenue.location}
                onChange={handleVenueChange}
                required
              >
                <option value="california">California</option>
                <option value="texas">Texas</option>
                <option value="colorado">Colorado</option>
                <option value="south-carolina">South Carolina</option>
                <option value="washington">Washington</option>
                <option value="oregon">Oregon</option>
              </select>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-[#0a3b5b] font-medium mb-2">Upload Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input 
                  type="file" 
                  id="images" 
                  accept="image/*" 
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Images className="mx-auto h-12 w-12 text-gray-300" strokeWidth={1.5} />
                  <p className="mt-4 text-[#0a3b5b]">Drag and drop image files or click to upload</p>
                  <p className="mt-1 text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
              
              {/* Image Previews */}
              {newVenue.imagePreviewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {newVenue.imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <div className="relative h-24 rounded overflow-hidden">
                        <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
                      </div>
                      <button 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={() => removeImage(index)}
                      >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                className="h-12 px-8 py-4 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#a89578] inline-flex justify-center items-center transition-colors hover:brightness-110"
                onClick={addVenue}
              >
                <span className="text-center text-white font-semibold font-serif uppercase tracking-tight">ADD VENUE</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVenueDrawer;