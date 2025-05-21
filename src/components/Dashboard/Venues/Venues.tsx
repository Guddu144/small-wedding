"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchGetVenueData,
} from "../../../../utils/dashboard";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import Image from "next/image";
import AddVenueForm from "./AddVenue";
import { useClerk } from "@clerk/nextjs";
import VenueModal from "./Popup/ViewMore";
export interface Venue {
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
  status?: string;
}

interface UserProps {
  userRole: string;
  userEmail: string;
}


  export const isValidImageUrl = (url: any) => {
  if (typeof url !== "string" || url.trim() === "") return false;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  if (url.startsWith("/")) return true; // from public folder
  return false;
};


const Venues: React.FC<UserProps> = ({ userRole, userEmail }) => {
  const { signOut } = useClerk();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<any|null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('venue');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const router = useRouter();
  const [formstate, setFormstate] = useState<"add"|"edit">("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const fetchNewData = async () => {
    setLoading(true);
    try {
      const fetchData = await fetchGetVenueData(1,500,userEmail,userRole);
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


    const handleLogout = () => {
      signOut(() => router.push('/'));
    };

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

  const filteredVenues = venues.filter((venue) => {
    const term = debouncedSearchTerm.toLowerCase();
    return (
      venue.venue_name.toLowerCase().includes(term) ||
      venue.address.country.toLowerCase().includes(term) ||
      venue.address.city.toLowerCase().includes(term) ||
      venue.address.state.toLowerCase().includes(term)
    
    );
  });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

    const handleOpenModal = (venue: Venue) => {
      setSelectedVenue(venue);
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {selectedVenue && (
              <VenueModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                venue={selectedVenue}
                showWishlist={false}
                // isInWishlist={wishlist.includes(selectedVenue.venueId)}
              />
            )}
      <header className="bg-[#0a3b5b] text-white px-3 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Image 
              src="/images/logos/logo.svg" 
              alt="Honoring Lifetimes" 
              width={200} 
              height={50}
              priority
            />
          </div>
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <div className="w-8 h-8 bg-[#a89578] rounded-full flex items-center justify-center text-white">
              <span>P</span>
            </div>
            <div 
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{userEmail}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-[#0a3b5b] hover:bg-gray-100 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-[#0a3b5b] hover:bg-gray-100 flex items-center"
                    onClick={handleLogout}
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#e0d8cb] mb-6">
          <button 
            className={`flex items-center gap-2 px-6 py-2 text-[#0C3E58] font-medium ${activeTab === 'venue' ? 'border-b-2 border-[#a89578]' : ''}`}
            onClick={() => setActiveTab('venue')}
          >
            <svg className="w-5 h-5 text-[#a89578]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7.184V6a2 2 0 00-2-2H7a2 2 0 00-2 2v1.184A3 3 0 004 10v10a1 1 0 001 1h14a1 1 0 001-1V10a3 3 0 00-1-2.816zM18 8a1 1 0 011 1v1h-2V8h1zM7 6h10v4H7V6zM6 8H5a1 1 0 00-1 1v1h2V8z" />
            </svg>
            MANAGE VENUE
          </button>
          <button 
            className={`flex items-center gap-2 px-6 py-4 text-[#0C3E58] font-medium ${activeTab === 'notification' ? 'border-b-2 border-[#a89578]' : ''}`}
            onClick={() => setActiveTab('notification')}
          >
            <svg className="w-5 h-5 text-[#a89578]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            NOTIFICATION
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex justify-between mb-8 px-6">
          <div className="flex gap-4 flex-1 max-w-3xl">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search By Venue Name, Country, City, State" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none text-[#0a3b5b] placeholder-gray-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="relative w-64">
              <select 
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md appearance-none focus:outline-none bg-white text-[#0a3b5b]"
                // value={locationFilter}
                // onChange={handleLocationChange}
              >
                <option value="">Location</option>
                <option value="california">California</option>
                <option value="texas">Texas</option>
                <option value="colorado">Colorado</option>
                <option value="south-carolina">South Carolina</option>
                <option value="washington">Washington</option>
                <option value="oregon">Oregon</option>
              </select>
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <button 
            className="bg-[#0a3b5b] text-white px-4 py-3 rounded-md font-medium flex items-center gap-2"
            onClick={() =>{ 
                  setDrawerOpen(true) ;
                  setFormstate("add")}}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            ADD NEW VENUE
          </button>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0a3b5b]"></div>
          </div>
        )}
        {/* Venues Grid */}
        {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-8">
          {/* New Venue Card */}
          <div 
            className="border border-gray-200 rounded-lg overflow-hidden bg-[#f7f4ef] flex flex-col items-center justify-center py-12 cursor-pointer"
            onClick={() => {setDrawerOpen(true); setFormstate("add")}}
          >
            <div className="w-16 h-16 bg-[#a89578] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-[#0a3b5b] font-medium text-center">ADD NEW VENUE</p>
          </div>

          {/* Venue Cards */}
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <div key={venue.venueId} className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col h-full">
                <div className="relative h-48">
                {isValidImageUrl(venue.gallery[0]) ? (
                  <Image
                    src={venue.gallery[0]}
                    alt={venue.venue_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    No image available
                  </div>
                )}
                                  {/* Heart icon in the corner */}
                  {/* <div className="absolute top-3 right-3 z-10">
                    <button 
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      onClick={() => toggleFavorite((venue.venueId))}
                      aria-label={favorites[venue.venueId] ? "Remove from favorites" : "Add to favorites"}
                    >
                      <svg className={`w-5 h-5 ${favorites[venue.venueId] ? 'text-red-500' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div> */}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-[#0a3b5b] font-semibold text-xl mb-2">{venue.venue_name}</h3>
                  {/* <p className="text-gray-600 text-sm mb-3">{venue.description}</p> */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 overflow-hidden overflow-ellipsis">
                    {venue.description}
                  </p>
                  <div className="flex items-center text-gray-500 mb-4">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{venue.address.country}</span>
                  </div>
                  <div className="flex justify-between mt-auto">
                    <div className="flex space-x-2">
                      <button className="p-2 border border-gray-200 rounded hover:bg-gray-100" onClick={()=>handleDelete(venue.venueId)}>
                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="p-2 border border-gray-200 rounded hover:bg-gray-100"  onClick={async () => {
                            setDrawerOpen(true); 
                            setSelectedVenue(venue);
                            setFormstate("edit");
                          }}>
                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <button onClick={() => handleOpenModal(venue)} className="text-[#0a3b5b] font-medium text-sm border border-gray-200 rounded px-4 py-2 hover:bg-gray-100">
                      View More
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-[#0a3b5b] text-lg">No venues match your search criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
        )}
      </main>
      <AddVenueForm value={selectedVenue} fetchNewData={fetchNewData}  drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} formstate={formstate} userRole={userRole} userEmail={userEmail}/>
    </div>
  );
};

export default Venues;
