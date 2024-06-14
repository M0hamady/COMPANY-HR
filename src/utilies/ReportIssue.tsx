import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch hook
import Modal from "./MoModal";
import { updateOrCreateTaskProblemFields } from "../store/companyActions";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

interface ReportIssueProps {
    taskId: number; // Specify the type of taskId as number
  }
  
  const ReportIssue: React.FC<ReportIssueProps> = ({ taskId }) => {  const [isModalOpen, setIsModalOpen] = useState(false);
  const [degree_of_problem, setdegree_of_problem] = useState("");
  const [text, settext] = useState("");
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle sending the report
  const sendReport = () => {
    // Dispatch the action to update or create the task problem
    dispatch(updateOrCreateTaskProblemFields({
      task: taskId, // Replace with the actual task ID
      degree_of_problem,
      text
    }));

    // Logic to send the report with the degree_of_problem and text
    console.log("Sending report with degree of problem:", degree_of_problem);
    console.log("text:", text);
    // Close the modal after sending the report
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal} className="px-2 py-1 rounded bg-red-900 hover:bg-red-600 duration-300 text-gray-50 ">ابلاغ عواقب</button>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="تقدير درجة المشكلة"
        primaryButtonName="إرسال التقرير"
        primaryButtonAction={sendReport}
        secondaryButtonName="إلغاء"
        secondaryButtonAction={closeModal}
      >
        <div>
          <p>برجاء تقدير درجة المشكلة:</p>
          <select
            id="large"
            className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={degree_of_problem}
            onChange={(e) => setdegree_of_problem(e.target.value)}
          >
            <option value="" disabled selected>اختر درجة المشكلة</option>
            <option value="low">منخفضة</option>
            <option value="medium">متوسطة</option>
            <option value="high">عالية</option>
          </select>
        </div>
        <div>
          <p>الطلب:</p>
          <textarea
                id="editor"
                rows={8}
                className="block w-full text-right  text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 p-4 px-2 rounded-md"
                placeholder="...قم بكتابة طلبك "
                required
                value={text}
                onChange={(e) => settext(e.target.value)}
              />
        </div>
      </Modal>
    </div>
  );
};

export default ReportIssue;
