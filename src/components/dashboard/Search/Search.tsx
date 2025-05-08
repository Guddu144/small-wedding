"use client";

import React, { useEffect, useState } from "react";
import TableInfo from "../Table/TableInfo";
import Link from "next/link";
import DropdownMenu from "../Dropdown/Dropdown";
import PopupContent from "../Popup/PopupContent";
import CreateForm from "../Form/CreateForm/CreateForm";

interface Venue{
  description:string
  venueId:string
  type:string
  email:string
  Status:string
  venue_name:string
  phone_no:number
  venue_location:string
  region_state:string
  featured_venue:string
  venue_status:string
  gallery: string[];
}

interface SearchBoxProps {
  currentPage: number;
  totalPages: number;
  currentData: Venue[];
  handlePrev: () => void;
  handleNext: () => void;
  venues: Venue[];
  loading: boolean;
  setCurrentPage: (page: number) => void;
  userRole:string
}


const SearchBox: React.FC<SearchBoxProps> = ({ userRole,setCurrentPage,venues, loading,currentPage,totalPages,currentData, handlePrev , handleNext }) => {
  const [query, setQuery] = useState("");

  const filteredAmiibos = venues.filter(
    (a) =>
 
    a.description.toLowerCase().includes(query.toLowerCase()) 
  
  );

  return (
    <>
   <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-3 md:space-y-0 pb-2 bg-white ">
 <div className="inline-flex items-center gap-2">
 <DropdownMenu/>
 <PopupContent/>
 </div>
      <div className=" bg-white flex justify-end items-center">
        <Link href='/dashboard/create' className="text-xl font-bold bg-gray-200 mr-3 hover:bg-gray-400 rounded-[6px] w-8 h-8 flex items-center justify-center transition">+</Link>
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
            placeholder="Search for items"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
   </div>
     
      <TableInfo userRole={userRole} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} currentData={currentData} handlePrev={handlePrev} handleNext={handleNext} venues={filteredAmiibos} loading={loading} />
    </>
  );
};

export default SearchBox;
