"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import RegisterUser from '../CRUD/RegisterUser';

const SearchUser = () => {
     const [query, setQuery] = useState("");
  return (
    <div className=" bg-white flex justify-end items-center">
          
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-100 focus:ring-blue-500 focus:border-blue-500  "
              placeholder="Search by venue name, location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
  )
}

export default SearchUser
