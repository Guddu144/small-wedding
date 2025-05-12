"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DropdownMenu from "../Dropdown/Dropdown";
import toast from "react-hot-toast";
import { fetchGetVenueData } from "../../../../../utils/dashboard";

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

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Venue[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  const fetchSearchQuery = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/venues/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryKey: query }),
      });

      const data = await res.json();

      if (res.ok && data?.data?.venues?.length > 0) {
        toast.success("Search completed!");
        setResults(data.data.venues);
      } else {
        toast.error("No results found.");
        setResults([]);
      }
    } catch (error) {
      toast.error("Search failed.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewData = async () => {
    setLoading(true);
    try {
      const fetchData = await fetchGetVenueData();
      const sortedVenues = fetchData.result.venues.sort(
        (a: Venue, b: Venue) =>
          new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
      );
      setVenues(sortedVenues);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewData();
  }, []);

  const displayVenues = searchTerm ? results : venues;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-3 md:space-y-0 pb-2 bg-white">
        <div className="inline-flex items-center gap-2">
          <DropdownMenu />
        </div>
        <div className="bg-white flex justify-end items-center">
          <Link
            href="/dashboard/create"
            className="text-xl font-bold bg-gray-200 mr-3 hover:bg-gray-400 rounded-[6px] w-8 h-8 flex items-center justify-center transition"
          >
            +
          </Link>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchSearchQuery(searchTerm);
            }}
            className="relative"
          >
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
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
              className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by venue name, location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>

      <div className="mt-6">
        {loading && <p>Loading...</p>}

        {!loading && displayVenues.length > 0 ? (
          <ul className="space-y-3">
            {displayVenues.map((venue, index) => (
              <li key={index} className="p-4 border rounded-md bg-white shadow-sm">
                <p className="text-lg font-semibold">{venue.venue_name}</p>
                <p className="text-sm text-gray-600">{venue.email}</p>
                <p className="text-sm text-gray-500">
                  {venue.address.city}, {venue.address.state}, {venue.address.country}
                </p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(venue.created_date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          !loading && searchTerm && (
            <p className="text-gray-500 mt-4">No results found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default SearchBar;
