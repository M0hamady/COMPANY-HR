import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../utilies/Layout";
import TicketModal from "./TicketModalPreview";
import TicketModalCreation from "../utilies/TicketModalCreation";

const Tickets: React.FC = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalCreationOpen, setIsModalCreationOpen] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userTypeFromStorage = localStorage.getItem("userType");
    const tokenFromStorage = localStorage.getItem("token");

    if (userTypeFromStorage && tokenFromStorage) {
      setUserType(userTypeFromStorage);
      setToken(tokenFromStorage);
      fetchTickets(tokenFromStorage);
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const fetchTickets = async (authToken: string) => {
    try {
      const response = await axios.get("  https://hrsupport.pythonanywhere.com/api/tickets/", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const ticketsWithDefaultDescription = response.data.map((ticket: any) => ({
        ...ticket,
        description: ticket.description || "",
      }));

      setTickets(ticketsWithDefaultDescription);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const response = await axios.get(`  https://hrsupport.pythonanywhere.com/api/tickets-detail/?ticket_id=${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTicket(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full bg-gray-200">
          <div className="text-xl text-gray-700">Loading...</div>
        </div>
      </Layout>
    );
  }

//   if (userType !== "manager") {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-full bg-red-100">
//           <div className="text-xl text-red-600">Unauthorized Access</div>
//         </div>
//       </Layout>
//     );
//   }

  return (
    <Layout>
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Latest Tickets</h5>
          <button
            onClick={() => setIsModalCreationOpen(true)}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create New Ticket
          </button>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {tickets?.map((ticket) => (
              <li key={ticket.id} className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {ticket.id}
                    {/* <img className="w-8 h-8 rounded-full" src={ticket.image || "/default-avatar.png"} alt={ticket.title} /> */}
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {ticket.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {ticket.description || "No description"}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      Assigned to: {ticket.assignedTo || "Unassigned"}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      Status: {ticket.status || "Pending"}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {/* {ticket.price || "$0"} */}
                  </div>
                  <button
                    onClick={() => fetchTicketDetails(ticket.id)}
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <TicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          token={token!}
          fetchTickets={() => fetchTickets(token!)}
          ticket={selectedTicket}
        />
      </div>
      {isModalCreationOpen && (
          <TicketModalCreation
            isOpen={isModalCreationOpen}
            onClose={()=>setIsModalCreationOpen(false)}
            token={token!}
            fetchTickets={() => fetchTickets(token!)}
          />
        )}
    </Layout>
  );
};

export default Tickets;
