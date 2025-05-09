"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const UsersDropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 "
        type="button"
      >
        <span className="sr-only">Filter button</span>
        Filter
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1l4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white divide-y divide-gray-500 rounded-lg shadow-sm w-44 border border-gray-200">
          <ul className="py-1 text-sm text-gray-700 ">
            <li>
              <Link
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 "
              >
                Venue
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Officiants
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="block px-4 py-2 hover:bg-gray-100 "
              >
                Vendors
              </Link>
            </li>
          </ul>
          
        </div>
      )}
    </div>
  );
};

export default UsersDropdownMenu;
