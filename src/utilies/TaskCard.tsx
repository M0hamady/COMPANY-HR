import React from "react";
import { useDispatch } from "react-redux";
import { assignTaskToFinish } from "../store/companyActions";
import { Link } from "react-router-dom";

interface CardProps {
  item: any;
  index: number;
  setCountUpdates: React.Dispatch<React.SetStateAction<number | null>>;
}

export interface item_type {
  item: {
    id: number;
    user: string;
    project_owner: string;
    title: string;
    description: string;
    is_finished: boolean;
    date_finished: string | null;
    date_created: string;
    date_updated: string | null;
    week: number;
    employee: string | null;
  };
  index: number;
}

// Function to handle the restart action
const handleRestart = () => {
  // Logic to restart the work on the item
};
export const Card: React.FC<CardProps> = ({ item, index, setCountUpdates }) => {
  const dispatch = useDispatch();

  const handleFinish = () => {
    // Ensure that item.id is a number and not null before dispatching
    if (typeof item.id === "number") {
      dispatch(assignTaskToFinish(item.id) as any);
      setCountUpdates(item.id);
    } else {
      console.error("item.id is null or not a number");
    }
  };
  return (
    <div className="w-full max-w-[400px] h-fit py-2 px-2 bg-[#20354b] rounded-2xl shadow-lg grid grid-flow-row">
      <div className=" flex flex-row-reverse items-center justify-start gap-3 px-2 ">
        <div>/العميل</div>
        <div>{item.user}</div>
      </div>
      <div className=" flex flex-col justify-end text-right gap-1">
        <div className="flex flex-row-reverse gap-2">
          <div>/الاسبوع</div>
          <div className="w-[20px] h-[20px] rounded-full bg-yellow-600 text-white flex items-center justify-center">
            {item.week}
          </div>
        </div>
        <div className="flex flex-row-reverse gap-2">
          <div>/اسم الباند</div>
          <div className="rounded-full text-white flex items-center justify-center">
            {item.title}
          </div>
        </div>
        <div className="flex flex-row-reverse gap-2">
          <div>/حالة الباند</div>
          <div className="w-fit rounded-full bg-yellow-600 px-4 text-white flex items-center justify-center">
            لم ينتهي بعد
          </div>
        </div>
      </div>
      <div className=" flex  flex-row-reverse items-center justify-between px-2 py-2">
        {item.is_finished ? (
          <div>
            <button
              className="bg-emerald-400 text-white px-4 py-2 rounded-lg"
              onClick={handleRestart}
            >
              انتهي
            </button>
          </div>
        ) : (
          <div>
            <button
              className="bg-red-800 text-white px-4 py-2 rounded-lg"
              onClick={handleFinish}
            >
              قم بانهاء الخطوة
            </button>
          </div>
        )}

        <Link
        to={`task/${item.id}`}
          className="bg-emerald-400 text-white px-4 py-2 rounded-lg"
          onClick={handleRestart}
        >
          عرض
        </Link>
      </div>
    </div>
  );
};
