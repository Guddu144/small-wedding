"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BiHeart } from "react-icons/bi";
import {
  fetchGetSuperadminVenueData,
  fetchGetVenueData,
} from "../../../utils/dashboard";
import DropdownMenu from "../Index/Dropdown/Dropdown";
import { FaCircleCheck } from "react-icons/fa6";
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
venue_status:string;
  description: string;
  venue_type: string;
  created_date: string;
}

interface UserProps {
  userRole: string;
}
const VenuesSuperadmin: React.FC<UserProps> = ({ userRole }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const fetchNewData = async () => {
    try {
      const fetchData = await fetchGetSuperadminVenueData();
      console.log(fetchData.result.venues);
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
          body: JSON.stringify({
            venue_id: venue_id,
            user_role: userRole,
          }),
        }
      );

      if (res.ok) {
        toast.success("Venue Delete Successfully!");
      }

      router.push("/dashboard");
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

  const [searchTerm, setSearchTerm] = useState("");
  const filteredVenues = venues.filter((venue) => {
    const name = venue.venue_name.toLowerCase();
    const country = venue.address.country.toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || country.includes(term);
  });

  const handleWishList = () => {
    router.push("/dashboard/venues/wishlist");
  };

  const [venueStatus, setVenueStatus] = useState(false);
  const [venueStatusMap, setVenueStatusMap] = useState<{
    [key: string]: boolean;
  }>({});

const handleVeneueStatus = async (venueId: string) => {
  setLoading(true);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/venues/acceptvenue/post`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId,
          user_role: "superadmin",
        }),
      }
    );

    if (res.ok) {
      toast.success("Status updated successfully!");
      // Update local state without refetching all
      setVenues((prev) =>
        prev.map((venue) =>
          venue.venueId === venueId
            ? {
                ...venue,
                venue_status:
                  venue.venue_status === "active" ? "pending" : "active",
              }
            : venue
        )
      );
    } else {
      toast.error("Failed to update status.");
    }
  } catch (error) {
    console.log(error);
    toast.error("Error updating status.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <div className="flex gap-12">
        {/* <Charts />
        <Charts2 /> */}
      </div>
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-3 md:space-y-0 pb-2 bg-white ">
        <div className="inline-flex items-center gap-2">
          <DropdownMenu />
        </div>
        <div className=" bg-white flex justify-end items-center">
          <Link
            href="/dashboard/create"
            className="text-xl font-bold bg-gray-200 mr-3 hover:bg-gray-400 rounded-[6px] w-8 h-8 flex items-center justify-center transition"
          >
            +
          </Link>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-100 focus:ring-blue-500 focus:border-blue-500  "
              placeholder="Search by venue name, location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
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
                <th className="px-6 py-3">Status</th>
                {userRole == "admin" ||
                userRole == "venueowner" ||
                userRole == "superadmin" ? (
                  <th className="px-6 py-3">Action</th>
                ) : (
                  ""
                )}
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
              ) : filteredVenues.length > 0 ? (
                filteredVenues.map((item, index) => (
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
                    <td className="px-6 py-4">
                      {item?.venueId}
                      {item?.gallery && (
                        <img
                          className="w-20 h-20 mt-2 object-cover"
                          src={
                            item?.gallery[0]
                              ? "https://www.theestateyountville.com/wp-content/uploads/2023/09/The-Estate-Yountville-Partner-Assets-DJI_0045-1_R-820x460.jpg"
                              : "No Image"
                          }
                          alt="venue"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">{item?.email}</td>
                    <td className="px-6 py-4">{item?.address.country}</td>
                  <td className="px-6 py-4">
  <button aria-label="Verified"
    onClick={() => {
      if (item.venue_status !== "active") {
        handleVeneueStatus(item.venueId);
      }
    }}
    disabled={item.venue_status === "active"}
    className={` flex justify-center items-center mx-auto ${
      item.venue_status === "active"
        ? "text-green-600 cursor-not-allowed text-[20px]"
        : "bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-white"
    }`}
  >
    {item.venue_status === "active" ? <FaCircleCheck /> : "Accept"}
  </button>
</td>

                    {userRole == "superadmin" ||
                    userRole == "admin" ||
                    userRole == "venueowner" ? (
                      <td className="px-6 py-4 text-right flex gap-3 items-center">
                        <Link
                          href={`/dashboard/venue/update/${item?.venueId}`}
                          className="font-medium bg-blue-600 text-white cursor-pointer px-4 py-1 rounded hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item?.venueId)}
                          className="font-medium bg-red-600 text-white  cursor-pointer px-4 py-1 rounded hover:underline"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleWishList()}
                          className="font-medium text-red-600 cursor-pointer py-1 rounded hover:underline text-[20px]"
                        >
                          <BiHeart />
                        </button>
                      </td>
                    ) : (
                      ""
                    )}
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
    </div>
  );
};

export default VenuesSuperadmin;
