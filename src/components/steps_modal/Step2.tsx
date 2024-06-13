import React, { ChangeEvent } from "react";

interface Step2Props {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface FormData {
  field2: string;
}

const Step2: React.FC<Step2Props> = ({ formData, onFormDataChange, onNext, onPrevious }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onFormDataChange({ ...formData, [name]: value });
  };

  return (
    <div>
      <h3>تحديد عدد المساعدين</h3>
      <input
        type="number"
        name="field2"
        value={formData.field2 || 0 }
        onChange={handleInputChange}
      />
      {/* <button onClick={onPrevious}>Previous</button> */}
      {/* <button onClick={onNext}>Next</button> */}
    </div>
  );
};

export default Step2;
