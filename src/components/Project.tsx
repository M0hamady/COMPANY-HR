import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getExactTask,
  assignTaskToFinish,
  getExactProject,
} from "../store/companyActions";
import Layout from "../utilies/Layout";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { calculateDaysToCurrentDate } from "../utilies/calcDays";
import { RootState } from "../store/reducers";
import DropdownButton from "../utilies/DropDownButton";
import Modal from "../utilies/MoModal";

interface Project {
  id: number;
  current_week: number;
  owner: string;
  title: string;
  current_step: string;
  is_created_with_tasks: boolean;
  site_technical_employee: string | null;
  office_technical_employee: string | null;
  office_technical_manager: string | null;
  company_consultant: string | null;
  manager_employee: string | null;
  date_finished: string;
  date_created: string;
  date_updated: string;
  all_tasks: Task[];
}

interface Task {
  id: number;
  user: string;
  project_owner: string;
  project_createdBy: string | null;
  project_owner_technical: string | null;
  project_officeEng: string | null;
  title: string;
  week: string;
  description: string | null;
  is_finished: boolean;
  date_finished: string;
  date_created: string;
  date_updated: string;
  employee: string | null;
}

function filterTasksByWeek(project: Project, currentWeek: number) {
  const tasks = project.all_tasks;
  const currentWeekTasks = tasks.filter(
    (task) => task.week === currentWeek.toString()
  );

  const finishedTasks = tasks.filter((task) => task.is_finished);
  const currentWeekFinishedTasks = currentWeekTasks.filter(
    (task) => task.is_finished
  );
  const currentWeekUnfinishedTasks = currentWeekTasks.filter(
    (task) => !task.is_finished
  );

  return {
    currentWeekFinishedTasks,
    finishedTasks: finishedTasks,
    finishedTasksCount: finishedTasks.length,
    currentWeekFinishedTasksCount: currentWeekFinishedTasks.length,
    currentWeekUnfinishedTasksCount: currentWeekUnfinishedTasks.length,
  };
}

