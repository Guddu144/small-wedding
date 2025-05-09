import Image from 'next/image';

const venues = [
  {
    name: 'Vineyard Deck',
    image: '/images/venues/image-1.jpg',
    area: '3,789 sq ft',
    guests: 350,
    description: 'Exchange vows or entertain guests while enjoying stellar valley views from this alluring outdoor wedding.',
  },
  {
    name: 'Village Lawn',
    image: '/images/venues/image-2.jpg',
    area: '3,789 sq ft',
    guests: 170,
    description: 'Adjacent to the Meritage Ballroom, the terrace is perfect for outdoor ceremonies and cocktail.',
  },
  {
    name: 'Fountain Courtyard',
    image: '/images/venues/image-3.jpg',
    area: '2,485 sq ft',
    guests: 295,
    description: 'Located off the spacious Carneros Ballroom, the covered Oakville Terrace can accommodate',
  },
];

export default function VenueSection() {
  return (
    <section className="py-20 bg-[#EAE4DA]">
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">VENUES</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {venues.map((venue) => (
            <div key={venue.name} className="bg-white rounded-2xl border border-[#eae5da] shadow p-2 md:p-3 flex flex-col items-start">
              <div className="w-full h-40 md:h-56 relative mb-4">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-navy-900 mb-2 md:mb-4">{venue.name}</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 mb-2 w-full">
                <div className="flex items-center gap-1 text-navy-900 text-sm md:text-base">
                  <svg className="w-5 h-5 text-[#a89578]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
                  {venue.area}
                </div>
                <div className="flex items-center gap-1 text-navy-900 text-sm md:text-base">
                  <svg className="w-5 h-5 text-[#a89578]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
                  {venue.guests} guests
                </div>
              </div>
              <p className="text-navy-900/80 text-sm md:text-base font-serif mb-4 md:mb-6">{venue.description}</p>
              <button className="w-full px-4 md:px-6 py-3 md:py-4 bg-[#0c3e58] rounded-[10px] inline-flex justify-center items-center gap-2.5">
                <div className="text-center text-[#f2cc91] text-sm md:text-base font-medium font-['Lora'] uppercase leading-none">VIEW MORE</div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 