import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { Transition } from "@headlessui/react";
import Modal from "../../utilies/MoModal";
import { createDailyReportFields, updateDailyReportFields, updateTaskFields } from "../../store/companyActions";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { extractNumberFromString } from "../../utilies/ToNum";

interface FormData {
  step1Data: Step1Data;
  step2Data: Step2Data;
  step3Data: any; // Replace 'any' with the specific type for Step3 form data
}
interface Task {
  id: number;
  user: string;
  project_owner: string;
  project_createdBy: string | null;
  project_owner_technical: string | null;
  project_officeEng: string | null;
  title: string;
  week: string;
  description: string | null;
  is_finished: boolean;
  is_there_problem: boolean;
  date_finished: string;
  date_created: string;
  date_updated: string;
  employee: string | null;
  num_of_crafts_man: number ;
  num_of_crafts_man_assistant: number ;
}
interface MultiStepFormProps {
  taskId: number;
  buttonName: string;
  isUpdated: boolean;
  num_of_crafts_man: number;
  last_daily_id: number;
  buttonStatus: number;
  num_of_crafts_man_assistant: number;
  setIsUpdate: (value: boolean) => void
  setTask: (value: any) => void
}
interface Step1Data {
  field1: any;
}

interface Step2Data {
  field2: any;
}
const MultiStepForm: React.FC<MultiStepFormProps> = ({ setIsUpdate,last_daily_id, buttonStatus ,buttonName, setTask, isUpdated,taskId,num_of_crafts_man, num_of_crafts_man_assistant}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    step1Data: { field1: num_of_crafts_man },
    step2Data: { field2: num_of_crafts_man_assistant },
    step3Data: {},
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch: ThunkDispatch<any, undefined, AnyAction> = useDispatch();

  const handleFormDataChange = (step: keyof FormData, data: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [step]: data,
    }));
  };

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };


// لو كان ب 1 كدا محتاجين نضيف واحد جديد 
// يكلم القرشي لو 2 
// 3 يقوم بالتعديل ف طلب الغد
// 4 تاكيد الحضور
// 5 تاكيد الغياب بتسجيل طلب اخر
  const handleSubmit = async () => {
    if (buttonStatus === 1 || buttonStatus === 5  ) {
      try {
        const step1UpdateResponse = await dispatch(
          createDailyReportFields({
            task: taskId,
            num_of_crafts_man: extractNumberFromString(formData.step1Data.field1),
            num_of_crafts_man_assistant: extractNumberFromString(formData.step2Data.field2),
          })
        );
        // console.log('Step 1 Update Response:', step1UpdateResponse);
    
      
        // setTask(step2UpdateResponse)
        closeModal();
        setIsUpdate(true);
    
        // Reset the form or perform any other necessary actions
        setFormData({
          step1Data: { field1: '' },
          step2Data: { field2: '' },
          step3Data: {},
        });
      } catch (error) {
        // Handle any errors that occurred during the update
        console.error('Error updating task fields:', error);
      }
    }
    else if (buttonStatus === 3) {
      try {
        const step1UpdateResponse = await dispatch(
          updateDailyReportFields({
            dailyId: `${last_daily_id}`,
            fieldName:'num_of_crafts_man',
            fieldValue: extractNumberFromString(formData.step1Data.field1),
          })
        );
        const step2UpdateResponse = await dispatch(
          updateDailyReportFields({
            dailyId: `${last_daily_id}`,
            fieldName:'num_of_crafts_man_assistant',
            fieldValue: extractNumberFromString(formData.step2Data.field2),
          })
        );
        // console.log('Step 1 Update Response:', step1UpdateResponse);
    
      
        // setTask(step2UpdateResponse)
        closeModal();
        setIsUpdate(true);
    
        // Reset the form or perform any other necessary actions
        setFormData({
          step1Data: { field1: '' },
          step2Data: { field2: '' },
          step3Data: {},
        });
      } catch (error) {
        // Handle any errors that occurred during the update
        console.error('Error updating task fields:', error);
      }
    }
    else if (buttonStatus === 4) {
      try {
        const step1UpdateResponse = await dispatch(
          updateDailyReportFields({
            dailyId: `${last_daily_id}`,
            fieldName:'is_attended',
            fieldValue: true,
          })
        );
      
        // console.log('Step 1 Update Response:', step1UpdateResponse);
    
      
        // setTask(step2UpdateResponse)
        closeModal();
        setIsUpdate(true);
    
        // Reset the form or perform any other necessary actions
        setFormData({
          step1Data: { field1: '' },
          step2Data: { field2: '' },
          step3Data: {},
        });
      } catch (error) {
        // Handle any errors that occurred during the update
        console.error('Error updating task fields:', error);
      }
    } else {
      
    }


  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            formData={formData.step1Data}
            onFormDataChange={(data) => handleFormDataChange("step1Data", data)}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <Step2
            formData={formData.step2Data}
            onFormDataChange={(data) => handleFormDataChange("step2Data", data)}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData.step3Data}
            onFormDataChange={(data) => handleFormDataChange("step3Data", data)}
            onSubmit={handleSubmit}
            onPrevious={goToPreviousStep}
          />
        );
      default:
        return null;
    }
  };

  const renderStepIndicators = () => {
    const steps = [''];
    if (buttonStatus === 1 || buttonStatus === 5) {
      const steps = ["تحديد الصنايعية اولا", "تحديد المساعدين ثانيا", "تاكيد الطلب"];
    } else if (buttonStatus === 3 ){
      const steps = ["تعديل الصنايعية اولا", "تعديل المساعدين ثانيا", "تاكيد التعديل"];
    } else if (buttonStatus === 4 ){
      const steps = ["تاكيد عدد الصنايعية اولا", "تاكيد عدد  المساعدين ثانيا", "تاكيد الحضور"];

    }else {
      const steps = ['اجراء مكالمة'];

    }

    return (
      <div className="flex space-x-4">

        { buttonStatus !==2 && steps.map((step, index) => (
          <Transition
            key={index}
            show={currentStep >= index + 1}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`${
                currentStep === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } py-2 px-4 rounded`}
            >
              {step}
            </div>
          </Transition>
        ))}
      </div>
    );
  };


  return (
    <div>
      <button
        onClick={openModal}
        className="bg-emerald-400 text-white px-2 py-1 rounded-lg text-sm"
      >
        {buttonName}{" "}
      </button>
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title=" الصنايعية والمساعدين"
          primaryButtonName={currentStep === 3 ? "تاكيد" : "التالي"}
          primaryButtonAction={
            currentStep === 1
              ? goToNextStep
              : currentStep === 3
              ? handleSubmit
              : goToNextStep
          }
          secondaryButtonName={currentStep === 1 ? "الغاء التعديل" : "السابق"}
          secondaryButtonAction={
            currentStep === 1 ? closeModal : goToPreviousStep
          }
        >
          {renderStepIndicators()}
          {renderFormStep()}
        </Modal>
      )}
    </div>
  );
};

export default MultiStepForm;
