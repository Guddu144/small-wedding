import FooterSection from "@/components/Index/FooterSection";
import Link from "next/link";


const services = [
  {
    title: 'Venue Selection',
    image: '/images/services/service1.png',
    description:
      'Our team is adept at finding the perfect setting that holds significance to your loved one and your family. Be it a serene outdoor location or a majestic hall, we work closely with prestigious venues to provide a fitting backdrop for the service.',
  },
  {
    title: 'officiants',
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
  {
    title: 'Cremation, Burial Arrangements, and Scatterings:',
    image: '/images/services/service7.png',
    description:
      `We offer respectful assistance with cremation and burial arrangements, including eco-friendly and traditional options. For those wishing to return their loved one to the earth or sea, we can arrange scatterings that are meaningful and serve as a beautiful tribute.`,
  },
];

export default function ServicesPage() {
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
        style={{ backgroundColor: '#082447', opacity: 0.5 }}
        aria-hidden="true"
      ></div>
        <div className="absolute inset-0 z-10" />
        <div className="relative z-20 max-w-3xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4 mt-16">SERVICES</h1>
          <p className="text-base md:text-md text-white/90 max-w-2xl mx-auto">
            At Celebration of Life Concierge, we understand that saying goodbye is a deeply personal affair, and the way it's conducted should reflect the unique life it commemorates. We are here to ensure that every aspect of the celebration is managed with dignity, respect, and a personal touch that honors the memory of your loved one. Whether you require comprehensive support or select services, we are committed to tailoring a package that best serves your needs and fits the wishes of the departed.
          </p>
        </div>
      </section>
      {/* Services Grid Section */}
      <section className="relative py-16 px-4 md:px-0" style={{background: 'url(/images/backdrop/floral.png) right top/cover no-repeat, #f5f3ef'}}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {services.map((service, idx) => (
            idx === services.length - 1 ? (
              <div key={service.title} className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row relative min-h-[320px] md:col-span-2 lg:col-span-full xl:col-span-full items-center md:items-stretch">
                <div className="w-full md:w-1/2 flex justify-center items-center mb-4 md:mb-0 md:mr-8">
                  <img src={service.image} alt={service.title} className="h-80 object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-center w-full md:w-1/2">
                  <Link href="#book" className="absolute top-6 right-6 text-[#b5853b] text-sm font-serif font-semibold hover:underline md:static md:self-end md:mb-2">BOOK NOW</Link>
                  <h3 className="text-lg md:text-xl font-serif font-bold text-navy-900 mb-2 mt-8 md:mt-0">{service.title}</h3>
                  <p className="text-navy-900 text-base font-serif">{service.description}</p>
                </div>
              </div>
            ) : (
              <div key={service.title} className="bg-white rounded-2xl shadow p-6 flex flex-col relative min-h-[320px]">
                <Link href="#book" className="absolute top-6 right-6 text-[#b5853b] text-sm font-serif font-semibold hover:underline">BOOK NOW</Link>
                <div className="w-full flex justify-center mb-4">
                  <img src={service.image} alt={service.title} className="h-56 object-contain" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-navy-900 mb-2">{service.title}</h3>
                <p className="text-navy-900 text-base font-serif">{service.description}</p>
              </div>
            )
          ))}
        </div>
      </section>
      <FooterSection />
    </main>
  );
} 