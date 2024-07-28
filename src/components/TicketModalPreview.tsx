import React from "react";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  fetchTickets: () => void;
  ticket: any;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, token, fetchTickets, ticket }) => {
  if (!isOpen) return null;

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
          {ticket && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ticket[0].title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ticket[0].description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created By: {ticket[0].created_by}</p>
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white">Steps</h4>
                {ticket[0].steps.map((step: any) => (
                  <div key={step.id} className="mb-4 p-2 border rounded dark:border-gray-600">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Step {step.order}: {step.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed: {step.completed ? "Yes" : "No"}</p>
                    <div className="mt-2">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Assignments</h5>
                      {step.assignments.map((assignment: any, index: number) => (
                        <div key={index} className="ml-4 flex items-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{assignment.user}</p>
                          {assignment.completed ? (
                            <span className="ml-2 inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                          ) : (
                            <span className="ml-2 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 ml-2">{new Date(assignment.assigned_at).toLocaleString()}</p>
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
