'use client';

import { useEffect, useState } from 'react';

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({});

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getuser`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setUsers(data.users);
      console.log("Users List", data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (banned: boolean) => {
    return banned
      ? 'bg-red-100 text-red-800 border border-red-200' 
      : 'bg-green-100 text-green-800 border border-green-200';
  };

  // Get role badge class
  const getRoleBadgeClass = (role: string) => {
    if (role === 'superadmin') return 'bg-purple-100 text-purple-800 border border-purple-200';
    if (role === 'venueowner') return 'bg-blue-100 text-blue-800 border border-blue-200';
    return 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  // Helper function to get user role
  const getUserRole = (user: any) => {
    return user?.unsafeMetadata?.userRole || 'user';
  };

  // Helper function to get status text
  const getStatusText = (banned: boolean) => {
    return banned ? 'Inactive' : 'Active';
  };

  return (
    <div>
      {/* Page Title and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-[#0a3b5b]">USERS MANAGEMENT</h1>
        <button 
          className="flex items-center gap-2 bg-[#0a3b5b] text-white px-4 py-2 rounded-lg"
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          ADD NEW USER
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f2ede8]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Joined Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => {
                const role = getUserRole(user);
                const statusText = getStatusText(user.banned);
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.emailAddresses[0]?.emailAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(role)}`}>
                        {role === 'venueowner' ? 'Venue Owner' : role === 'superadmin' ? 'Super Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(user.banned)}`}>
                        {statusText}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}