import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { assignTaskToFinish } from "../store/companyActions";
import { Link } from "react-router-dom";

interface CardProps {
  item: any;
  index: number;
  setCountUpdates: React.Dispatch<React.SetStateAction<number | null>>;
}

export const Card: React.FC<CardProps> = ({ item, index, setCountUpdates }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [updatedItem, setUpdatedItem] = useState<any>(item); // State to hold the updated item

  const handleFinish = async () => {
    setLoading(true);
    try {
      if (typeof item.id === "number") {
        const response = await dispatch(assignTaskToFinish(item.id) as any);
        // Assuming response contains updated item data
        if (response && response.payload) {

          setUpdatedItem(response.payload); // Update state with response data
          console.log(updatedItem.is_finished);
          setCountUpdates(item.id);
        }
      } else {
        console.error("item.id is null or not a number");
      }
    } catch (error) {
      console.error("Error finishing the step:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle restart action
  const handleRestart = () => {
    // Logic to restart the work on the item
  };

  return (
<div className="w-full max-w-[400px] h-fit py-2 px-2 bg-[#20354b] rounded-2xl shadow-lg grid grid-flow-row">
      <div className=" flex flex-row-reverse items-center justify-start gap-3 px-2 ">
        <div>/المسئول</div>
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
        {updatedItem.is_finished ? (
          <div>
            <button
              className="bg-emerald-400 text-white px-4 py-2 rounded-lg"
              // onClick={handleRestart}
            >
              انتهي
            </button>
          </div>
        ) : (
          <div>
            <button
              className="bg-red-800 text-white px-4 py-2 rounded-lg"
              onClick={handleFinish}
              disabled={loading}
            >
              {loading ? "جاري انهاء الخطوة" : "قم بانهاء الخطوة"}
            </button>
          </div>
        )}

        <Link
          to={`task/${updatedItem.id}`}
          className="bg-emerald-400 text-white px-4 py-2 rounded-lg"
          // onClick={handleRestart}
        >
          عرض
        </Link>
      </div>
    </div>
  );
};
