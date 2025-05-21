'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Index/Navbar';
import { useSignIn } from '@clerk/nextjs';

export default function LoginPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const images = [
    '/images/venues/image-1.jpg',
    '/images/venues/image-2.jpg',
    '/images/venues/image-3.jpg'
  ];
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isLoaded) return;
  
  setIsSubmitting(true);
  try {
    const result = await signIn.create({ 
      identifier: emailAddress, 
      password 
    });

    if (result.status === 'complete') {
      await setActive({ session: result.createdSessionId });
      router.push('/dashboard');
    } else {
      console.log(result);
    }
  } catch (err: any) {
    setError(err.errors[0]?.longMessage || 'Sign-in failed');
  } finally {
    setIsSubmitting(false);
  }
};

  // Auto-rotate images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };


  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Background */}
      <section className="relative min-h-screen">
        {/* Background Video */}
        <div className="absolute inset-0">
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
        
        {/* Content */}
        <div className="relative z-10 container mx-auto pt-24 px-4 flex justify-center items-center min-h-screen">
          <div className="bg-white overflow-hidden rounded-2xl flex flex-col md:flex-row max-w-4xl w-full shadow-lg">
            {/* Left side with form */}
            <div className="p-10 md:p-12 md:w-[60%]">
              <h1 className="text-4xl font-semibold font-serif text-[#082447] mb-2">Welcome Back</h1>
              <p className="text-[#082447] mb-10">
                Welcome Back, Please enter Your details
              </p>
              
              {/* Login Form */}
              <form className="space-y-6" onSubmit={handleSignIn}>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-[#082447] text-lg font-serif mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="example@gmail.com" 
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-[#a89578]"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                  />
                </div>
                
                {/* Password Field */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="password" className="block text-[#082447] text-lg font-serif">Password</label>
                    <Link href="/forgot-password" className="text-[#a89578] text-sm hover:underline">
                      Forget Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword? 'text' : 'password'}
                      id="password" 
                      placeholder="enter ..." 
                      className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-[#a89578]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Bottom Links and Button */}
                  {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

                <div className="flex items-center justify-between pt-6 mt-4">
                  <div>
                    <span className="text-[#082447]">Don't Have An Account? </span>
                    <Link href="/get-started" className="text-[#a89578] font-medium">Register Now</Link>
                  </div>
                  <button 
                    type="submit" 
                    className="h-12 px-8 py-4 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#a89578] inline-flex justify-center items-center transition-colors hover:brightness-110"
                  >
                    <span className="text-center text-white font-semibold font-serif uppercase tracking-tight"> {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}</span>
                  </button>
                </div>
              </form>
            </div>
            
            {/* Right side with image carousel */}
            <div className="hidden md:block md:w-[40%] relative overflow-hidden">
              <div 
                className="w-full h-full transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${currentSlide * 100}%)`, height: '100%', display: 'flex' }}
              >
                {images.map((image, index) => (
                  <div key={index} className="min-w-full h-full relative flex-shrink-0">
                    <Image 
                      src={image} 
                      alt={`Venue image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-[#082447] opacity-20"></div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 w-2 rounded-full transition-opacity ${currentSlide === index ? 'bg-white' : 'bg-white opacity-50'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 