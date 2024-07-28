import React, { useState, useEffect } from "react";
import axios from "axios";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  fetchTickets: () => void;
  ticket: any;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, token, fetchTickets, ticket }) => {
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [userName, setUserName] = useState('');
useEffect(() => {
  
  const data:any = localStorage.getItem("loginResponse");
  const loginResponse = JSON.parse(data);
  setUserName(loginResponse.username);

}, [])


  useEffect(() => {
    if (ticket && ticket.length > 0) {
      setCurrentTicket(ticket);
      setEditTitle(ticket[0].title || "");
      setEditDescription(ticket[0].description || "");
    }
  }, [ticket]);

  if (!isOpen || !currentTicket || currentTicket.length === 0) return null;

  const handleCompleteAssignment = async (assignmentId: number) => {
    try {
      const response = await axios.post(
        `  https://hrsupport.pythonanywhere.com/api/ticket-assignments/${assignmentId}/complete/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "assignment marked as completed") {
        const updatedTicket = currentTicket.map((step: any) => {
          const updatedSteps = step.steps.map((s: any) => {
            const updatedAssignments = s.assignments.map((a: any) => {
              if (a.id === assignmentId) {
                return { ...a, completed: true };
              }
              return a;
            });
            return { ...s, assignments: updatedAssignments };
          });
          return { ...step, steps: updatedSteps };
        });
        setCurrentTicket(updatedTicket);
      }
      fetchTickets(); // Optionally refresh tickets after updating
    } catch (error) {
      console.error("Error completing assignment", error);
    }
  };

  const handleEditTicket = async () => {
    try {
      const response = await axios.put(
        `  https://hrsupport.pythonanywhere.com/api/tickets-detail/${currentTicket[0].id}/`,
        { title: editTitle, description: editDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCurrentTicket([{ ...currentTicket[0], title: editTitle, description: editDescription }]);
        setIsEditing(false);
        fetchTickets(); // Optionally refresh tickets after updating
      }
    } catch (error) {
      console.error("Error editing ticket", error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ticket Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 mb-2 border rounded dark:border-gray-600 text-black"
                placeholder="Title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full text-black p-2 mb-2 border rounded dark:border-gray-600"
                placeholder="Description"
              ></textarea>
              <button onClick={handleEditTicket} className="px-4 py-2 text-white bg-blue-500 rounded">
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="ml-2 px-4 py-2 text-white bg-gray-500 rounded">
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentTicket[0].title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentTicket[0].description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created By: {currentTicket[0].created_by_name}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 mt-2 text-white bg-yellow-500 rounded"
              >
                Edit
              </button>
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white">Steps</h4>
                {currentTicket[0].steps.map((step: any) => (
                  <div key={step.id} className="mb-4 p-2 border rounded dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Step {step.order}: {step.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Completed: {step.completed ? "Yes" : "No"}
                    </p>
                    <div className="mt-2">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Assignments</h5>
                      {step.assignments.map((assignment: any, index: number) => (
                        <div key={index} className="ml-4 flex items-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.user}</p>
                          {assignment.completed  ? (
                            <span className="ml-2 inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                          ) : assignment.user === userName ?  (
                            <button
                              onClick={() => handleCompleteAssignment(assignment.id)}
                              className="ml-2 inline-block px-2 py-1 text-xs text-white bg-blue-500 rounded-full"
                            >
                              Complete
                            </button>
                          ) : (
                            <span className="ml-2 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            {new Date(assignment.assigned_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
