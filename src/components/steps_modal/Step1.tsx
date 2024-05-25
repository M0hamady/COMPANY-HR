import React, { ChangeEvent } from "react";

interface Step1Props {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onNext: () => void;
}

interface FormData {
  field1: string;
}

const Step1: React.FC<Step1Props> = ({ formData, onFormDataChange, onNext }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onFormDataChange({ ...formData, [name]: value });
  };

  return (
    <div>
      <h3>Step 1</h3>
      <input
        type="text"
        name="field1"
        value={formData.field1 || ""}
        onChange={handleInputChange}
      />
      {/* <button onClick={onNext}>Next</button> */}
    </div>
  );
};

export default Step1;
