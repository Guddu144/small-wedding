'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Dashboard Components
import PendingVenues from './components/PendingVenues';
import UsersManagement from './components/UsersManagement';
import EnquiriesManagement from './components/EnquiriesManagement';
import VenueReassignments from './components/VenueReassignments';
import VenuesManagement from './components/VenuesManagement';
import { useClerk } from '@clerk/nextjs';

export default function SuperAdminDashboard({ userRole,userEmail }: { userRole: string,userEmail:string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending-venues');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useClerk();
  

  // Handle logout
  const handleLogout = () => {
      signOut(() => router.push('/'));
    };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a3b5b] text-white px-3 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Image 
              src="/images/logos/logo.svg" 
              alt="Celebration of Life Concierge" 
              width={200} 
              height={50}
              priority
            />
          </div>
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <div className="h-8 w-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="w-10 h-10 bg-[#a89578] rounded-full flex items-center justify-center text-white">
                <img src="/images/avatar.jpg" alt="Admin" className="w-10 h-10 rounded-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span>Admin</span>
                <span className="text-xs text-gray-300">SUPER ADMIN</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-[#0a3b5b] hover:bg-gray-100 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Settings
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-[#0a3b5b] hover:bg-gray-100 flex items-center"
                    onClick={handleLogout}
                  >
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-[#f2ede8] border-b border-[#e0d8cb]">
        <div className="container mx-auto">
          <div className="flex flex-wrap">
            <button 
              className={`flex items-center gap-2 px-6 py-4 font-medium ${activeTab === 'pending-venues' ? 'text-[#957748] border-b-2 border-[#957748]' : 'text-[#0C3E58]'}`}
              onClick={() => setActiveTab('pending-venues')}
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              PENDING VENUES
            </button>
            <button 
              className={`flex items-center gap-2 px-6 py-4 font-medium ${activeTab === 'venues' ? 'text-[#957748] border-b-2 border-[#957748]' : 'text-[#0C3E58]'}`}
              onClick={() => setActiveTab('venues')}
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              VENUES
            </button>
            <button 
              className={`flex items-center gap-2 px-6 py-4 font-medium ${activeTab === 'users' ? 'text-[#957748] border-b-2 border-[#957748]' : 'text-[#0C3E58]'}`}
              onClick={() => setActiveTab('users')}
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              USERS
            </button>
            <button 
              className={`flex items-center gap-2 px-6 py-4 font-medium ${activeTab === 'enquiries' ? 'text-[#957748] border-b-2 border-[#957748]' : 'text-[#0C3E58]'}`}
              onClick={() => setActiveTab('enquiries')}
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              ENQUIRIES
            </button>
            <button 
              className={`flex items-center gap-2 px-6 py-4 font-medium ${activeTab === 'reassignments' ? 'text-[#957748] border-b-2 border-[#957748]' : 'text-[#0C3E58]'}`}
              onClick={() => setActiveTab('reassignments')}
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              REASSIGNMENTS
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto my-6 px-4">
        {activeTab === 'pending-venues' && <PendingVenues />}
        {activeTab === 'venues' && <VenuesManagement userEmail={userEmail} />}
        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'enquiries' && <EnquiriesManagement />}
        {activeTab === 'reassignments' && <VenueReassignments />}
      </main>
    </div>
  );
} 