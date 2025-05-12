"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { fetchGetVenueData } from '../../../../utils/dashboard';
import { BiHeart } from 'react-icons/bi';
import Link from 'next/link';
import toast from 'react-hot-toast';
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
  description: string;
  venue_type: string;
  created_date: string;
}

interface UserProps {
  userEmail: string;
  userRole:string;
}

const MyVenue: React.FC<UserProps> = ({ userEmail,userRole}) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const fetchNewData = async () => {
  setLoading(true);
  try {
    const fetchData = await fetchGetVenueData();
    const filteredVenues = fetchData.result.venues
      .filter((venue: Venue) => venue.venue_user === userEmail)
      .sort(
        (a: Venue, b: Venue) =>
          new Date(b.created_date).getTime() -
          new Date(a.created_date).getTime()
      );
    setVenues(filteredVenues);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchNewData();
  }, []);

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
            user_role: userRole,
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

  const handleDelete = async (venue_id: string) => {
    if (confirm("Are you sure you want to delete this venue?")) {
      await deleteVenue(venue_id);
      await fetchNewData();
    }
  };

  const handleWishList = async (userEmail: string, venueId: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/venues/wishlist/post`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            venue_id: venueId,
            userId: userEmail,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Venue added to Wishlist!");
        router.refresh();
      } else {
        toast.error("This venue is already added!");
      }
    } catch (error) {
      console.error("Post error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="pt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="px-6 py-3">Venue Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">VenueId</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Location</th>
             <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <div className="loader"></div>
                  </div>
                </td>
              </tr>
            ) : venues.length > 0 ? (
              venues.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:underline">
                    <Link href={`/dashboard/venue/view/${item?.venueId}`}>
                      {item?.venue_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{item?.description}</td>
                  <td className="px-6 py-4 flex gap-1">
           
                    {item?.gallery?.map((items,index)=>{
                        return(
                           <img key={index}
                          className="w-12 h-12 mt-2 object-cover"
                          src={
                            items
                              ? items
                              : "No Image"
                          }
                          alt="venue"
                        />
                        )
                      })}
                  </td>
                  <td className="px-6 py-4">{item?.email}</td>
                  <td className="px-6 py-4">{item?.address?.country}</td>
                
                    <td className="px-6 py-4 text-right flex gap-3 items-center">
                      
                    <>
                      <Link
                        href={`/dashboard/venue/update/${item?.venueId}`}
                        className="font-medium bg-blue-600 text-white cursor-pointer px-4 py-1 rounded hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item?.venueId)}
                        className="font-medium bg-red-600 text-white cursor-pointer px-4 py-1 rounded hover:underline"
                      >
                        Delete
                      </button>
                      </>
                        
                      <button
                        onClick={() => handleWishList(userEmail, item?.venueId)}
                        className="font-medium text-center flex justify-center items-center text-red-600 cursor-pointer  rounded hover:underline text-[20px]"
                      >
                     <BiHeart/>
                      </button>
                    </td>
               
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center px-6 py-4">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyVenue
