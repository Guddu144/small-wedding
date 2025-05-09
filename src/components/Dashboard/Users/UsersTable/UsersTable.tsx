"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface PropsUserData {
  data: any[];
  userRole: string;
}

const UsersTable: React.FC<PropsUserData> = ({ data, userRole }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const deleteUser = async (user_id: string) => {
    try {
      setLoading(true);
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/deleteuser?user_id=${user_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user_id: string) => {
    await deleteUser(user_id);
    router.push("/dashboard"); // Optionally trigger a refresh
  };

  return (
    <div className="pt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Created Date</th>
            <th className="px-6 py-3">Last Login</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : data?.length > 0 ? (
            data.map((user: any, index: number) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.imageUrl}
                    alt="User"
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="font-normal text-gray-500">
                      {user?.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{user?.publicMetadata?.role}</td>
                <td className="px-6 py-4">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4">
                  {user?.lastActiveAt
                    ? new Date(user.lastActiveAt).toLocaleString()
                    : "N/A"}
                </td>
                {userRole === "admin" || userRole === "venueowner" ? (
                  <td className="px-6 py-4 text-right flex gap-3 items-center">
                    <Link
                      href={`/dashboard/users/update/${user?.id}`}
                      className="font-medium bg-blue-600 text-white px-4 py-1 rounded hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user?.id)}
                      className="font-medium bg-red-600 text-white px-4 py-1 rounded hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                ) : (
                  <td className="px-6 py-4 text-center">-</td>
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
    </div>
  );
};

export default UsersTable;
