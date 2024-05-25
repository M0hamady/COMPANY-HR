import React, { useState } from "react";

interface DropdownButtonProps {
  name: string;
  values: string[];
  setState: (value: string) => void;
  containerClassName?: string;
  buttonClassName?: string;
  listClassName?: string;
  optionClassName?: string;
  menuPosition?: "above" | "left" | "right" | "down";
  animationDuration?: number;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  name,
  values,
  setState,
  containerClassName = "relative inline-block",
  buttonClassName = "bg-emerald-400 text-white px-4 py-2 rounded-lg m-4",
  listClassName = "bg-white shadow-md mt-2 py-1 rounded-md text-gray-800",
  optionClassName = "block px-4 py-2 hover:bg-gray-200",
  menuPosition = "down",
  animationDuration = 300,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value: string) => {
    setState(value);
    setIsOpen(false);
  };

  const getDropdownListClassName = () => {
    switch (menuPosition) {
      case "above":
        return `${listClassName} absolute top-0 mt-0 transition duration-${animationDuration}ms`;
      case "left":
        return `${listClassName} absolute left-0 ml-0 transition duration-${animationDuration}ms`;
      case "right":
        return `${listClassName} absolute right-0 mr-0 transition duration-${animationDuration}ms`;
      default:
        return `${listClassName} transition duration-${animationDuration}ms`;
    }
  };

  return (
    <div className={`relative ${containerClassName}`}>
      <button
        className={`${buttonClassName} ${isOpen ? "open" : ""}`}
        onClick={handleButtonClick}
      >
        {name}{" "}
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 inline-block"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        )}
      </button>
      {isOpen && (
        <ul
          className={`absolute bottom-[100%] duration-300 ${getDropdownListClassName()} shadow-lg`}
        >
          {values.map((value) => (
            <li
              key={value}
              className={`${optionClassName} cursor-pointer duration-300 hover:border-amber-400 border-2 hover:shadow-md border-white rounded-md p-4 m-2`}
              onClick={() => handleOptionClick(value)}
            >
              {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownButton;