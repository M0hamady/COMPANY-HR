import React from "react";
import { Link } from "react-router-dom";
import getInitials from "./getcharacterfromname";

interface CardProps {
  item: any;
  index: number;
  setSelectedProjectNum: React.Dispatch<React.SetStateAction<number | null>>;
}

export const ProjectCard: React.FC<CardProps> = ({
  item,
  index,
  setSelectedProjectNum,
}) => {
  const handleButtonClick = () => {
    setSelectedProjectNum(item.id); // Assuming 'item.id' is the identifier for the project
  };
  return (
    <div className="w-[420px] min-w-[180px] h-100 py-2 px-2 bg-[#20354b] rounded-2xl shadow-lg grid grid-flow-row">
      <div className=" flex flex-row-reverse items-center justify-start gap-3 px-2 text-right ">
        <div>/مشروع </div>
        <div>{item.owner}</div>
      </div>
      <div className=" flex flex-col justify-end text-right gap-1">
        <div className="flex flex-row-reverse gap-2">
          <div>/الاسبوع</div>
          <div className="w-[20px] h-[20px] rounded-full bg-yellow-600 text-white flex items-center justify-center">
            {item.current_week}
          </div>
        </div>
      </div>
      <div className=" flex  flex-row-reverse items-center justify-between px-2 py-2">
        <div>
          <button
            className="bg-emerald-400 text-white px-4 py-2 rounded-lg"
            onClick={handleButtonClick} // Set the onClick event handler
          >
            عرض
          </button>
        </div>
        <div className="bg-indigo-800 text-white  rounded-lg max-h-[40px] min-w-[60px] flex">
          <Link
            className=" text-white px-4 py-2"
            to={`project/${item.id}`} // Set the onClick event handler
          >
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
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
