"use client";
import React, { useState } from "react";
import './style.css'
import { useRouter } from "next/navigation";

const CreateForm = () => {
  const router=useRouter()
  const [formData, setFormData] = useState({
    user_role: "admin",
    venueId: "",
    serial_no: "",
    venue_user: "",
    venue_name: "",
    phone_no: "",
    email: "",
    venue_location: "",
    region_state: "",
    featured_venue: false,
    gallery: [],
    venue_status: "active",
    description: "",
    venue_type: "event",
  });

  const handleChange = (e:any) => {
    const { id, value, type, checked, files } = e.target;

    if (id === "gallery") {
      const fileNames = Array.from(files).map((file) => file.name);
      setFormData((prev) => ({ ...prev, gallery: fileNames }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/venues/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        alert("Venue added successfully!");
        router.push('/dashboard')
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Post error:", error);
      alert("Something went wrong");
    }
  };

  return (
  

<div className="DialogContent2">
    <h1 className="text-center text-2xl py-10 font-semibold">Create a New Item</h1>
<form onSubmit={handleSubmit} className=" grid md:grid-cols-2 gap-3 w-full max-w-2xl mx-auto space-y-4">
  <div>
    <label htmlFor="venueId" className="block text-sm font-medium text-gray-700">Venue ID</label>
    <input id="venueId" type="text" value={formData.venueId} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="serial_no" className="block text-sm font-medium text-gray-700">Serial No</label>
    <input id="serial_no" type="text" value={formData.serial_no} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="venue_user" className="block text-sm font-medium text-gray-700">Venue User</label>
    <input id="venue_user" type="text" value={formData.venue_user} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700">Venue Name</label>
    <input id="venue_name" type="text" value={formData.venue_name} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700">Phone No</label>
    <input id="phone_no" type="text" value={formData.phone_no} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
    <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="venue_location" className="block text-sm font-medium text-gray-700">Venue Location</label>
    <input id="venue_location" type="text" value={formData.venue_location} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="region_state" className="block text-sm font-medium text-gray-700">Region / State</label>
    <input id="region_state" type="text" value={formData.region_state} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
    <input id="description" type="text" value={formData.description} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="venue_type" className="block text-sm font-medium text-gray-700">Venue Type</label>
    <input id="venue_type" type="text" value={formData.venue_type} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div>
    <label htmlFor="venue_status" className="block text-sm font-medium text-gray-700">Venue Status</label>
    <input id="venue_status" type="text" value={formData.venue_status} onChange={handleChange} required className="w-full rounded border p-2" />
  </div>

  <div className="flex items-center gap-2">
    <input type="checkbox" id="featured_venue" checked={formData.featured_venue} onChange={handleChange} />
    <label htmlFor="featured_venue" className="text-sm text-gray-700">Featured Venue</label>
  </div>

  <div className="space-y-2">
  <label htmlFor="gallery" className="block text-sm font-semibold text-gray-800">
    Upload Gallery Images
  </label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-blue-500 transition">
    <input
      id="gallery"
      type="file"
      multiple
      onChange={handleChange}
      className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
    />
    <p className="mt-2 text-xs text-gray-500">
      Choose multiple images (JPG, PNG, etc.)
    </p>
  </div>
</div>


  <button type="submit" className=" md:col-span-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-white">
    Submit
  </button>
</form>
</div>


      
  );
};

export default CreateForm;

// "use client";
// import React, { useState } from "react";
// import { Dialog } from "radix-ui";
// import { RxCross2 } from "react-icons/rx";
// import './style.css'
// const CreateForm = () => {
//   const [formData, setFormData] = useState({
//     user_role: "admin",
//     venueId: "",
//     serial_no: "",
//     venue_user: "",
//     venue_name: "",
//     phone_no: "",
//     email: "",
//     venue_location: "",
//     region_state: "",
//     featured_venue: false,
//     gallery: [],
//     venue_status: "active",
//     description: "",
//     venue_type: "event",
//   });

//   const handleChange = (e:any) => {
//     const { id, value, type, checked, files } = e.target;

//     if (id === "gallery") {
//       const fileNames = Array.from(files).map((file) => file.name);
//       setFormData((prev) => ({ ...prev, gallery: fileNames }));
//     } else if (type === "checkbox") {
//       setFormData((prev) => ({ ...prev, [id]: checked }));
//     } else {
//       setFormData((prev) => ({ ...prev, [id]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/venues/post`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       console.log("Response:", data);

//       if (res.ok) {
//         alert("Venue added successfully!");
//       } else {
//         alert("Error: " + data.error);
//       }
//     } catch (error) {
//       console.error("Post error:", error);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <Dialog.Root>
//       <Dialog.Trigger asChild>
//         <button className="text-xl font-bold bg-gray-200 mr-3 hover:bg-gray-400 rounded-[6px] w-8 h-8 flex items-center justify-center transition">
//           +
//         </button>
//       </Dialog.Trigger>

//       <Dialog.Portal>
//         <Dialog.Overlay className="DialogOverlay2" />
//         <Dialog.Content className="DialogContent2 rounded-2xl shadow-xl">
//           <Dialog.Title className="text-2xl font-semibold text-center mb-6 text-gray-800">
//             Create a New Venue
//           </Dialog.Title>

//           <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
//   <div>
//     <label htmlFor="venueId" className="block text-sm font-medium text-gray-700">Venue ID</label>
//     <input id="venueId" type="text" value={formData.venueId} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="serial_no" className="block text-sm font-medium text-gray-700">Serial No</label>
//     <input id="serial_no" type="text" value={formData.serial_no} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="venue_user" className="block text-sm font-medium text-gray-700">Venue User</label>
//     <input id="venue_user" type="text" value={formData.venue_user} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700">Venue Name</label>
//     <input id="venue_name" type="text" value={formData.venue_name} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700">Phone No</label>
//     <input id="phone_no" type="text" value={formData.phone_no} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//     <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="venue_location" className="block text-sm font-medium text-gray-700">Venue Location</label>
//     <input id="venue_location" type="text" value={formData.venue_location} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="region_state" className="block text-sm font-medium text-gray-700">Region / State</label>
//     <input id="region_state" type="text" value={formData.region_state} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
//     <input id="description" type="text" value={formData.description} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="venue_type" className="block text-sm font-medium text-gray-700">Venue Type</label>
//     <input id="venue_type" type="text" value={formData.venue_type} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div>
//     <label htmlFor="venue_status" className="block text-sm font-medium text-gray-700">Venue Status</label>
//     <input id="venue_status" type="text" value={formData.venue_status} onChange={handleChange} required className="w-full rounded border p-2" />
//   </div>

//   <div className="flex items-center gap-2">
//     <input type="checkbox" id="featured_venue" checked={formData.featured_venue} onChange={handleChange} />
//     <label htmlFor="featured_venue" className="text-sm text-gray-700">Featured Venue</label>
//   </div>

//   <div>
//     <label htmlFor="gallery" className="block text-sm font-medium text-gray-700">Gallery Images</label>
//     <input id="gallery" type="file" multiple onChange={handleChange} className="w-full rounded border p-2" />
//   </div>

//   <button type="submit" className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-white">
//     Submit
//   </button>
// </form>


//           <Dialog.Close asChild>
//             <button className="IconButton2" aria-label="Close">
//               <RxCross2 />
//             </button>
//           </Dialog.Close>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

// export default CreateForm;
