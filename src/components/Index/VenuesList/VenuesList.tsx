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

  return (
    <main className="min-h-screen bg-[#f5f3ef]">
      {/* <Navbar /> */}
      {/* Hero Section */}

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

            <Link href='/dashboard/venue/wishlist' className="bg-[#000] text-white rounded-[10px] px-6 py-3 font-serif text-base font-semibold uppercase tracking-tight shadow hover:brightness-110 transition-colors">Wishlist</Link>
          </form>
        </div>
              <PopupContent open={open} setOpen={setOpen}/>
        {/* Venues Grid */}
        {loading ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-[#eae5da] shadow p-4 flex flex-col gap-2 items-start">
              <div className="w-full h-56 bg-[#e6e6e6] rounded-[6px]"></div>
              <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px]"></div>
              <div className="flex justify-between gap-4 w-full">
                <div className="w-[120px] h-4 bg-[#e6e6e6] rounded-[6px]"></div>
                <div className="w-[120px] h-4 bg-[#e6e6e6] rounded-[6px]"></div>
              </div>
              <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px] mt-2"></div>
              <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px]"></div>

              <div className="w-full h-6 bg-[#e6e6e6] rounded-[6px] mt-2"></div>
            </div>

            <div className="bg-white rounded-2xl border border-[#eae5da] shadow p-4 flex flex-col gap-2 items-start">
              <div className="w-full h-56 bg-[#e6e6e6] rounded-[6px]"></div>
              <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px]"></div>
              <div className="flex justify-between gap-4 w-full">
                <div className="w-[120px] h-4 bg-[#e6e6e6] rounded-[6px]"></div>
                <div className="w-[120px] h-4 bg-[#e6e6e6] rounded-[6px]"></div>
              </div>
              <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px] mt-2"></div>
              <div className="w-full h-4 bg-[#e6e6e6] rounded-[6px]"></div>

              <div className="w-full h-6 bg-[#e6e6e6] rounded-[6px] mt-2"></div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#eae5da] shadow p-4 flex flex-col items-start"
              >
                <div className="w-full h-56 relative mb-4">
                  <img
                    src={item?.gallery[0]}
                    alt={item?.venue_name}
                    className="object-cover rounded-xl w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">
                  {item?.venue_name}
                </h3>
                <div className="flex items-center gap-6 mb-2">
                  <div className="flex items-center gap-1 text-navy-900 text-base">
                    <svg
                      className="w-5 h-5 text-[#a89578]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 9h6v6H9z" />
                    </svg>
                    {item?.address?.city}
                  </div>
                  <div className="flex items-center gap-1 text-navy-900 text-base">
                    <svg
                      className="w-5 h-5 text-[#a89578]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
                    </svg>
                    {item?.phone_no}
                  </div>
                </div>
                <p className="text-navy-900 text-base font-serif mb-6">
                  {item?.description}
                </p>
                <div className="flex justify-between w-full gap-4">
                  <button className="w-full px-6 py-4 bg-[#0c3e58] rounded-[10px] inline-flex justify-center items-center gap-2.5">
                    <div className="text-center text-[#f2cc91] text-base font-medium font-['Lora'] uppercase leading-none">
                      VIEW MORE
                    </div>
                  </button>
                  <button
                    onClick={() => handleWishList(userEmail, item?.venueId)}
                    className="font-medium text-center flex justify-center items-center text-red-600 cursor-pointer  rounded hover:underline text-[20px]"
                  >
                    <BiHeart />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <FooterSection />
        <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontSize: "16px",
            fontWeight: "600",
            background: "#fff",
            zIndex: "99999999",
          },
          duration: 5000,
          removeDelay: 5000,
        }}/>
    </main>
  );
};

export default VenuesPage;
