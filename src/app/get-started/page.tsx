'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Index/Navbar';
import { useSignUp } from '@clerk/nextjs';

export default function GetStartedPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const router = useRouter();
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  
  // const handleContinue = (e: React.FormEvent) => {
    //   e.preventDefault();
    //   // Handle signup logic here
    //   // Then redirect to dashboard or next step
    //   router.push('/dashboard');
    // };
    
    // Initialize video when component mounts
    
  const [accountType, setAccountType] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState("");
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
const [codeError, setCodeError] = React.useState("");
console.log(accountType, emailAddress, password);

  const isPasswordValid = (pwd: any) => {
    const lengthCheck = pwd.length >= 8;
    const letterCheck = /[A-Za-z]/.test(pwd);
    const numberCheck = /[0-9]/.test(pwd);
    return lengthCheck && letterCheck && numberCheck;
  };

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!accountType) {
      setError("Please select an account type.");
      return;
    }

    if (!emailAddress || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError(
        "Password must be at least 8 characters long and include letters and numbers."
      );
      return;
    }

    if (!isLoaded) return;

    // Start the sign-up process using the email and password provided
    try {
      setIsSubmitting(true);
      await signUp.create({
        emailAddress,
        password,
        unsafeMetadata: {
          userRole: `${accountType}`,
        },
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      const clerkError = err?.errors?.[0];
      if (clerkError?.code === "form_identifier_exists") {
        setError("An account with this email already exists.");
      } else {
        setError(
          clerkError?.message || "Something went wrong. Please try again."
        );
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;
    if (!code.trim()) {
      setCodeError("Please enter the verification code.");
      return;
    }

    try {
      // Use the code the user provided to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
            console.error("Verification not complete:", completeSignUp);

        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
 
         setCodeError("The verification code is incorrect. Please try again.");
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error("Video autoplay failed:", error));
    }
  }, []);


  // Display the verification form to capture the OTP code
if (verifying) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Verify Your Email
        </h1>

        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter your verification code
          </label>
          <input
            value={code}
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="123456"
            required
          />
        </div>

        {codeError && (
          <div className="text-red-600 text-sm text-center bg-red-100 border border-red-300 px-4 py-2 rounded-md">
            {codeError}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 font-medium rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Verify
        </button>
      </form>
    </div>
  );
}


  return (
    <main className="min-h-screen flex flex-col relative">
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

      {/* Navigation */}
      <Navbar />

      {/* Signup Form Card */}
      <div className="flex-1 flex justify-center items-center relative z-10">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div className="p-8 border-b border-[#0a3b5b]">
            <h1 className="text-[#0a3b5b] text-3xl font-serif font-semibold mb-2">Create an account</h1>
            <p className="text-[#0a3b5b]/80 mb-8">Tell us who you are so we can tailor your experience.</p>
            
            <form onSubmit={handleSubmit}>
              {/* Account Type Selection */}
              <div className="mb-6">
                <h2 className="text-[#0a3b5b] text-lg font-medium mb-4">Choose Account Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-lg p-6 cursor-pointer ${accountType === 'user' ? 'border-[#a89578] bg-[#0a3b5b]' : 'border-gray-300 hover:border-[#a89578]'}`}
                    onClick={() => setAccountType('user')}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accountType === 'user' ? 'bg-[#a89578]' : 'bg-[#0a3b5b]'}`}>
                        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className={`ml-3 font-semibold ${accountType === 'user' ? 'text-white' : 'text-[#0a3b5b]'}`}>I'm Planning a Celebration</h3>
                    </div>
                   
                    {/* <p className={`${accountType === 'celebration' ? 'text-white' : 'text-[#0a3b5b]'}`}>
                      I'm here to honor a loved one and organize a celebration of life.
                    </p> */}
                  </div>

                  <div 
                    className={`border rounded-lg p-6 cursor-pointer ${accountType === 'venueowner' ? 'border-[#a89578] bg-[#0a3b5b]' : 'border-gray-300 hover:border-[#a89578]'}`}
                    onClick={() => setAccountType('venueowner')}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accountType === 'venueowner' ? 'bg-[#a89578]' : 'bg-[#0a3b5b]'}`}>
                        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className={`ml-3 font-semibold ${accountType === 'venueowner' ? 'text-white' : 'text-[#0a3b5b]'}`}>I Own or <br />  Manage a Venue</h3>
                    </div>
                    {/* <p className={`${accountType === 'venue' ? 'text-white' : 'text-[#0a3b5b]'}`}>
                      I'd like to offer my venue for memorial services and celebration events.
                    </p> */}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-[#0a3b5b] font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full border border-gray-300 rounded-lg p-4 text-[#0a3b5b]"
                  placeholder="example@gmail.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-[#0a3b5b] font-medium mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    className="w-full border border-gray-300 rounded-lg p-4 text-[#0a3b5b]"
                    placeholder="enter ..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0a3b5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0a3b5b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div id="clerk-captcha" className="my-4" />
              {error && <p className="text-red-500">{error}</p>}
              {/* Continue Button */}
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-lg text-white font-semibold uppercase tracking-wide"
                  // disabled={!accountType}
                >
                  {isSubmitting ? "Submitting..." : "CONTINUE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Login Link */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto -mt-4 p-4 text-center relative z-10 mb-16">
        <p className="text-[#0a3b5b]">
          Already have an account{" "}
          <Link href="/login" className="text-[#957748] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
} 