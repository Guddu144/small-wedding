"use client";
import { SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from "react-hot-toast";
import { IoMdHeart } from "react-icons/io";
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname=usePathname()
  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 z-90 w-full bg-[#000000] border-b border-gray-200 h-[4.1rem]">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Sidebar toggle button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
               <Link className='bg-[#000]' href="/" aria-label="Celebration of Life Concierge">
            <Image 
              src="/images/logos/logo.svg" 
              alt="Celebration of Life Concierge" 
              width={200} 
              height={50}
              priority
            />
          </Link>
            </div>
            {/* User menu */}
            <div className="relative ms-3">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-[#fdfdfd] border-r border-gray-200  transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/dashboard" className={`${pathname==='/dashboard' ? "bg-gray-200":"" } flex items-center p-2 rounded-lg text-gray-900  hover:bg-gray-100 group`}>
                <svg className="w-5 h-5 text-gray-500   group-hover:text-gray-900" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025A1 1 0 0 0 8.934 3.027a8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066Z" />
                  <path d="M12.5 0a1 1 0 0 0-.565.027 1 1 0 0 0-.935.993V10h8.975a1 1 0 0 0 1-.935 8.51 8.51 0 0 0-8.475-9.065Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
       
         <li>
            <Link href="/dashboard/users" className={`${pathname==='/dashboard/users' ? "bg-gray-200":"" } flex items-center p-2 rounded-lg text-gray-900  hover:bg-gray-100 group`}>
               <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
            </Link>
         </li>
           <li>
            <Link href="/dashboard/venue/superadmin" className={`${pathname==='/dashboard/venue/superadmin' ? "bg-gray-200":"" } flex items-center p-2 rounded-lg text-gray-900  hover:bg-gray-100 group`}>
               <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">SuperAdmin</span>
            </Link>
         </li>

         <li>
            <Link href="/dashboard/venue/wishlist" className={`${pathname==='/dashboard/venue/wishlist' ? "bg-gray-200":"" } flex items-center p-2 rounded-lg text-gray-900  hover:bg-gray-100 group`}>
              <IoMdHeart className='text-gray-500 text-[24px]'/>
               <span className="flex-1 ms-3 whitespace-nowrap">Wishlist</span>
            </Link>
         </li>

     
          
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-4" onClick={() => {
    if (window.innerWidth < 768 && sidebarOpen) {
      setSidebarOpen(false);
    }
  }}>
       <div className='mt-20'>
         {children}
         </div> {/* Render children here, outside of the sidebar */}
      </main>
      <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontSize: "16px",
              fontWeight: "600",
              background: "#fff",
              zIndex:"99999999"
            },
             duration:5000,
               removeDelay: 5000,
          }}
        />
    </>
  );
};

export default ProtectedLayout;
