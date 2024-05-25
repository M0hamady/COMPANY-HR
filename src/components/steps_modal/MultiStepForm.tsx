import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { Transition } from "@headlessui/react";
import Modal from "../../utilies/MoModal";

interface FormData {
  step1Data: any; // Replace 'any' with the specific type for Step1 form data
  step2Data: any; // Replace 'any' with the specific type for Step2 form data
  step3Data: any; // Replace 'any' with the specific type for Step3 form data
}

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    step1Data: {},
    step2Data: {},
    step3Data: {},
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const handleSubmit = () => {
    console.log(formData);
    closeModal()
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
    const steps = ["Step 1", "Step 2", "Step 3"];

    return (
      <div className="flex space-x-4">
        {steps.map((step, index) => (
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
                currentStep === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
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
      <button onClick={openModal} className="bg-emerald-400 text-white px-4 py-2 rounded-lg m-4">
        عدة خطوات
      </button>
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title="Multi-Step Form"
          primaryButtonName={currentStep === 3 ? "Submit" : "Next"}
          primaryButtonAction={currentStep === 1 ? goToNextStep : currentStep === 3? handleSubmit: goToNextStep}
          secondaryButtonName={currentStep === 1 ? "Cancel" : "Previous"}
          secondaryButtonAction={currentStep === 1 ? closeModal : goToPreviousStep}
        >
          {renderStepIndicators()}
          {renderFormStep()}
        </Modal>
      )}
    </div>
  );
};

export default MultiStepForm;