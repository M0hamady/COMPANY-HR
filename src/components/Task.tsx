import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getExactTask, assignTaskToFinish } from "../store/companyActions";
import Layout from "../utilies/Layout";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { calculateDaysToCurrentDate } from "../utilies/calcDays";
import getInitials from "../utilies/getcharacterfromname";
import MultiStepForm from "./steps_modal/MultiStepForm";

interface Task {
  id: number;
  user: string;
  project_owner: string;
  project_createdBy: string | null;
  project_owner_technical: string | null;
  project_officeEng: string | null;
  title: string;
  week: string;
  attendance_status_ar: string;
  description: string | null;
  is_finished: boolean;
  is_there_problem: boolean;
  is_attended: boolean;
  date_finished: string;
  date_created: string;
  buttonName: string;
  date_updated: string;
  employee: string | null;
  num_of_crafts_man: number;
  num_of_crafts_man_assistant: number;
  buttonStatus: number;
  daily_report_lat_id:number
}

const Task = () => {
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();

  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdated, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data: any = await dispatch(getExactTask(id) as any);
        console.log(data);
        setTask(data.payload); // Set the task data from the payload
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred"); // More robust error handling
        setLoading(false);
      }
    };

    const delay = setTimeout(() => {
      fetchTask();
      setIsUpdate(false);
    }, 6000); // Fetch task after 1 second

    return () => {
      clearTimeout(delay); // Cleanup the timeout when the component is unmounted
    };
  }, [id, isUpdated]);

  const handleFinish = () => {
    // Ensure that task.id is a number and not null before dispatching
    if (typeof task?.id === "number") {
      setIsLoading(true); // Start loading
      dispatch(assignTaskToFinish(task.id) as any)
        .then(() => {
          // Handle successful completion here
          setIsUpdate(true);
        })
        .catch((error: any) => {
          // Handle any errors here
          console.error("An error occurred:", error);
        })
        .finally(() => {
          setIsLoading(false); // Stop loading regardless of outcome
        });
    } else {
      console.error("task.id is null or not a number");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">... </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-300 h-4"></div>
            <div className="bg-gray-300 h-4"></div>
            <div className="bg-gray-300 h-4"></div>
            <div className="bg-gray-300 h-4"></div>
            <div className="bg-gray-300 h-4"></div>
            <div className="bg-gray-300 h-4"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-rows-8 gap-4 h-[100vh] text-gray-800 font-bold">
        <div className="row-span-3 h-100 w-full  flex flex-row justify-around my-1">
          <div className="w-[100%] h-full gap-1 bg-blue-200 rounded shadow shadow-slate-300 py-4 px-1 grid grid-rows-8 max-sm:w-[300px]">
            <div className="row-span-2 border-b-2 border-blue-300  flex gap-2 flex-row-reverse  justify-between mx-2">
              <div className="row-span-2   flex gap-2 flex-row-reverse ">
                <h4>/مشروع</h4>
                <h4>
                  {task?.project_owner && getInitials(task?.project_owner)}
                </h4>
              </div>
              <div className="row-span-2   flex gap-2 flex-row-reverse ">
                <h4>/انشا بواسطة</h4>
                <h4>
                  {task?.project_createdBy &&
                    getInitials(task?.project_createdBy)}
                </h4>
              </div>
            </div>
            <div className="row-span-4  flex gap-2 flex-row-reverse  justify-between mx-2">
              <div className="row-span-2  flex gap-2 flex-row-reverse ">
                <h4>/بتاريخ</h4>
                <h4>
                  {task
                    ? new Date(task.date_created).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : null}
                </h4>{" "}
              </div>
              <div className="row-span-2  flex gap-2 flex-row-reverse ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
              </div>
            </div>
            <div className="row-span-4  flex gap-2 flex-row-reverse  justify-between mx-2">
              <div className="row-span-2  flex gap-2 flex-row-reverse ">
                <h6 className="text-sm text-red-900">
                  {task ? task.title : null}
                </h6>{" "}
              </div>
              <div className="row-span-2  flex gap-2 flex-row-reverse "></div>
            </div>
            <div className="row-span-4  flex gap-5 flex-row-reverse mx-2">
              <div className="row-span-2  flex gap-2 flex-row-reverse ">
                <h6 className="text-sm text-gray-900">
                الصنايعية:  {task ? task.num_of_crafts_man : null}
                </h6>{" "}
              </div>
              <div className="row-span-2  flex gap-2 flex-row-reverse ">
              <h6 className="text-sm text-gray-900">
                المساعدين:  {task ? task.num_of_crafts_man_assistant : null}
                </h6>{" "}
              </div>
            </div>
            <div className="row-span-4  flex gap-2 flex-row-reverse   ">
              <div className="  flex gap-2 flex-row-reverse w-full text-sm text-yellow-700 ">
                <h4>:موقف التسجيل</h4>
                <h4>{task?.attendance_status_ar}</h4>
              </div>
            </div>
            <div className="  flex gap-2 flex-row-reverse ">
              {task?.buttonStatus && 
                <>
                  <MultiStepForm
                    setIsUpdate={setIsUpdate}
                    buttonName={task?.buttonName}
                    setTask={setTask}
                    isUpdated={isUpdated}
                    last_daily_id={task.daily_report_lat_id}
                    buttonStatus={task.buttonStatus}
                    taskId={task.id}
                    num_of_crafts_man={task.num_of_crafts_man}
                    num_of_crafts_man_assistant={
                      task.num_of_crafts_man_assistant
                    }
                  />
                </>
              }
            </div>
            <div className="row-span-2  flex gap-2 flex-row-reverse  justify-between mx-2">
              <div className="row-span-2  flex gap-2 flex-row-reverse ">
                <h4>/مضي</h4>
                <h4>{calculateDaysToCurrentDate(task?.date_created)}</h4> يوم
              </div>
              <div className="row-span-2  flex gap-2 flex-row-reverse ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* <div className="w-[40%] h-full bg-blue-200 rounded shadow shadow-slate-300 p-4"></div> */}
        </div>
        <div className="row-span-5 h-100 w-full ">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">بيانات الباند</h2>
            {task ? (
              <div className="grid grid-cols-2 gap-4 max-sm:flex max-sm:flex-col max-sm:overflow-auto max-sm:h-[80%] max-sm:max-h-[60vh] ">
                <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold">الملاحظات</h3>
                  <p className="text-lg">{task.description}</p>
                </div>
                <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                  <div className="flex gap-6 justify-start  flex-row-reverse">
                    {" "}
                    <h3 className="text-lg font-bold">/مهندس الموقع</h3>
                    <p className="text-lg">
                      {task.project_officeEng || "لم يحدد بعد"}
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                  <div className="flex gap-6 justify-start  flex-row-reverse">
                    {" "}
                    <h3 className="text-lg font-bold">مهندس الفني</h3>
                    <p className="text-lg">
                      {task.project_owner_technical || "لم يحدد بعد"}
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                      />
                    </svg>
                  </div>
                  <div className="flex gap-6 justify-start flex-row-reverse ">
                    <h3 className="text-lg font-bold">الإسبوع</h3>
                    <p className="text-lg">{task.week}</p>
                  </div>
                </div>
                <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                      />
                    </svg>
                  </div>
                  <div className="flex gap-6 justify-start  flex-row-reverse">
                    <h3 className="text-lg font-bold">تاريخ الإنشاء</h3>
                    <p className="text-lg">
                      {new Date(task.date_created).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                      />
                    </svg>
                  </div>
                  <div className="flex gap-6 justify-start  flex-row-reverse">
                    <h3 className="text-lg font-bold">تاريخ التحديث</h3>
                    <p className="text-lg">
                      {new Date(task.date_updated).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                      />
                    </svg>
                  </div>
                  <div className="flex gap-6 justify-start  flex-row-reverse">
                    <h3 className="text-lg font-bold">تاريخ الانتهاء</h3>
                    {task.is_finished ? (
                      <p className="text-lg">
                        {new Date(task.date_finished).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    ) : (
                      <p className="text-lg">لم يتم الانتهاء بعد</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p>تفاصيل المهمة غير متوفرة.</p>
            )}
            {!task?.is_finished ? (
              <button
                className={`bg-emerald-400 text-white px-4 py-2 rounded-lg m-4 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleFinish}
                disabled={isLoading}
              >
                {isLoading ? "جاري التحميل..." : "انتهي"}
              </button>
            ) : (
              <button
                className="bg-emerald-400 text-white px-4 py-2 rounded-lg m-4"
                onClick={handleFinish}
                disabled={isLoading}
                title={isLoading ? "يرجى الاتصال بالمسؤول" : ""}
              >
                {isLoading ? "اتصل بالمسؤل..." : " تم انهاء الخطوة"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Task;
