import React, { ChangeEvent, useState } from "react";

interface Step1Data {
  field1: string;
}

interface Step1Props {
  formData: Step1Data;
  onFormDataChange: (data: Step1Data) => void;
  onNext: () => void;
  previewData?: Step1Data;
}

const Step1: React.FC<Step1Props> = ({ formData, onFormDataChange, onNext, previewData }) => {
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onFormDataChange({ ...formData, [name]: value });
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div>
      <h3>تحديد عدد الصنايعية</h3>
      <input
        type="number"
        name="field1"
        value={previewMode ? (previewData?.field1 || "0") : (formData.field1 || "0")}
        onChange={handleInputChange}
      />
      {/* <button onClick={togglePreviewMode}>
        {previewMode ? "Exit Preview" : "Preview"}
      </button> */}
      {/* <button onClick={onNext}>Next</button> */}
    </div>
  );
};

export default Step1;