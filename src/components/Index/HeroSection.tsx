'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SignedOut } from '@clerk/nextjs';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Toggle audio playback
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  // Initialize video and audio when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error("Video autoplay failed:", error));
    }
  }, []);

  return (
    <section className="relative min-h-[80vh] h-screen flex items-center text-white justify-center text-center overflow-hidden">
      {/* Video Background */}
      <video 
        ref={videoRef}
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
      
      {/* Blue Overlay */}
      <div 
        className="absolute top-0 left-0 w-full h-full z-0" 
        style={{ backgroundColor: '#082447', opacity: 0.5 }}
        aria-hidden="true"
      ></div>
      
    
      

      
      <div className="z-10 max-w-4xl mx-auto px-4 md:px-0">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif font-semibold mb-4">
          A Lifetime of Memories<br />
          One Beautiful Celebration
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-8 text-gray-300">
          Let us help plan a memorable end-of-life celebration for your loved one.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          <Link 
            href="#planning" 
            className="h-12 px-6 py-4 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#a89578] inline-flex justify-center items-center gap-2.5 transition-colors hover:brightness-110 w-full sm:w-auto" 
            tabIndex={0}
            aria-label="Let's Start Planning"
          >
            <div className="text-center justify-start text-white text-base font-semibold font-['Lora'] uppercase leading-[14px] tracking-tight">Let's Start Planning</div>
          </Link>
          <Link href="tel:707-226-5235" tabIndex={0} aria-label="Call us at 707-226-5235" className="w-full sm:w-auto">
            <div className="px-6 py-4 bg-gradient-to-b from-white/0 to-white/30 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/40 inline-flex justify-center items-center gap-2 w-full sm:w-auto">
           
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2z" />
              </svg>
              <div className="text-center justify-start text-white text-base font-semibold font-['Lora'] uppercase leading-[14px]">707-226-5235</div>
            </div>
          </Link>
        </div>
              
         <SignedOut>
     <div className="flex justify-center mt-5 gap-3 z-9999">
     <Link className="px-6 py-4 bg-gradient-to-b from-white/0 to-white/30 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/40 inline-flex justify-center items-center gap-2 w-full sm:w-auto" href={`/sign-up?role=admin`}>Signup as Admin</Link>
              <Link className="px-6 py-4 bg-gradient-to-b from-white/0 to-white/30 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/40 inline-flex justify-center items-center gap-2 w-full sm:w-auto" href={`/sign-up?role=venueowner`}>Signup as Venue Owner</Link>
              <Link className="px-6 py-4 bg-gradient-to-b from-white/0 to-white/30 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-white/40 inline-flex justify-center items-center gap-2 w-full sm:w-auto" href={`/sign-up?role=user`}>Signup as User</Link>

     </div>
         </SignedOut>
      </div>
    </section>
  );
} 