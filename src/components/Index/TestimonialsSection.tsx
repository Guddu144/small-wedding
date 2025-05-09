import Image from 'next/image';

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center px-4 md:px-0">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-navy-900 mb-1">Testimonials</h3>
        <div className="italic text-base md:text-lg text-navy-900 mb-8">Kind Words from Families</div>
        {/* Testimonial illustration image */}
        <div className="mb-4 w-full flex justify-center">
          <Image
            src="/images/testimonial/testi1.png"
            alt="Testimonial illustration"
            width={400}
            height={200}
            className="mx-auto w-full max-w-[250px] md:max-w-[400px] h-auto"
            priority
          />
        </div>
        <blockquote className="text-base md:text-2xl font-serif text-navy-900 mb-6">“The team made my mother's memorial so special. They listened to every detail and created a day we'll always cherish.”</blockquote>
        <div className="text-[#b5853b] font-serif text-base md:text-lg mb-8">— Linda M., Napa Valley</div>
        <div className="flex items-center justify-center gap-4">
          <button className="w-10 h-10 rounded-full border border-[#eae5da] flex items-center justify-center text-navy-900 hover:bg-[#eae5da] transition text-xl md:text-2xl">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button className="w-10 h-10 rounded-full border border-[#eae5da] flex items-center justify-center text-navy-900 hover:bg-[#eae5da] transition text-xl md:text-2xl">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
} 