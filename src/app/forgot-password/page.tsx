"use client";
import { useState, useRef, useEffect } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Index/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    
    if (isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setSuccessfulCreation(true);
      setError('');
    } catch (err: any) {
      console.error('error', err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result?.status === 'needs_second_factor') {
        setSecondFactor(true);
        setError('');
      } else if (result?.status === 'complete') {
        setActive({ session: result.createdSessionId });
        router.push('/');
      }
    } catch (err: any) {
      console.error('error', err.errors[0].longMessage);
      setError(err.errors[0].longMessage);
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative bg-[#f5f3ef]">
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
      <div
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{ backgroundColor: '#082447', opacity: 0.5 }}
        aria-hidden="true"
      ></div>
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center">
          <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">Forgot Password</h2>
          <p className="text-base text-gray-600 mb-6 text-center max-w-xs">
            {!successfulCreation 
              ? 'Enter your email address to receive a verification code.'
              : 'Enter the code and your new password.'}
          </p>
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${!successfulCreation ? 'bg-[#957748]' : 'bg-gray-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${successfulCreation ? 'bg-[#957748]' : 'bg-gray-200'}`}></div>
          </div>

          {!successfulCreation ? (
            <form className="w-full" onSubmit={handleSendCode}>
              <label className="block text-sm font-medium text-navy-900 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-[#eae5da] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#957748] text-navy-900 bg-[#f5f3ef]"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              <button
                type="submit"
                className="w-full h-12 px-6 py-3 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] text-white font-serif text-base font-semibold uppercase tracking-tight shadow hover:brightness-110 transition-colors"
              >
                Send Code
              </button>
            </form>
          ) : (
            <form className="w-full" onSubmit={handleResetPassword}>
              <label className="block text-sm font-medium text-navy-900 mb-2">Verification Code</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-[#eae5da] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#957748] text-navy-900 bg-[#f5f3ef]"
                placeholder="Enter code"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
              />
              <label className="block text-sm font-medium text-navy-900 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-[#eae5da] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#957748] text-navy-900 bg-[#f5f3ef]"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <label className="block text-sm font-medium text-navy-900 mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-[#eae5da] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#957748] text-navy-900 bg-[#f5f3ef]"
                placeholder="Confirm password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              <button
                type="submit"
                className="w-full h-12 px-6 py-3 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] text-white font-serif text-base font-semibold uppercase tracking-tight shadow hover:brightness-110 transition-colors"
              >
                Reset Password
              </button>
            </form>
          )}
          
          {secondFactor && <p>2FA is required, but this UI does not handle that</p>}
        </div>
      </div>
    </main>
  );
}