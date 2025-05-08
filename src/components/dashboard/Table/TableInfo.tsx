"use client"; // If this is a client-side component
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Pagination from "./Pagination";
interface Venue {
  description: string;
  venueId: string;
  type: string;
  email: string;
  Status: string;
  venue_name: string;
  phone_no: number;
  venue_location: string;
  region_state: string;
  featured_venue: string;
  venue_status: string;
  gallery: string[];
}
interface SearchBoxProps {
  currentPage: number;
  totalPages: number;
  currentData: Venue[];
  handlePrev: () => void;
  handleNext: () => void;
  venues: Venue[];
  loading: boolean;
  setCurrentPage: (page: number) => void;
  userRole: string;
}

const TableInfo: React.FC<SearchBoxProps> = ({
  userRole,
  setCurrentPage,
  venues,
  loading,
  currentPage,
  totalPages,
  currentData,
  handlePrev,
  handleNext,
}) => {
  return (
    <div>
      <div className="pt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th className="px-6 py-3">Venue name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">VenueId</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Location</th>
              {userRole == "admin" ? <th className="px-6 py-3">Action</th> : ""}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap hover:underline">
                    <Link href={`/dashboard/venue/view/${item?.venueId}`}>
                      {item?.venue_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{item?.description}</td>
                  <td className="px-6 py-4">
                    {item?.venueId}
                    {item?.gallery ? (
                      <img
                        className="w-20 h-20"
                        src={`${
                          item?.gallery[0]
                            ? `${item?.gallery[0]}`
                            : "https://www.theestateyountville.com/wp-content/uploads/2023/09/The-Estate-Yountville-Partner-Assets-DJI_0045-1_R-820x460.jpg"
                        }`}
                        alt="dashboard"
                      />
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-6 py-4">{item?.email}</td>
                  <td className="px-6 py-4">
                    {item?.venue_location}
                  </td>
                
                  {userRole == "admin" ? (
                    <td className="px-6 py-4 text-right flex gap-3 items-center">
                      <Link
                        href={`/dashboard/venue/update/${item?.venueId}`}
                        className="font-medium bg-blue-600 text-white px-4 py-1 rounded hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href="#"
                        className="font-medium bg-red-600 text-white px-4 py-1 rounded hover:underline"
                      >
                        Delete
                      </Link>
                    </td>
                  ) : (
                    ""
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center px-6 py-4">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrev={handlePrev}
          handleNext={handleNext}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TableInfo;
