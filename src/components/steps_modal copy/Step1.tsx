import React, { useState } from "react";

interface Step1Data {
  field1: number;
}

interface Step1Props {
  formData: Step1Data;
  onFormDataChange: (data: Step1Data) => void;
  onNext: () => void;
  previewData?: Step1Data;
}

const Step1: React.FC<Step1Props> = ({ formData, onFormDataChange, onNext, previewData }) => {
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (value: number) => {
    if (value >= 0) {
      onFormDataChange({ ...formData, field1: value });
    }
  };

  const incrementField1 = () => {
    const newValue = formData.field1 + 1;
    handleInputChange(newValue);
  };

  const decrementField1 = () => {
    if (formData.field1 > 0) {
      const newValue = formData.field1 - 1;
      handleInputChange(newValue);
    }
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="max-w-xs mx-auto">
      {/* <h3 className="text-lg font-medium mb-2">تحديد عدد الصنايعية</h3> */}
      <div className="flex items-center gap-2">
        <button
          onClick={decrementField1}
          className="text-gray-700 dark:text-gray-300 text-[30px] rounded-3xl w-1/4 bg-yellow-800   focus:outline-none focus:ring focus:ring-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          -
        </button>
        <input
          type="number"
          name="field1"
          value={previewMode ? (previewData?.field1 || 0) : (formData.field1 || 0)}
          readOnly // Make input read-only to prevent manual typing
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
        />
        <button
          onClick={incrementField1}
          className="text-gray-700 dark:text-gray-300 text-[30px] rounded-3xl w-1/4 bg-yellow-800   focus:outline-none focus:ring focus:ring-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          +
        </button>
      </div>
      <div className="flex justify-end mt-4"></div>
    </div>
  );
};

export default Step1;
