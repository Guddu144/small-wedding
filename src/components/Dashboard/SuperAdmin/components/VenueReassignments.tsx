'use client';

import { useState } from 'react';

type ReassignmentRequest = {
  id: number;
  venueName: string;
  venueImage: string;
  currentOwnerName: string;
  currentOwnerEmail: string;
  newOwnerName: string;
  newOwnerEmail: string;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function VenueReassignments() {
  const [reassignmentRequests, setReassignmentRequests] = useState<ReassignmentRequest[]>([
    {
      id: 1,
      venueName: 'Vineyard Deck',
      venueImage: '/images/venues/image-1.jpg',
      currentOwnerName: 'John Smith',
      currentOwnerEmail: 'john@example.com',
      newOwnerName: 'Sarah Johnson',
      newOwnerEmail: 'sarah@example.com',
      reason: 'I am relocating to another country and would like to transfer ownership to my business partner.',
      requestDate: '2023-12-05',
      status: 'pending'
    },
    {
      id: 2,
      venueName: 'Mountain View Retreat',
      venueImage: '/images/venues/image-1.jpg',
      currentOwnerName: 'Michael Davis',
      currentOwnerEmail: 'michael@example.com',
      newOwnerName: 'Emily Wilson',
      newOwnerEmail: 'emily@example.com',
      reason: 'Our business is being restructured and the venue management is being transferred to a new team member.',
      requestDate: '2023-12-10',
      status: 'pending'
    },
    {
      id: 3,
      venueName: 'Seaside Memorial Center',
      venueImage: '/images/venues/image-1.jpg',
      currentOwnerName: 'Robert Anderson',
      currentOwnerEmail: 'robert@example.com',
      newOwnerName: 'Jennifer Wilson',
      newOwnerEmail: 'jennifer@example.com',
      reason: 'I am retiring and my daughter will be taking over the management of the venue.',
      requestDate: '2023-12-12',
      status: 'pending'
    }
  ]);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<ReassignmentRequest | null>(null);

  // Handle viewing request details
  const handleViewDetails = (request: ReassignmentRequest) => {
    setCurrentRequest(request);
    setIsDetailsModalOpen(true);
  };

  // Handle request approval
  const handleApproveRequest = (id: number) => {
    setReassignmentRequests(reassignmentRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'approved' } 
        : request
    ));
    
    if (currentRequest && currentRequest.id === id) {
      setCurrentRequest({ ...currentRequest, status: 'approved' });
    }
    
    alert(`Reassignment request ID: ${id} has been approved`);
  };

  // Handle request rejection
  const handleRejectRequest = (id: number) => {
    setReassignmentRequests(reassignmentRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'rejected' } 
        : request
    ));
    
    if (currentRequest && currentRequest.id === id) {
      setCurrentRequest({ ...currentRequest, status: 'rejected' });
    }
    
    alert(`Reassignment request ID: ${id} has been rejected`);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    if (status === 'approved') return 'bg-green-100 text-green-800 border border-green-200';
    return 'bg-red-100 text-red-800 border border-red-200';
  };

  return (
    <div>
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif text-[#0a3b5b]">VENUE REASSIGNMENT REQUESTS</h1>
      </div>

      {reassignmentRequests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600">No venue reassignment requests</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f2ede8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Venue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Current Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">New Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#0a3b5b] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reassignmentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md object-cover" src={request.venueImage} alt={request.venueName} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#0a3b5b]">{request.venueName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.currentOwnerName}</div>
                      <div className="text-sm text-gray-500">{request.currentOwnerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.newOwnerName}</div>
                      <div className="text-sm text-gray-500">{request.newOwnerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleViewDetails(request)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApproveRequest(request.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleRejectRequest(request.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {isDetailsModalOpen && currentRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#0a3b5b]">
                Reassignment Request Details
              </h3>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <img 
                  src={currentRequest.venueImage} 
                  alt={currentRequest.venueName}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="ml-4">
                  <h4 className="text-xl font-medium text-[#0a3b5b]">{currentRequest.venueName}</h4>
                  <p className="text-sm text-gray-500">
                    Request submitted on {new Date(currentRequest.requestDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#f2ede8] p-4 rounded-md">
                  <h5 className="font-medium text-[#0a3b5b] mb-2">Current Owner</h5>
                  <p className="text-sm">{currentRequest.currentOwnerName}</p>
                  <p className="text-sm text-gray-600">{currentRequest.currentOwnerEmail}</p>
                </div>
                
                <div className="bg-[#f2ede8] p-4 rounded-md">
                  <h5 className="font-medium text-[#0a3b5b] mb-2">New Owner</h5>
                  <p className="text-sm">{currentRequest.newOwnerName}</p>
                  <p className="text-sm text-gray-600">{currentRequest.newOwnerEmail}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h5 className="font-medium text-[#0a3b5b] mb-2">Reason for Reassignment</h5>
                <div className="bg-gray-50 p-3 rounded-md text-gray-700">
                  {currentRequest.reason}
                </div>
              </div>
              
              <div className="mb-6">
                <h5 className="font-medium text-[#0a3b5b] mb-2">Status</h5>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(currentRequest.status)}`}>
                  {currentRequest.status.charAt(0).toUpperCase() + currentRequest.status.slice(1)}
                </span>
              </div>

              {currentRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => handleRejectRequest(currentRequest.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Reject Request
                  </button>
                  <button
                    onClick={() => handleApproveRequest(currentRequest.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Approve Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 