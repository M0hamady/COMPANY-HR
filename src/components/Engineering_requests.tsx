import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../utilies/Layout';

interface EngineerRequest {
  id: number;
  name: string;
  residence: string;
  employment_status: string;
  rejected: boolean;
  rejected_reason?: string;
  in_negotiation: boolean;
  accepted: boolean;
  viewed: boolean;
  phone_number: string;
  secondary_phone: string;
  contact_email: string;
  graduation_year: number;
  specialization: string;
  university: string;
  has_driving_license: boolean;
  owns_car: boolean;
  workplace: string;
  available_start_days: number;
  last_salary: string;
  expected_salary: string;
  years_experience: number;
}

interface RejectionDetails {
  reason: string;
  editing: boolean;
}

interface LoginResponse {
  userType: string;
}

const EngineerRequests: React.FC = () => {
  const [requests, setRequests] = useState<EngineerRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    rejected: false,
    in_negotiation: false,
    accepted: false,
    viewed: false,
  });
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: RejectionDetails }>({});
  const [selectedRequest, setSelectedRequest] = useState<EngineerRequest | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const cachedResponseJson = localStorage.getItem('loginResponse');
    let cachedResponse: LoginResponse | null = null;

    if (cachedResponseJson) {
      cachedResponse = JSON.parse(cachedResponseJson);
    }

    if (
      cachedResponse?.userType === 'manager' ||
      cachedResponse?.userType === 'site_manager' ||
      cachedResponse?.userType === 'admin'
    ) {
      fetchRequests(token);
    } else {
      setError('You are not allowed');
    }
  }, [navigate]);

  const fetchRequests = async (token: string) => {
    try {
      const response = await axios.get<any[]>('https://hrsupport.pythonanywhere.com/api/engineer-requests/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedRequests: EngineerRequest[] = response.data.map((item) => ({
        id: item.id,
        name: item.name || '',
        residence: item.residence || '',
        employment_status: item.employment_status || '',
        rejected: !!item.rejected,
        rejected_reason: item.rejected_reason || '',
        in_negotiation: !!item.in_negotiation,
        accepted: !!item.accepted,
        viewed: !!item.viewed,
        phone_number: item.phone_number || '',
        secondary_phone: item.secondary_phone || '',
        contact_email: item.contact_email || '',
        graduation_year: item.graduation_year || 0,
        specialization: item.specialization || '',
        university: item.university || '',
        has_driving_license: !!item.has_driving_license,
        owns_car: !!item.owns_car,
        workplace: item.workplace || '',
        available_start_days: item.available_start_days || 0,
        last_salary: item.last_salary || '',
        expected_salary: item.expected_salary || '',
        years_experience: item.years_experience || 0,
      }));

      setRequests(formattedRequests);

      // Initialize rejection reasons map
      const initialRejectionReasons: { [key: number]: RejectionDetails } = {};
      formattedRequests.forEach((request) => {
        initialRejectionReasons[request.id] = {
          reason: request.rejected_reason || '',
          editing: false,
        };
      });
      setRejectionReasons(initialRejectionReasons);
    } catch (error) {
      setError('Failed to fetch requests');
    }
  };

  const updateRequest = async (id: number, data: Partial<EngineerRequest>) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.patch(`https://hrsupport.pythonanywhere.com/api/engineer-requests/${id}/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRequests(token); // Refresh the data after update
    } catch (error) {
      setError('Failed to update request');
    }
  };

  const updateRejectionReason = async (id: number, rejected_reason: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.patch(`https://hrsupport.pythonanywhere.com/api/engineer-requests/${id}/`, { rejected_reason }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update local state with the new rejection reason details
      setRejectionReasons((prevReasons) => ({
        ...prevReasons,
        [id]: {
          ...prevReasons[id],
          reason: rejected_reason,
          editing: false, // Set editing to false after saving
        },
      }));
    } catch (error) {
      setError('Failed to update rejection reason');
    }
  };

  const toggleRejectionEditing = (id: number) => {
    setRejectionReasons((prevReasons) => ({
      ...prevReasons,
      [id]: {
        ...prevReasons[id],
        editing: !prevReasons[id]?.editing, // Ensure prevReasons[id] exists before accessing editing
      },
    }));
  };

  const handleFilterChange = (filterName: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName as keyof typeof filters],
    }));
  };

  const previewRequest = (request: EngineerRequest) => {
    setSelectedRequest(request); // Set selected request for preview

    // Create modal content for previewing request data
    const modalContent = (
      <div className="p-4 bg-white shadow-lg rounded-lg text-gray-900">
        <h2 className="text-xl font-bold mb-2">{request.name}</h2>
        <p>Residence: {request.residence}</p>
        <p>Employment Status: {request.employment_status}</p>
        <p>Phone Number: {request.phone_number}</p>
        <p>Secondary Phone: {request.secondary_phone}</p>
        <p>Contact Email: {request.contact_email}</p>
        <p>Graduation Year: {request.graduation_year}</p>
        <p>Specialization: {request.specialization}</p>
        <p>University: {request.university}</p>
        <p>Has Driving License: {request.has_driving_license ? 'Yes' : 'No'}</p>
        <p>Owns Car: {request.owns_car ? 'Yes' : 'No'}</p>
        <p>Workplace: {request.workplace}</p>
        <p>Available Start Days: {request.available_start_days}</p>
        <p>Last Salary: {request.last_salary}</p>
        <p>Expected Salary: {request.expected_salary}</p>
        <p>Years of Experience: {request.years_experience}</p>
        <p>Rejected: {request.rejected ? 'Yes' : 'No'}</p>
        {request.rejected && (
          <p>Reason for Rejection: {rejectionReasons[request.id]?.reason || '-'}</p>
        )}
        <p>In Negotiation: {request.in_negotiation ? 'Yes' : 'No'}</p>
        <p>Accepted: {request.accepted ? 'Yes' : 'No'}</p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-4 px-4 py-2 rounded bg-gray-500 text-white"
        >
          Close
        </button>
      </div>
    );

    setModalContent(modalContent); // Set modal content
    setShowModal(true); // Open modal
  };

  const closeModal = () => {
    setShowModal(false); // Close modal
    setSelectedRequest(null); // Reset selected request
    setModalContent(null); // Clear modal content
  };

  const handleStatusUpdate = (id: number, status: Partial<EngineerRequest>) => {
    updateRequest(id, status);
  };

  const filteredRequests = requests.filter((request) => {
    if (filters.rejected && !request.rejected) return false;
    if (filters.in_negotiation && !request.in_negotiation) return false;
    if (filters.accepted && !request.accepted) return false;
    if (filters.viewed && !request.viewed) return false;
    return true;
  });

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Layout >
      <div className="mb-4 flex justify-between text-gray-900">
        <div className="flex space-x-4">
          <button
            onClick={() => handleFilterChange('rejected')}
            className={`px-4 py-2 rounded ${filters.rejected ? 'bg-red-500' : 'bg-gray-500'} text-white`}
          >
            {filters.rejected ? 'Show All' : 'Show Rejected'}
          </button>
          <button
            onClick={() => handleFilterChange('in_negotiation')}
            className={`px-4 py-2 rounded ${filters.in_negotiation ? 'bg-yellow-500' : 'bg-gray-500'} text-white`}
          >
            {filters.in_negotiation ? 'Show All' : 'Show In Negotiation'}
          </button>
          <button
            onClick={() => handleFilterChange('accepted')}
            className={`px-4 py-2 rounded ${filters.accepted ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            {filters.accepted ? 'Show All' : 'Show Accepted'}
          </button>
          <button
            onClick={() => handleFilterChange('viewed')}
            className={`px-4 py-2 rounded ${filters.viewed ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          >
            {filters.viewed ? 'Show All' : 'Show Viewed'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-900">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white shadow-lg rounded-lg p-4 transition transform hover:-translate-y-2 hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-2 ">{request.name}</h2>
            <p>{request.residence}</p>
            <p>{request.employment_status}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => previewRequest(request)}
                className="px-4 py-2 rounded bg-blue-500 text-white"
              >
                Preview
              </button>
              <button
                onClick={() => handleStatusUpdate(request.id, { rejected: !request.rejected })}
                className={`px-4 py-2 rounded ${request.rejected ? 'bg-red-500' : 'bg-gray-500'} text-white`}
              >
                {request.rejected ? 'Unreject' : 'Reject'}
              </button>
              <button
                onClick={() => handleStatusUpdate(request.id, { in_negotiation: !request.in_negotiation })}
                className={`px-4 py-2 rounded ${request.in_negotiation ? 'bg-yellow-500' : 'bg-gray-500'} text-white`}
              >
                {request.in_negotiation ? 'Stop Negotiation' : 'Negotiate'}
              </button>
              <button
                onClick={() => handleStatusUpdate(request.id, { accepted: !request.accepted })}
                className={`px-4 py-2 rounded ${request.accepted ? 'bg-green-500' : 'bg-gray-500'} text-white`}
              >
                {request.accepted ? 'Unaccept' : 'Accept'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="max-w-3xl w-full p-4 bg-white rounded-lg shadow-lg">
            {modalContent}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EngineerRequests;
