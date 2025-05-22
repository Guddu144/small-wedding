import FooterSection from '@/components/Index/FooterSection';
import Navbar from '@/components/Index/Navbar';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ef]">
      <Navbar />
      {/* Hero Section with background video and form */}
      <section className="relative min-h-[560px] pb-16 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 h-[500px]">
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
          <div className="absolute top-0 left-0 w-full h-full z-0" style={{ backgroundColor: '#082447', opacity: 0.5 }} aria-hidden="true"></div>
        </div>
        
        {/* Content container */}
        <div className="relative z-10 max-w-6xl w-full mx-auto">
          {/* Heading */}
          <div className="pt-32 md:pt-36 pb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Contact us</h1>
            <p className="text-base md:text-md text-white/90 max-w-md">
              Got a question? You might find the answer in our Help centre. Otherwise, see all the ways you can speak to our team below.
            </p>
          </div>
          
          {/* Form and Images */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Form Card */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 md:p-8 border border-[#eae5da] z-10">
              <form className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-[#a89578] text-base font-serif mb-2">First Name</label>
                    <input type="text" className="w-full border border-[#eae5da] rounded-lg px-4 py-3 text-navy-900 bg-transparent focus:outline-none focus:border-[#a89578]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[#a89578] text-base font-serif mb-2">Last Name</label>
                    <input type="text" className="w-full border border-[#eae5da] rounded-lg px-4 py-3 text-navy-900 bg-transparent focus:outline-none focus:border-[#a89578]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#a89578] text-base font-serif mb-2">Email</label>
                  <input type="email" className="w-full border border-[#eae5da] rounded-lg px-4 py-3 text-navy-900 bg-transparent focus:outline-none focus:border-[#a89578]" />
                </div>
                <div>
                  <label className="block text-[#a89578] text-base font-serif mb-2">Message</label>
                  <textarea rows={6} className="w-full border border-[#eae5da] rounded-lg px-4 py-3 text-navy-900 bg-transparent focus:outline-none focus:border-[#a89578] resize-none" />
                </div>
                <div className="flex justify-end mt-2">
                  <button type="submit" className="h-12 px-10 py-4 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#a89578] inline-flex justify-center items-center gap-2.5 transition-colors hover:brightness-110">
                    <div className="text-center justify-start text-white text-base font-semibold font-['Lora'] uppercase leading-[14px] tracking-tight">SEND</div>
                  </button>
                </div>
              </form>
            </div>
            
            {/* Decorative Images */}
            <div className="hidden md:flex flex-col items-center justify-center gap-6 md:gap-8">
              <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-[#eae5da] shadow-lg">
                <Image src="/images/venues/image-1.jpg" alt="Venue 1" width={300} height={300} className="object-cover w-full h-full" />
              </div>
              <div className="flex gap-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#eae5da] shadow-lg">
                  <Image src="/images/venues/image-2.jpg" alt="Venue 2" width={150} height={150} className="object-cover w-full h-full" />
                </div>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#eae5da] shadow-lg">
                  <Image src="/images/venues/image-3.jpg" alt="Venue 3" width={150} height={150} className="object-cover w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile Decorative Images */}
      <div className="flex md:hidden flex-col items-center justify-center gap-6 mt-12 mb-16 px-6">
        <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-[#eae5da] shadow-lg">
          <Image src="/images/venues/image-1.jpg" alt="Venue 1" width={300} height={300} className="object-cover w-full h-full" />
        </div>
        <div className="flex gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#eae5da] shadow-lg">
            <Image src="/images/venues/image-2.jpg" alt="Venue 2" width={150} height={150} className="object-cover w-full h-full" />
          </div>
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#eae5da] shadow-lg">
            <Image src="/images/venues/image-3.jpg" alt="Venue 3" width={150} height={150} className="object-cover w-full h-full" />
          </div>
        </div>
      </div>
      
      <FooterSection />
    </main>
  );
} 