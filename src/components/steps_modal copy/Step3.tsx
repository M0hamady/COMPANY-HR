
// Step3.tsx
import React, { ChangeEvent } from "react";

interface Step3Props {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSubmit: (e:any) => void;
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
      <h3 className="text-red-900">التاكيد</h3>
      <h4 className="text-sm">يمكنك التاكيد لتسجيل التعديل او الرجوع للتاكد من تعديلاتك</h4>
      {/* <button onClick={onPrevious}>Previous</button> */}
      {/* <button onClick={onSubmit}>Submit</button> */}
    </div>
  );
};

export default Step3;