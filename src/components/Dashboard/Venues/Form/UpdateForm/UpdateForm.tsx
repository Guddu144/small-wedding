"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import { fetchGetSingleVenueData } from "../../../../../../utils/dashboard";

interface Venue {
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

  featured_venue: boolean;
  gallery: string[];
  description: string;
  venue_type: string;
}

interface PropsSlug {
  slug: string;
}

const UpdateForm: React.FC<PropsSlug> = ({ slug }) => {
  const [venue, setVenue] = useState<Venue | null>(null);

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
    featured_venue: boolean;
    gallery: string[];
    description: string;
    venue_type: string;
  }>({
    user_role: "admin",

    venue_user: "",
    venue_name: "",
    phone_no: "",
    email: "",
    address: {
      country: "",
      state: "",
      city: "",
      street: "",
      zip_code: "",
    },

    featured_venue: false,
    gallery: [],

    description: "",
    venue_type: "event",
  });
  const router = useRouter();
  const [loading,setLoading]=useState(false)
  const getSingleData = async () => {
    try {
      const fetchData = await fetchGetSingleVenueData(slug);
      const venueData = fetchData?.result;
      setVenue(venueData);
      setFormData({
        user_role: "admin",
        venue_user: venueData?.venue_user || "",
        venue_name: venueData?.venue_name || "",
        phone_no: venueData?.phone_no || "",
        email: venueData?.email || "",
        address: {
          country: venueData?.address?.country || "",
          state: venueData?.address?.state || "",
          city: venueData?.address?.city || "",
          street: venueData?.address?.street || "",
          zip_code: venueData?.address?.zip_code || "",
        },
        featured_venue: venueData?.featured_venue || false,
        gallery: venueData?.gallery || [],
        description: venueData?.description || "",
        venue_type: venueData?.venue_type || "event",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (slug) {
      getSingleData();
    }
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked, files } = e.target;

    if (id === "gallery") {
      if (files) {
        const fileNames = Array.from(files).map((file) => file.name);
        setFormData((prev) => ({ ...prev, gallery: fileNames }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (
      ["country", "state", "city", "street", "zip_code"].includes(id)
    ) {
      const key = id === "state" ? "state" : id;
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/venues/update?venue_id=${slug}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        alert("Venue updated successfully!");
        window.location.href = "/dashboard";
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Post error:", error);
      alert("Something went wrong");
      setLoading(false)
    }
  };

  return (
    <div className="DialogContent2">
      <h1 className="text-center text-2xl py-10 font-semibold">Update Item</h1>
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-3 w-full max-w-2xl mx-auto space-y-4"
      >
        <div>
          <label
            htmlFor="venue_user"
            className="block text-sm font-medium text-gray-700"
          >
            Venue User
          </label>
          <input
            id="venue_user"
            type="text"
            value={formData.venue_user}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full rounded border p-2"
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
            disabled={loading}
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
            disabled={loading}
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
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Venue country
          </label>
          <input
            id="country"
            type="text"
            value={formData.address.country}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full rounded border p-2"
          />
        </div>

 <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            Venue state
          </label>
          <input
            id="state"
            type="text"
            value={formData.address.state}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full rounded border p-2"
          />
        </div>
         <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            Venue city
          </label>
          <input
            id="city"
            type="text"
            value={formData.address.city}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
            required
            className="w-full rounded border p-2"
          />
        </div>

  <div>
          <label
            htmlFor="zip_code"
            className="block text-sm font-medium text-gray-700"
          >
            Venue zip_code
          </label>
          <input
            id="zip_code"
            type="text"
            value={formData.address.zip_code}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured_venue"
            checked={formData.featured_venue}
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="featured_venue" className="text-sm text-gray-700">
            Featured Venue
          </label>
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
              disabled={loading}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
            />
            {venue?.gallery && venue?.gallery.length > 0 && (
              <div className="mt-3">
                <h4 className="font-semibold text-sm">
                  Current Gallery Images:
                </h4>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(venue?.gallery ?? []).length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-sm">
                        Current Gallery Images:
                      </h4>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {venue.gallery.map((image, index) => (
                          <div
                            key={index}
                            className="w-24 h-24 bg-gray-200 flex items-center justify-center"
                          >
                            <img
                              src={image}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Choose multiple images (JPG, PNG, etc.)
            </p>
          </div>
        </div>

        {loading ? (
  <div className="md:col-span-2 w-full text-center py-2">
    <span className="loader inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
  </div>
) : (
  <button
    type="submit"
    className="md:col-span-2 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-white"
  >
    Submit
  </button>
)}

      </form>
    </div>
  );
};

export default UpdateForm;