const Project = () => {
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();
  const loggedIn = useSelector((state: RootState) => state.company.loggedIn);
  const userType = useSelector((state: RootState) => state.company.userType);
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdated, setIsUpdate] = useState(false);
  const [thisWeekFinishedTasks, setThisWeekFinishedTasks] = useState<
    number | any
  >();
  const [allFinishedTasks, setAllFinishedTasks] = useState<number | any>();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data: any = await dispatch(getExactProject(id) as any);
        console.log(data);
        setProject(data.payload); // Set the task data from the payload
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred"); // More robust error handling
        setLoading(false);
      }
    };

    const delay = setTimeout(() => {
      fetchTask();
      setIsUpdate(false);
    }, 1000); // Fetch task after 1 second

    return () => {
      clearTimeout(delay); // Cleanup the timeout when the component is unmounted
    };
  }, [id, isUpdated]);
  useEffect(() => {
    setThisWeekFinishedTasks(
      project?.all_tasks
        .filter((task: Task) => task.week === project?.current_week.toString())
        .filter((task: Task) => task.is_finished).length
    );
    setAllFinishedTasks(
      project?.all_tasks.filter((task: Task) => task.is_finished).length
    );
  }, [project]);
  const handleFinish = () => {
    // Ensure that task.id is a number and not null before dispatching
    if (typeof project?.id === "number") {
      dispatch(assignTaskToFinish(project.id) as any);
      // Get updated task data
      setIsUpdate(true);
    } else {
      console.error("task.id is null or not a number");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4 text-right">
            ... جاري تحميل البينات
          </h2>
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
        <div className="row-span-2 h-100 w-full  flex flex-row justify-around gap-2 max-sm:overflow-auto">
          <div className="w-[40%] max-sm:w-[300px] h-full gap-1 bg-blue-200 rounded shadow shadow-slate-300 p-4 grid grid-rows-8">
            <div className="row-span-2 border-b-2 border-blue-300  flex gap-2 flex-row-reverse  justify-between mx-2 max-sm:w-[270px] ">
              <div className="row-span-2   flex gap-2 flex-row-reverse ">
                <h4>/مشروع</h4>
                <h4>{project?.owner}</h4>
              </div>
              <div className="row-span-2   flex gap-2 flex-row-reverse ">
                <h4>/الاستشاري</h4>
                <h4>{project?.company_consultant}</h4>
              </div>
            </div>
            <div className="row-span-4  flex gap-2 flex-row-reverse  justify-between mx-2">
              <div className="row-span-2  flex gap-2 flex-row-reverse ">
                <h4>/بتاريخ</h4>
                <h4>
                  {project
                    ? new Date(project.date_created).toLocaleString("en-US", {
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
            <div className="row-span-2  flex gap-2 flex-row-reverse  justify-between mx-2">
              <div className="row-span-2  flex gap-2 flex-row-reverse ">
                <h4>/مضي</h4>
                <h4>{calculateDaysToCurrentDate(project?.date_created)}</h4> يوم
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
          <div className="w-[40%] max-sm:w-[300px] h-full bg-blue-200 rounded shadow shadow-slate-300 p-4">
            <div className="flex flex-col gap-2 max-sm:w-[270px] ">
              <div className="flex justify-between flex-row-reverse ">
                {userType}
                <div className="flex gap-4 text-2xl ">
                  {project?.current_step}
                  <h1>:المرحلة الحالية </h1>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                  />
                </svg>
              </div>
              <div>
                <button
                  onClick={handleOpenModal}
                  className="btn btn-light bg-lime-600 p-4 rounded-lg"
                >
                  {userType === "site_Manager"
                    ? "الانتقال الي  مرحلة جديدة وانهاء المرحلة"
                    : userType === "site_technical"
                    ? " قم باخطار مدير القطاع بالتعديلات"
                    : userType === "office_technical"
                    ? "قوم باخطار مدير المكتب الفني"
                    : ""}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                    />
                  </svg>
                </button>
                <Modal
                  isOpen={modalOpen}
                  onClose={handleCloseModal}
                  title="Sample Modal"
                  primaryButtonName="Confirm"
                  primaryButtonStyle="bg-green-500 text-white"
                  primaryButtonAction={handleCloseModal}
                  secondaryButtonName="Cancel"
                  secondaryButtonStyle="bg-red-500 text-white"
                  secondaryButtonAction={handleCloseModal}
                >
                  <p>
                    {" "}
                    {userType === "site_Manager"
                      ? "فقط مدير المكتب الفني يمكنه الانتقال الي المرحلة التالية قم باخطارة اولا"
                      : userType === "site_technical"
                      ? "فقط مدير المكتب الفني يمكنه الانتقال الي المرحلة التالية قم باخطارة اولا"
                      : userType === "office_manager" &&
                        project?.current_step === "3D_design"
                      ? "هل انت متاكد من الانتقال الي المرحلة التالية ؟ (بدا العمل علي الدروب شيبينج)"
                      : userType === "office_manager" &&
                        project?.current_step === "drop_shipping"
                      ? "هل انت متاكد من الانتقال الي المرحلة التالية ؟ (بدا التنفيذ)"
                      : ""}
                    .
                  </p>
                </Modal>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-6 h-100 w-full ">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">بيانات الباند</h2>
            {project ? (
              <div className="grid grid-cols-2 gap-4 max-sm:flex max-sm:flex-col max-sm:overflow-auto max-sm:h-[64vh]">
                <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold">عدد البنود</h3>
                  {/* <p className="text-lg">{project.tasks.length}</p> */}
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
                      {project.site_technical_employee || "لم يحدد بعد"}
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
                      {project.office_technical_employee || "لم يحدد بعد"}
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
                    <h3 className="text-lg font-bold">
                      {" "}
                      الإسبوع الحالي للمشروع
                    </h3>
                    <p className="text-lg">{project.current_week}</p>
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
                      {new Date(project.date_created).toLocaleString("en-US", {
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
                      {new Date(project.date_updated).toLocaleString("en-US", {
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
                    <h3 className="text-lg font-bold">
                      اعمال اانتهت هذا الاسبوع
                    </h3>
                    <h3>{thisWeekFinishedTasks}</h3>
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
                    <h3 className="text-lg font-bold">اعمال اانتهت</h3>
                    <h3>{allFinishedTasks}</h3>
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
                    {project.date_finished ? (
                      <p className="text-lg">
                        {new Date(project.date_finished).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
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

            {/* <div className="flex flex-row gap-3 max-sm:flex-col max-sm:gap-1 my-2">
              {}
              <DropdownButton
                name="تعين مهندس موقع"
                buttonClassName="bg-emerald-400 text-white px-4 py-2 rounded-lg m-4 max-sm:my-0"
                setState={handleFinish}
                values={["Option 1", "Option 2", "Option 3"]}
              />

              <MultiStepForm />
              <button
                className="bg-emerald-400 text-white px-4 py-2 rounded-lg m-4 max-sm:my-0"
                onClick={handleFinish}
              >
                يتعين مهندس مكتبي
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Project;
