import React, { ChangeEvent } from "react";

interface Step2Props {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface FormData {
  field2: number;
}

const Step2: React.FC<Step2Props> = ({ formData, onFormDataChange, onNext, onPrevious }) => {
  const handleInputChange = (value: number) => {
    onFormDataChange({ ...formData, field2: value });
  };

  const incrementField2 = () => {
    const newValue = formData.field2 + 1;
    handleInputChange(newValue);
  };

  const decrementField2 = () => {
    if (formData.field2 > 0) {
      const newValue = formData.field2 - 1;
      handleInputChange(newValue);
    }
  };

  return (
    <div>
      {/* <h3>تحديد عدد المساعدين</h3> */}
      <div className="flex items-center gap-2">
        <button
          onClick={decrementField2}
          className="text-gray-700 dark:text-gray-300 text-[30px] rounded-3xl w-1/4 bg-yellow-800   focus:outline-none focus:ring focus:ring-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          -
        </button>
        <input
          type="number"
          name="field2"
          value={formData.field2 || 0}
          readOnly
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
        />
        <button
          onClick={incrementField2}
          className="text-gray-700 dark:text-gray-300 text-[30px] rounded-3xl w-1/4 bg-yellow-800   focus:outline-none focus:ring focus:ring-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          +
        </button>
      </div>
      <div>
        {/* <button onClick={onPrevious}>Previous</button> */}
        {/* <button onClick={onNext}>Next</button> */}
      </div>
    </div>
  );
};

export default Step2;
