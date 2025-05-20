import Image from 'next/image';
import Link from 'next/link';

export default function FooterSection() {
  return (
    <footer className="w-full relative py-12 flex flex-col items-center justify-center gap-6 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/backdrop/footerback.jpg"
          alt="Footer background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Navy overlay for readability */}
        <div className="absolute inset-0 bg-[#18445A] opacity-10" />
      </div>
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/images/logos/logo.svg" alt="Honoring Lifetimes" width={220} height={60} className="mx-auto" priority />
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8 mr-8">
          <Link href="/our-story" className="text-white font-serif text-sm md:text-lg font-semibold hover:text-gold-400 transition-colors">OUR STORY</Link>
          <Link href="#services" className="text-white font-serif text-sm md:text-lg font-semibold hover:text-gold-400 transition-colors">SERVICES</Link>
          <Link href="#planning" className="h-12 px-6 py-4 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#a89578] inline-flex justify-center items-center gap-2.5 transition-colors hover:brightness-110 text-white text-base font-semibold font-['Lora'] uppercase leading-[14px] tracking-tight">LET'S START PLANING</Link>
          <Link href="#venues" className="text-white font-serif text-sm md:text-lg font-semibold hover:text-gold-400 transition-colors">VENUES</Link>
          <Link href="#contact" className="text-white font-serif text-sm md:text-lg font-semibold hover:text-gold-400 transition-colors">CONTACT</Link>
        </nav>
        {/* Copyright */}
        <div className="text-center w-full mt-4">
          <span className="text-white/40 text-base md:text-sm font-serif tracking-wide uppercase">
            © 2025 Honoring Lifetimes | ALL RIGHTS RESERVED
          </span>
        </div>
      </div>
    </footer>
  );
} 