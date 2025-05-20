import React from 'react';

export default function AboutSection() {
  return (
    <section className="py-20 bg-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto text-center px-4 md:px-24">
        <p className="text-base md:text-xl/8 font-serif text-navy-900 mb-8">
          At Honoring Lifetimes, we believe every life deserves a meaningful tribute. For over 30 years, we've helped families in Napa Valley create heartfelt memorials that honor their loved ones. Our team listens carefully to ensure every detail reflects your wishes, providing comfort and support with trust and care.
        </p>
        <button
          className="h-12 px-6 py-4 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#a89578] inline-flex justify-center items-center gap-2.5 transition-colors hover:brightness-110 text-white text-base font-semibold font-['Lora'] uppercase leading-[14px] tracking-tight mx-auto w-full sm:w-auto"
          tabIndex={0}
          aria-label="Learn more about Honoring Lifetimes"
        >
          LEARN MORE
        </button>
      </div>
    </section>
  );
} 