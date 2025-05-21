"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchGetVenueData,
  fetchGetVenueDataById,
} from "../../../../utils/dashboard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BiHeart } from "react-icons/bi";
import { useDebounce } from "use-debounce";
import { IoBookmarkOutline } from "react-icons/io5";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import VenueModal from "../Venues/Popup/ViewMore";
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
  is_wishlist: boolean;
}

interface UserProps {
  userRole: string;
  userEmail: string;
  userId: string;
}

const Venues: React.FC<UserProps> = ({ userRole, userEmail, userId }) => {
  const { signOut } = useClerk();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const router = useRouter();
  const [favorites, setFavorites] = useState<{[key: string]: boolean}>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const fetchNewData = async () => {
    setLoading(true);
    try {
      const fetchData = await fetchGetVenueData(1, 10, userEmail);
      const sortedVenues = fetchData.result.venues.sort(
        (a: Venue, b: Venue) =>
          new Date(b.created_date).getTime() -
          new Date(a.created_date).getTime()
      );
      
      // Initialize favorites state based on is_wishlist property
      const initialFavorites: {[key: string]: boolean} = {};
      // const initialWishlist: string[] = [];
      
      // sortedVenues.forEach(venue => {
      //   initialFavorites[venue.venueId] = venue.is_wishlist;
      //   if (venue.is_wishlist) {
      //     initialWishlist.push(venue.venueId);
      //   }
      // });
      
      setFavorites(initialFavorites);
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

  const toggleFavorite = async (id: string) => {
    const isCurrentlyInWishlist = favorites[id] || venues.find(v => v.venueId === id)?.is_wishlist;
    
    // Update UI immediately for better user experience
    setFavorites(prev => ({
      ...prev,
      [id]: !isCurrentlyInWishlist
    }));
    
    // Update the venue's is_wishlist property in the venues state
    setVenues(prev => 
      prev.map(venue => 
        venue.venueId === id 
          ? { ...venue, is_wishlist: !isCurrentlyInWishlist } 
          : venue
      )
    );
    
    if (isCurrentlyInWishlist) {
      await handleRemoveWishList(userEmail, id.toString());
    } else {
      await handleAddWishList(userEmail, id.toString());
    }
  };

  const handleAddWishList = async (userEmail: string, venueId: string) => {
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
        const errorMessage = data.apiError?.error || data.error || "Failed to update wishlist";
        toast.error(errorMessage);
        // Revert UI changes if API call fails
        setFavorites(prev => ({
          ...prev,
          [venueId]: false
        }));
        setVenues(prev => 
          prev.map(venue => 
            venue.venueId === venueId 
              ? { ...venue, is_wishlist: false } 
              : venue
          )
        );
      }
    } catch (error) {
      console.error("Post error:", error);
      toast.error("Something went wrong");
      // Revert UI changes if API call fails
      setFavorites(prev => ({
        ...prev,
        [venueId]: false
      }));
      setVenues(prev => 
        prev.map(venue => 
          venue.venueId === venueId 
            ? { ...venue, is_wishlist: false } 
            : venue
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWishList = async (userEmail: string, venueId: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/venues/wishlist/delete/`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            venueId: venueId,
            userId: userEmail,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Venue removed from Wishlist!");
        router.refresh();
      } else {
        const errorMessage = data.apiError?.error || data.error || "Failed to remove from wishlist";
        toast.error(errorMessage);
        // Revert UI changes if API call fails
        setFavorites(prev => ({
          ...prev,
          [venueId]: true
        }));
        setVenues(prev => 
          prev.map(venue => 
            venue.venueId === venueId 
              ? { ...venue, is_wishlist: true } 
              : venue
          )
        );
      }
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Something went wrong");
      // Revert UI changes if API call fails
      setFavorites(prev => ({
        ...prev,
        [venueId]: true
      }));
      setVenues(prev => 
        prev.map(venue => 
          venue.venueId === venueId 
            ? { ...venue, is_wishlist: true } 
            : venue
        )
      );
    } finally {
      setLoading(false);
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
          onAddToWishlist={() => toggleFavorite(selectedVenue.venueId)}
          isInWishlist={selectedVenue.is_wishlist || favorites[selectedVenue.venueId] || false}
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
            <div className="relative">
              <svg 
                        className={`w-5 h-5  }`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>         
              {venues.filter(v => v.is_wishlist).length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {venues.filter(v => v.is_wishlist).length}
                </span>
              )}
            </div>
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
        {/* Search and filters */}
        <div className="flex justify-between mt-6 mb-8 px-6">
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
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-8">
          {/* Venue Cards */}
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <div key={venue.venueId} className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col h-full">
                <div className="relative h-48">
                  <Image 
                    src={venue.gallery[0]}
                    alt={venue.venue_name}
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-cover"
                  />
                  {/* Heart icon in the corner */}
                  <div className="absolute top-3 right-3 z-10">
                    <button 
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      onClick={() => toggleFavorite(venue.venueId)}
                      aria-label={favorites[venue.venueId] || venue.is_wishlist ? "Remove from favorites" : "Add to favorites"}
                    >
                      <svg 
                        className={`w-5 h-5 ${(favorites[venue.venueId] || venue.is_wishlist) ? 'text-red-500' : 'text-gray-300'}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-[#0a3b5b] font-semibold text-xl mb-2">{venue.venue_name}</h3>
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
      </main>
    </div>
  );
};

export default Venues;