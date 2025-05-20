import React from 'react';
import Image from 'next/image';

interface Venue {
  venue_name: string;
  description: string;
  address: any;
  area?: string;
  gallery: string[]; // Array of image URLs
}

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: Venue;
  onAddToWishlist?: () => void;
  isInWishlist?: boolean;
  showWishlist?: boolean;
}

const VenueModal: React.FC<VenueModalProps> = ({
  isOpen,
  onClose,
  venue,
  onAddToWishlist,
  isInWishlist = false,
  showWishlist = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 p-6 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-4xl text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-serif font-bold text-navy-900 mb-4">
          {venue.venue_name}
        </h2>

        {/* 2x2 Image Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {venue.gallery.slice(0, 4).map((image, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={image}
                alt={`${venue.venue_name} - Image ${index + 1}`}
                fill
                className="object-cover rounded-lg border"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm md:text-base font-serif mb-6">
          {venue.description}
        </p>

        {/* Address and Wishlist */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-auto">
          <div className="flex items-center text-gray-700 text-base mb-2 md:mb-0">
            <svg
              className="w-5 h-5 mr-2 text-[#957748]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {venue?.address?.country}{venue?.area} {venue?.address?.city?`, ${venue?.address?.city},${venue?.address?.state}`:''}
          </div>
        {showWishlist &&
          <button
            onClick={onAddToWishlist}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-[#0a3b5b] font-medium hover:bg-gray-50 transition-colors"
          >
            <svg
              className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {isInWishlist ? 'In your wishlist' : 'Add to wishlist'}
          </button>
          }
        </div>
      </div>
    </div>
  );
};

export default VenueModal;