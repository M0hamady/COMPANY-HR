import React, { useState, useEffect } from "react";
import axios from "axios";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  fetchTickets: () => void;
}

const TicketModalCreation: React.FC<TicketModalProps> = ({ isOpen, onClose, token, fetchTickets }) => {
  const [step, setStep] = useState<number>(1);
  const [newTicketTitle, setNewTicketTitle] = useState<string>("");
  const [newTicketDescription, setNewTicketDescription] = useState<string>("");
  const [newStepDescription, setNewStepDescription] = useState<string>("");
  const [stepOrder, setStepOrder] = useState<number>(1); // New state to manage step order
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: string; username: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (step === 3) {
      fetchUsers();
    }
  }, [step]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://hrsupport.pythonanywhere.com/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateTicket = async () => {
    try {
      const response = await axios.post(
        "https://hrsupport.pythonanywhere.com/api/tickets/",
        { title: newTicketTitle, description: newTicketDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newTicket = response.data;
      setSelectedTicketId(newTicket.id);
      setStep(2); // Move to step 2
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleAddStep = async () => {
    if (selectedTicketId && newStepDescription) {
      try {
        await axios.post(
          `https://hrsupport.pythonanywhere.com/api/steps/`,
          { description: newStepDescription, order: stepOrder, ticket: selectedTicketId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStepOrder(prev => prev + 1); // Increment step order
        setStep(3); // Move to step 3
      } catch (error) {
        console.error("Error adding step:", error);
      }
    }
  };

  const handleAssignUsers = async () => {
    if (selectedTicketId) {
      try {
        await Promise.all(
          selectedUsers.map(userId =>
            axios.post(
              `https://hrsupport.pythonanywhere.com/api/ticket-assignments/`,
              { user: userId ,ticket: selectedTicketId },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
        setAssignments(prev => [...prev, ...selectedUsers]);
        onClose(); // Close the modal after successful assignment
        fetchTickets(); // Refresh tickets list
      } catch (error) {
        console.error("Error assigning users:", error);
      }
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 text-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          &times;
        </button>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Create Ticket</h2>
            <input
              type="text"
              value={newTicketTitle}
              onChange={(e) => setNewTicketTitle(e.target.value)}
              placeholder="Ticket Title"
              className="border p-2 mb-2 w-full"
            />
            <textarea
              value={newTicketDescription}
              onChange={(e) => setNewTicketDescription(e.target.value)}
              placeholder="Ticket Description"
              className="border p-2 mb-2 w-full"
              rows={3}
            />
            <button
              onClick={handleCreateTicket}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Create Ticket
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Add Step</h2>
            <textarea
              value={newStepDescription}
              onChange={(e) => setNewStepDescription(e.target.value)}
              placeholder="Step Description"
              className="border p-2 mb-2 w-full"
              rows={3}
            />
            <input
              type="number"
              value={stepOrder}
              onChange={(e) => setStepOrder(parseInt(e.target.value, 10))}
              placeholder="Step Order"
              className="border p-2 mb-2 w-full"
            />
            <button
              onClick={handleAddStep}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Add Step
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Assign Users</h2>
            <div className="mb-2 h-[40vh] overflow-auto py-4">
              {allUsers.map(user => (
                <div key={user.id} className="flex items-center mb-2 text-black">
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelection(user.id)}
                    className="mr-2 text-black"
                  />
                  <label htmlFor={`user-${user.id}`} className="text-black">
                    {user.username}
                  </label>
                </div>
              ))}
            </div>
            <button
              onClick={handleAssignUsers}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Assign Users
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketModalCreation;
