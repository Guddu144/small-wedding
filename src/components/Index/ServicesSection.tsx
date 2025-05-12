import Image from 'next/image';

const services = [
  {
    title: 'Venue Selection',
    image: '/images/services/service1.png',
    description:
      'Our team is adept at finding the perfect setting that holds significance to your loved one and your family. Be it a serene outdoor location or a majestic hall, we work closely with prestigious venues to provide a fitting backdrop for the service.',
  },
  {
    title: 'Officiants',
    image: '/images/services/service2.png',
    description:
      
      `In today's connected world, we ensure that distance doesn't keep anyone from saying their goodbyes. With our filming and live streaming services, friends and family in the celebration, sharing in the moment of remembrance.`,
  },
  {
    title: 'Coordination',
    image: '/images/services/service3.png',
    description:
      `From the initial planning stages to the day of the event, our experienced coordinators are by your side. We handle all logistics, ensuring that the celebration flows seamlessly and every element comes together in harmony.`,
  },
  {
    title: 'Catering',
    image: '/images/services/service4.png',
    description:
      `Understanding the importance of gathering and sharing a meal in remembrance, we offer bespoke catering services. From traditional dishes to personalized menus that reflect the favorite flavors of the departed, our catering partners provide exceptional food and service.`,
  },
  {
    title: 'Music',
    image: '/images/services/service5.png',
    description:
      `Music stirs the soul and evokes memory. Our team can help select and organize live musicians or curated playlists that resonate with the theme of the service and the personality of your loved one, creating a poignant soundtrack to the day.`,
  },
  {
    title: 'Floral Arrangements',
    image: '/images/services/service6.png',
    description:
      `Flowers express what words cannot. We collaborate with skilled florists who can design and create beautiful arrangements that symbolize the beauty of life and the spirit of the one being memorialized.`,
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-[#0C3E58] relative overflow-hidden">
      {/* Decorative background image */}
      <div
        className="absolute top-0 right-0 w-full h-full z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/backdrop/pattern1.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
          backgroundSize: 'contain',
          opacity: 0.5,
        }}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-0">
        <h2 className="text-xl sm:text-2xl md:text-2xl font-serif font-semibold text-white mb-2 text-left">Our Services</h2>
        <p className="text-sm sm:text-base md:text-lg text-white/80 mb-10 text-left max-w-2xl">
          At Celebration of Life Concierge, every detail is an opportunity to honor a life well-lived. Whether you need end-to-end support or just a few key elements, our team crafts each service with compassion, expertise, and a deeply personal touch.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group [perspective:1000px]"
            >
              <div className="relative w-full h-48 sm:h-60 md:h-72 min-h-[260px] sm:min-h-[320px] md:min-h-[380px] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-xl shadow p-2 md:p-4 border border-[#ede7db] [backface-visibility:hidden]">
                  <div className="relative w-full h-32 sm:h-48 md:h-72 mb-4">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-contain w-full h-full"
                      priority
                    />
                  </div>
                  <div className="text-base sm:text-lg md:text-xl font-serif text-[#a89578] font-semibold mt-auto text-center mb-4 md:mb-8">
                    {service.title}
                  </div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 flex flex-col items-start justify-start bg-white rounded-xl shadow p-4 md:p-8 border border-[#ede7db] [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-navy-900 mb-3">{service.title}</h3>
                    <p className="text-navy-900 text-sm sm:text-base font-serif">{service.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 