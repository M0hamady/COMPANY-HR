import React from "react";

interface CardProps {
  item: any;
  index: number;
  setSelectedProjectNum: React.Dispatch<React.SetStateAction<number | null>>;

}

export const ProjectCard: React.FC<CardProps> = ({ item, index, setSelectedProjectNum }) => {
  const handleButtonClick = () => {
    setSelectedProjectNum(item.id); // Assuming 'item.id' is the identifier for the project
  };
  return (
    <div className="w-[420px] min-w-[180px] h-100 py-2 px-2 bg-[#20354b] rounded-2xl shadow-lg grid grid-flow-row">
      <div className=" flex flex-row-reverse items-center justify-start gap-3 px-2 text-right ">
        <div >/مشروع </div><div>{item.owner}</div>
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
        
      </div>
    </div>
  );
};