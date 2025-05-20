"use client";
import FooterSection from "@/components/Index/FooterSection";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { BiHeart } from "react-icons/bi";
import { fetchGetVenueData } from "../../../../utils/dashboard";
import toast, { Toaster } from "react-hot-toast";
import PopupContent from "@/components/Dashboard/Venues/Popup/PopupContent";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import VenueModal from "@/components/Dashboard/Venues/Popup/ViewMore";

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
}

const VenuesPage: React.FC<UserProps> = ({ userEmail }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<{[key: string]: boolean}>({});
  
  const router = useRouter();
  const fetchNewData = async () => {
    setLoading(true);
    try {
      const fetchData = await fetchGetVenueData();
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

  const toggleFavorite = async (id: string) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    await handleWishList(userEmail, id.toString());
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
const [open, setOpen] = useState(false);
  const handleWishList = async (userEmail: string, venueId: string) => {
    setLoading(true);

    try {
        if(!userEmail){
    // toast.error("No Email!");
    setOpen(true)
        }else{
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
      }}
    } catch (error) {
      console.error("Post error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (venue: Venue) => {
      setSelectedVenue(venue);
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  

  return (
    <main className="min-h-screen bg-[#f5f3ef]">
      {/* <Navbar /> */}
      {/* Hero Section */}
      {selectedVenue && (
              <VenueModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                venue={selectedVenue}
                onAddToWishlist={() => handleWishList(userEmail, selectedVenue.venueId)}
                isInWishlist={wishlist.includes(selectedVenue.venueId)}
              />
            )}
      
      <section className="relative h-[380px] md:h-[420px] flex items-center justify-center text-center overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src="/videos/cloud.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{ backgroundColor: "#082447", opacity: 0.5 }}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 z-10" />
        <div className="relative z-20 max-w-3xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4 mt-16">
            VENUES
          </h1>
          <p className="text-base md:text-md text-white/90 max-w-2xl mx-auto">
            Explore serene and meaningful venues designed to honor your loved
            one's memory with grace, beauty, and personal significance.
          </p>
        </div>
      </section>
      {/* Search Bar */}
      <section
        className="relative py-8 px-4 md:px-0"
        style={{
          background:
            "url(/images/backdrop/floral.png) right top/cover no-repeat, #f5f3ef",
        }}
      >
        <div className="max-w-4xl mx-auto mb-8">
          <form className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center bg-white rounded-lg px-4 py-3 w-full border border-[#d6c7a7] shadow">
              <svg
                className="w-5 h-5 text-[#a89578] mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search Location, Venue Name"
                className="bg-transparent outline-none border-none text-navy-900 placeholder:text-navy-900 font-serif text-base w-full"
                aria-label="Search venues"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] text-white font-serif text-base font-semibold uppercase tracking-tight shadow hover:brightness-110 transition-colors"
            >
              SEARCH
            </button>
            {userEmail && 
            <Link href='/dashboard/venue/wishlist' className="bg-[#000] text-white rounded-[10px] px-6 py-3 font-serif text-base font-semibold uppercase tracking-tight shadow hover:brightness-110 transition-colors">Wishlist</Link>
         } </form>
        </div>

      
   

              <PopupContent open={open} setOpen={setOpen}/>
        {/* Venues Grid */}
        {
        // loading ? (
        //   <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        //     <div className="bg-white rounded-2xl border border-[#eae5da] shadow p-4 flex flex-col gap-2 items-start">
        //       <div className="w-full h-56 bg-[#e6e6e6] rounded-[6px]"></div>
        //       <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px]"></div>
        //       <div className="flex justify-between gap-4 w-full">
        //         <div className="w-[120px] h-4 bg-[#e6e6e6] rounded-[6px]"></div>
        //         <div className="w-[120px] h-4 bg-[#e6e6e6] rounded-[6px]"></div>
        //       </div>
        //       <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px] mt-2"></div>
        //       <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px]"></div>

        //       <div className="w-full h-6 bg-[#e6e6e6] rounded-[6px] mt-2"></div>
        //     </div>

        //     <div className="bg-white rounded-2xl border border-[#eae5da] shadow p-4 flex flex-col gap-2 items-start">
        //       <div className="w-full h-56 bg-[#e6e6e6] rounded-[6px]"></div>
        //       <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px]"></div>
        //       <div className="flex justify-between gap-4 w-full">
        //         <div className="w-[120px] h-4 bg-[#e6e6e6] rounded-[6px]"></div>
        //         <div className="w-[120px] h-4 bg-[#e6e6e6] rounded-[6px]"></div>
        //       </div>
        //       <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px] mt-2"></div>
        //       <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px]"></div>

        //       <div className="w-full h-6 bg-[#e6e6e6] rounded-[6px] mt-2"></div>
        //     </div>
        //   </div>
        // ) :
        (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.length > 0 ? (
                        filteredVenues.map((venue) => (
                          <div key={venue.venueId} className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col h-full">
                            <div className="relative h-48">
                              <Image 
                                src={venue.gallery[0]}
                                alt={venue.venue_name}
                                fill
                                className="object-cover"
                              />
                              {/* Heart icon in the corner */}
                              <div className="absolute top-3 right-3 z-10">
                                <button 
                                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                  onClick={() => toggleFavorite(venue.venueId)}
                                  aria-label={favorites[venue.venueId] ? "Remove from favorites" : "Add to favorites"}
                                >
                                  <svg className={`w-5 h-5 ${favorites[venue.venueId] ? 'text-red-500' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
        )}
      </section>
      <FooterSection />
    </main>
  );
};

export default VenuesPage;
