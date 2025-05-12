"use client";
import React, { useEffect, useState } from "react";
import { fetchGetWishlist } from "../../../../../utils/dashboard";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Venue {
  user_role: string;
  venueId: string;
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
  featured_venue: boolean;
  gallery: string[];
  venue_status: string;
  description: string;
  venue_type: string;
  created_date: string;
  wishlistId: string;
  userId: string;
}
interface UserProps {
  userEmail: string;
}

const Wishlist: React.FC<UserProps> = ({ userEmail }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const getWishlist = async (userEmail: string) => {
    setLoading(true);
    try {
      const res = await fetchGetWishlist(userEmail);
      console.log(res);
      setVenues(res.result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlist(userEmail);
  }, []);

  const handleRemoveFromWishlist = async (
    userId: string,
    wishlistId: string,
    venue_id: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/venues/wishlist/delete?wishlistId=${wishlistId}`,
        {
          method: "DELETE",
          next: { revalidate: 0 },
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            wishlistId: wishlistId,
            venueId: venue_id,
          }),
        }
      );

      if (res.ok) {
        toast.success("Venue Delete from Wishlist Successfully!");
        await getWishlist(userEmail);
      }

      router.push("/dashboard/venue/wishlist");
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {venues.length > 0 &&
            venues?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="max-w-sm w-full bg-white border border-gray-200 rounded-xl shadow p-4 hover:shadow-lg transition relative"
                >
                  <img
                    src={
                      item?.gallery?.[0]
                        ?  item?.gallery?.[0]
                        : ""
                    }
                    alt={item?.venue_name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />

                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {item?.venue_name}
                  </h2>

                  <p className="text-sm text-gray-600 mb-2">
                    {item?.description || "No description available."}
                  </p>

                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Email:</strong> {item?.email}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Phone:</strong> {item?.phone_no}
                  </p>

                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Location:</strong> {item?.address?.city},
                    {item?.address?.state}, {item?.address?.country}
                  </p>

                  <p className="text-sm text-gray-500 mb-3">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        item?.venue_status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item?.venue_status}
                    </span>
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/venue/view/${item?.venueId}`)
                      }
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() =>
                        handleRemoveFromWishlist(
                          item?.userId,
                          item?.wishlistId,
                          item?.venueId
                        )
                      }
                      className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
