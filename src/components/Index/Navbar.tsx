"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CreateOrganization,
  OrganizationProfile,
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import DropdownMenu from "./Dropdown/Dropdown";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleMenuToggle();
    }
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 py-4 px-6 md:px-12 border-b text-[white] border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" aria-label="Celebration of Life Concierge">
            <Image
              src="/images/logos/logo.svg"
              alt="Celebration of Life Concierge"
              width={200}
              height={50}
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            href="/our-story"
            className="hover:text-gold-400 transition-colors"
            tabIndex={0}
            aria-label="Our Story"
          >
            OUR STORY
          </Link>
          <Link
            href="/services"
            className="hover:text-gold-400 transition-colors"
            tabIndex={0}
            aria-label="Services"
          >
            SERVICES
          </Link>
          <Link
            href="/venues"
            className="hover:text-gold-400 transition-colors"
            tabIndex={0}
            aria-label="Venues"
          >
            VENUES
          </Link>
          <Link
            href="#contact"
            className="hover:text-gold-400 transition-colors"
            tabIndex={0}
            aria-label="Contact"
          >
            CONTACT
          </Link>
          <SignedIn>
            <Link
              href="/dashboard"
              className="hover:text-gold-400 transition-colors"
              tabIndex={0}
              aria-label="dashboard"
            >
              DASHBOARD
            </Link>
         
          </SignedIn>
             <Link
            href="#planning"
            className="h-12 px-6 py-4 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#a89578] inline-flex justify-center items-center gap-2.5 transition-colors hover:brightness-110"
            tabIndex={0}
            aria-label="Let's Start Planning"
          >
            <div className="text-center justify-start text-white text-base font-semibold font-['Lora'] uppercase leading-[14px] tracking-tight">
              Let's Start Planning
            </div>
          </Link>
                 <SignedOut>
                  <DropdownMenu/>
                 </SignedOut>
          
          <SignedOut>
            <div className="flex gap-4">
              <SignInButton mode="modal"  />
              {/* <SignUpButton mode="modal" forceRedirectUrl="/dashboard" /> */}
              <CreateOrganization />
              <OrganizationProfile />
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>

        {/* Mobile Menu Button */}
        <div
          className="lg:hidden"
          onClick={handleMenuToggle}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="lg:hidden mt-4 flex flex-col space-y-4 px-6 bg-navy-950/80 backdrop-blur-sm rounded-lg p-4">
          <Link
            href="/our-story"
            className="hover:text-gold-400 transition-colors py-2"
            tabIndex={0}
            aria-label="Our Story"
          >
            OUR STORY
          </Link>
          <Link
            href="#services"
            className="hover:text-gold-400 transition-colors py-2"
            tabIndex={0}
            aria-label="Services"
          >
            SERVICES
          </Link>
          <Link
            href="#venues"
            className="hover:text-gold-400 transition-colors py-2"
            tabIndex={0}
            aria-label="Venues"
          >
            VENUES
          </Link>
          <Link
            href="#contact"
            className="hover:text-gold-400 transition-colors py-2"
            tabIndex={0}
            aria-label="Contact"
          >
            CONTACT
          </Link>
          <Link
            href="#planning"
            className="h-12 px-6 py-4 bg-gradient-to-b from-[#957748] to-[#ac8b57] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#a89578] inline-flex justify-center items-center gap-2.5 transition-colors hover:brightness-110 w-full"
            tabIndex={0}
            aria-label="Let's Start Planning"
          >
            <div className="text-center justify-start text-white text-base font-semibold font-['Lora'] uppercase leading-[14px] tracking-tight">
              Let's Start Planning
            </div>
          </Link>
        </nav>
      )}
    </header>
  );
}
