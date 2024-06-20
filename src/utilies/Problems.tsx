import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ar as arLocale } from "date-fns/locale";
import { useDispatch } from "react-redux";
import { updateOrCreateTaskProblemFields } from "../store/companyActions";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

interface ProblemCardProps {
  problems: Problem[];
}

interface Problem {
  id: number;
  text: string;
  is_solved: boolean;
  date_solved: string | null;
  degree_of_problem: string;
  task: number;
  solved_by: string | null;
}

export interface LoginResponse {
  token: string;
  userId: number;
  userType: string;
  // Add more properties as needed based on your actual JSON structure
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problems }) => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();
  const cachedResponseJson = localStorage.getItem("loginResponse");

  let cachedResponse: LoginResponse | null = null;

  if (cachedResponseJson) {
    cachedResponse = JSON.parse(cachedResponseJson);
  }

  const handleButtonClick = (problem: Problem) => {
    setSelectedProblem(problem);
  };

  const handleProblemSolved = (problem: Problem) => {
    dispatch(
      updateOrCreateTaskProblemFields({
        taskProblemId: problem.id,
        task: problem.task,
        degree_of_problem: problem.degree_of_problem,
        text: problem.text,
        is_solved: true, // Marking the problem as solved
      })
    );

    closeModal();
  };

  const closeModal = () => {
    setSelectedProblem(null);
  };

  const formatDate = (date: string | null) => {
    return date
      ? format(new Date(date), "dd/MM/yyyy", { locale: arLocale })
      : "لم يتم الحل بعد";
  };

  return (
    <div className="flex flex-wrap overflow-x-auto" style={{ maxWidth: "100%" }}>
      {problems.map((problem) => (
        <div className="flex" key={problem.id}>
          <button
            type="button"
            className={`button`}
            onClick={() => handleButtonClick(problem)}
            style={{ minWidth: "120px", maxWidth: "180px", margin: "5px" }}
          >
            <div
              className={`  ${problem.is_solved ? 'bg-green-900' : 'bg-red-900'} hover:${problem.is_solved ? 'bg-green-600' : 'bg-red-600'} button-top rounded text-white py-2 `}
            >
              {problem.text.slice(0, 10)}
            </div>
            <div className="button-bottom"></div>
            <div className="button-base"></div>
          </button>
        </div>
      ))}

      {/* Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
          <div className="z-50 w-full max-w-lg p-6 m-4 bg-white rounded-lg shadow-lg mx-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-right">تفاصيل المشكلة</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={closeModal}
              >
                إغلاق
              </button>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            <div className="text-right">
              <p className="mb-2">
                <strong>النص:</strong> {selectedProblem.text}
              </p>
              <p className="mb-2">
                <strong>تم الحل:</strong>{" "}
                {selectedProblem.is_solved ? "نعم" : "لا"}
              </p>
              {selectedProblem.is_solved && (
                <p className="mb-2">
                  <strong>تاريخ الحل:</strong>{" "}
                  {formatDate(selectedProblem.date_solved)}
                </p>
              )}
              <p className="mb-2 flex flex-row-reverse">
                <strong>: درجة المشكلة</strong>{" "}
                {selectedProblem.degree_of_problem}{" "}
              </p>
              {selectedProblem.is_solved && (
                <p className="mb-2 flex flex-row-reverse ">
                  <strong>: تم الحل بواسطة</strong>{" "}
                  {selectedProblem.solved_by ?? "لم يتم الحل بعد"}
                  {" -"}
                </p>
              )}
              {(cachedResponse?.userType === "site_manager" ||
                cachedResponse?.userType === "manager" ||
                cachedResponse?.userType === "office_manager") && (
                <button
                  type="button"
                  className="button"
                  onClick={() => handleProblemSolved(selectedProblem)}
                >
                  <div className="button-top">تم الحل</div>
                  <div className="button-bottom"></div>
                  <div className="button-base"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemCard;
