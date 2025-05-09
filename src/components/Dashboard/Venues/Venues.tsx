"use client";
import React, { useEffect, useState } from "react";
import { fetchGetVenueData } from "../../../../utils/dashboard";
import SearchBox from "./Search/Search";
import PopupContent from "./Popup/PopupContent";
import { Charts } from "./Charts/Charts";
import { Charts2 } from "./Charts/Charts2";

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

interface UserProps{
  userRole:string
}
const Venues:React.FC<UserProps> = ({userRole}) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchNewData = async () => {
    try {
      const fetchData = await fetchGetVenueData();
      console.log(fetchData.result.venues);
      setVenues(fetchData.result.venues);
    
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewData();
  }, []);

  const totalPages = Math.ceil(venues.length / itemsPerPage);
  const currentData = venues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  return (
    <div>
      <div className="flex gap-12">
        {/* <Charts />
        <Charts2 /> */}
      </div>
      <SearchBox userRole={userRole} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} currentData={currentData} handlePrev={handlePrev} handleNext={handleNext} venues={venues} loading={loading} />

    </div>
  );
};

export default Venues;
