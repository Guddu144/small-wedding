'use client';

import { useState, useEffect } from 'react';

type Enquiry = {
  enquiryId: string;
  email: string;
  phoneNumber: string;
  subject: string;
  description: string;
  status: string;
  timestamp: string;
};

export default function EnquiriesManagement() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEnquiry, setCurrentEnquiry] = useState<Enquiry | null>(null);
  const [formData, setFormData] = useState({
    status: '',
    reply: ''
  });

  // Fetch enquiries from API
  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/enquires`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch enquiries: ${response.statusText}`);
      }

      const data = await response.json();
      setEnquiries(data.result.enquiries);
      setError(null);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError("Failed to load enquiries. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open view modal
  const handleViewEnquiry = (enquiry: Enquiry) => {
    setCurrentEnquiry(enquiry);
    setIsViewModalOpen(true);
  };

  // Open edit modal
  const handleEditEnquiry = (enquiry: Enquiry) => {
    setCurrentEnquiry(enquiry);
    setFormData({
      status: enquiry.status,
      reply: ''
    });
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (enquiry: Enquiry) => {
    setCurrentEnquiry(enquiry);
    setIsDeleteModalOpen(true);
  };

  // Update enquiry status
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentEnquiry) {
      try {
        // Here you would typically make an API call to update the enquiry
        // For now, we'll just update the local state
        setEnquiries(enquiries.map(enquiry => 
          enquiry.enquiryId === currentEnquiry.enquiryId
            ? { ...enquiry, status: formData.status } 
            : enquiry
        ));
        setIsEditModalOpen(false);
        
        // If you had an API endpoint to update enquiries:
        /*
        const response = await fetch(`/api/enquiries/${currentEnquiry.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: formData.status,
            reply: formData.reply
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update enquiry');
        }

        // Refresh the list after update
        await fetchEnquiries();
        */
      } catch (error) {
        console.error("Error updating enquiry:", error);
        alert("Failed to update enquiry. Please try again.");
      }
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async () => {
    if (currentEnquiry) {
      try {
        // Here you would typically make an API call to delete the enquiry
        // For now, we'll just update the local state
        setEnquiries(enquiries.filter(enquiry => enquiry.enquiryId !== currentEnquiry.enquiryId));
        setIsDeleteModalOpen(false);
        
        // If you had an API endpoint to delete enquiries:
        /*
        const response = await fetch(`/api/enquiries/${currentEnquiry.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete enquiry');
        }

        // Refresh the list after deletion
        await fetchEnquiries();
        */
      } catch (error) {
        console.error("Error deleting enquiry:", error);
        alert("Failed to delete enquiry. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0a3b5b]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-[#0a3b5b]">ENQUIRIES MANAGEMENT</h1>
        <button 
          onClick={fetchEnquiries}
          className="flex items-center gap-2 bg-[#0a3b5b] text-white px-4 py-2 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f2ede8]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enquiries.length > 0 ? (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.enquiryId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0a3b5b]">{enquiry.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{enquiry.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{enquiry.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(enquiry.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleViewEnquiry(enquiry)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {/* <button 
                          onClick={() => handleEditEnquiry(enquiry)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(enquiry)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No enquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Enquiry Modal */}
      {isViewModalOpen && currentEnquiry && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#0a3b5b]">
                Enquiry Details
              </h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-[#0a3b5b]">{currentEnquiry.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-[#0a3b5b]">{currentEnquiry.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-[#0a3b5b]">{new Date(currentEnquiry.timestamp).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 mb-1">description</p>
                <div className="bg-gray-50 p-3 rounded-md text-gray-700">
                  {currentEnquiry.description}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                {currentEnquiry.status}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => { setIsViewModalOpen(false); handleEditEnquiry(currentEnquiry); }}
                  className="px-4 py-2 bg-[#0a3b5b] text-white rounded-md hover:bg-[#0c4d76] flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Reply & Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Enquiry Modal */}
      {isEditModalOpen && currentEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-[#0a3b5b]">
                Update Enquiry
              </h3>
            </div>
            <form onSubmit={handleSubmitEdit}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">From</p>
                  <p className="text-[#0a3b5b]"> ({currentEnquiry.email})</p>
                </div>
                
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Original description</p>
                  <div className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm">
                    {currentEnquiry.description}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reply description</label>
                  <textarea
                    name="reply"
                    value={formData.reply}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0a3b5b] focus:border-[#0a3b5b]"
                    placeholder="Write your reply here..."
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-3 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0a3b5b] text-white rounded-md hover:bg-[#0c4d76]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete Enquiry</h3>
              <p className="text-sm text-gray-500 text-center">
                Are you sure you want to delete this enquiry from {currentEnquiry.email}? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEnquiry}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}