"use client";
import React, { useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserProps {
  userEmail: string;
}
const CreateForm:React.FC<UserProps> = ({userEmail}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<{
    user_role: string;

    venue_user: string;
    venue_name: string;
    phone_no: string;
    email: string;
    address: {
      country: string;
      state: string;
      city: string;
      street: string;
      zip_code: string;
    };
    region_state: string;
    gallery: string[];

    description: string;
    venue_type: string;
  }>({
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
      zip_code: "",
    },
    region_state: "",

    gallery: [],
 
    description: "",
    venue_type: "event",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value, type, checked, files } = e.target;

  // Handle nested address fields
  const addressFields = ["country", "state", "city", "street", "zip_code"];
  if (addressFields.includes(id)) {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [id]: value,
      },
    }));
  } else if (id === "gallery") {
    const fileList = files;
    if (fileList) {
      const fileNames = Array.from(fileList).map((file) => file.name);
      setFormData((prev) => ({ ...prev, gallery: fileNames }));
    }
  } else if (type === "checkbox") {
    setFormData((prev) => ({ ...prev, [id]: checked }));
  } else {
    setFormData((prev) => ({ ...prev, [id]: value }));
  }
};


  const handleSubmit = async (e: any) => {
    e.preventDefault();
   
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/venues/post`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log("Response:", data);

     if (res.ok) {

        toast.success("Venue created successfully!");
       router.push('/dashboard')
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Post error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false); // Allow re-submission after process completes
    }
  };

  return (
  <>
        {loading ? 
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="loader"></div>
        </div> :
   
    <div className="DialogContent2 ">
      <h1 className="text-center text-2xl pt-4 pb-8 font-semibold">
        Create a New Item
      </h1>
      <form
        onSubmit={handleSubmit}
        className=" grid md:grid-cols-2 gap-x-3 w-full max-w-2xl mx-auto space-y-4"
      >
  
        <div className="hidden">
        
          <input
            id="venue_user"
            type="text"
            value={formData.venue_user}
            hidden
            disabled
             
            required
            className="w-full rounded border p-2 bg-[#f5f5f5]"
          />
        </div>

        <div>
          <label
            htmlFor="venue_name"
            className="block text-sm font-medium text-gray-700"
          >
            Venue Name
          </label>
          <input
            id="venue_name"
            type="text"
            value={formData.venue_name}
            onChange={handleChange}
             
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label
            htmlFor="phone_no"
            className="block text-sm font-medium text-gray-700"
          >
            Phone No
          </label>
          <input
            id="phone_no"
            type="text"
            value={formData.phone_no}
            onChange={handleChange}
             
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            disabled
            required
            className="w-full rounded border p-2 bg-[#f5f5f5]"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
             Country
          </label>
          <input
            id="country"
            type="text"
            value={formData.address.country}
            onChange={handleChange}
             
            required
            className="w-full rounded border p-2"
          />
        </div>
          <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
             State
          </label>
          <input
            id="state"
            type="text"
            value={formData.address.state}
            onChange={handleChange}
             
            required
            className="w-full rounded border p-2"
          />
        </div>
          <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
             City
          </label>
          <input
            id="city"
            type="text"
            value={formData.address.city}
            onChange={handleChange}
             
            required
            className="w-full rounded border p-2"
          />
        </div>
          <div>
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700"
          >
             Street
          </label>
          <input
            id="street"
            type="text"
            value={formData.address.street}
            onChange={handleChange}
             
            required
            className="w-full rounded border p-2"
          />
        </div>
          <div>
          <label
            htmlFor="zip_code"
            className="block text-sm font-medium text-gray-700"
          >
             Zip Code
          </label>
          <input
            id="zip_code"
            type="text"
            value={formData.address.zip_code}
            onChange={handleChange}
             
            required
            className="w-full rounded border p-2"
          />
        </div>

      

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
             
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label
            htmlFor="venue_type"
            className="block text-sm font-medium text-gray-700"
          >
            Venue Type
          </label>
          <input
            id="venue_type"
            type="text"
            value={formData.venue_type}
            onChange={handleChange}
             
            required
            className="w-full rounded border p-2"
          />
        </div>



        <div className="space-y-2">
          <label
            htmlFor="gallery"
            className="block text-sm font-semibold text-gray-800"
          >
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


  <button
    type="submit"
    className="md:col-span-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-white"
  >
    Submit
  </button>

      </form>
    </div>}
     </>

  );
};

export default CreateForm;
