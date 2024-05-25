
// Step3.tsx
import React, { ChangeEvent } from "react";

interface Step3Props {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSubmit: () => void;
  onPrevious: () => void;
}

interface FormData {
  field3: string;
}

const Step3: React.FC<Step3Props> = ({ formData, onFormDataChange, onSubmit, onPrevious }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onFormDataChange({ ...formData, [name]: value });
  };

  return (
    <div>
      <h3>Step 3</h3>
      <input
        type="text"
        name="field3"
        value={formData.field3 || ""}
        onChange={handleInputChange}
      />
      {/* <button onClick={onPrevious}>Previous</button> */}
      {/* <button onClick={onSubmit}>Submit</button> */}
    </div>
  );
};

export default Step3;