import React, { useState } from 'react';
import axios, { AxiosError } from 'axios'; // Import AxiosError for type inference

interface InputField {
  name: string;
  type: string;
  options?: string[];
}

interface Section {
  name: string;
  fields: InputField[];
}

interface DynamicFormProps {
  sections: Section[];
  apiUrl: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ sections, apiUrl }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldCompletion, setFieldCompletion] = useState<Record<string, boolean>>({});

  // Calculate total fields and completed fields for progress calculation
  const totalFields = sections.reduce((total, section) => total + section.fields.length, 0);
  const completedFieldsInSection = sections[activeSectionIndex].fields.reduce((count, field) => {
    return formData[field.name] ? count + 1 : count;
  }, 0);
  const progress = Math.round((completedFieldsInSection / sections[activeSectionIndex].fields.length) * 100);

  const validateField = (name: string, value: any) => {
    let error = '';
    if (!value) {
      error = `${name} is required`;
    } else {
      switch (name) {
        case 'Contact Email':
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            error = 'Invalid email address';
          }
          break;
        case 'Phone Number':
        case 'Secondary Phone':
          const phonePattern = /^[0-9]{10,15}$/;
          if (!phonePattern.test(value)) {
            error = 'Invalid phone number';
          }
          break;
        case 'Birth Date':
          if (new Date(value) >= new Date()) {
            error = 'Birth date cannot be in the future';
          }
          break;
        case 'Graduation Year':
          if (value < 1900 || value > new Date().getFullYear()) {
            error = 'Invalid graduation year';
          }
          break;
        case 'Last Salary':
        case 'Expected Salary':
        case 'Available Start in Days':
        case 'Years of Interior Finishing Experience':
          if (value < 0) {
            error = `${name} cannot be negative`;
          }
          break;
        default:
          break;
      }
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    setFieldCompletion(prevCompletion => ({ ...prevCompletion, [name]: !error }));
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, multiple, selectedOptions } = e.target as HTMLSelectElement;

    if (multiple) {
      const values = Array.from(selectedOptions, option => option.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    // Validate all fields before submitting
    const validationErrors = sections[activeSectionIndex].fields.reduce((acc, field) => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        acc[field.name] = error;
      }
      return acc;
    }, {} as Record<string, string>);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(apiUrl, formData);
      setSubmitSuccess(true);

      // Move to the next section if available
      if (activeSectionIndex < sections.length - 1) {
        setActiveSectionIndex(prevIndex => prevIndex + 1);
        setFormData({});
        setErrors({});
        setFieldCompletion({});
      }
    } catch (error: any) { // Explicitly type error as any or AxiosError
      if (error.response && error.response.status === 403) {
        setSubmitError('This email or phone number is already registered. Please use a different one.');
      } else {
        setSubmitError('Something went wrong. Please try again later.');
      }
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: InputField) => {
    const fieldCompleted = fieldCompletion[field.name];

    if (field.type === 'select') {
      return (
        <div key={field.name} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.name}>
            {field.name}
          </label>
          <select
            id={field.name}
            name={field.name}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange}
            required
            value={formData[field.name] || ''}
          >
            <option value="">Select {field.name}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldCompleted && <p className="text-green-500 text-xs italic">Completed</p>}
          {errors[field.name] && <p className="text-red-500 text-xs italic">{errors[field.name]}</p>}
        </div>
      );
    }

    return (
      <div key={field.name} className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.name}>
          {field.name}
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={field.name}
          type={field.type}
          name={field.name}
          placeholder={`Enter your ${field.name.toLowerCase()}`}
          onChange={handleChange}
          required
          value={formData[field.name] || ''}
        />
        {fieldCompleted && <p className="text-green-500 text-xs italic">Completed</p>}
        {errors[field.name] && <p className="text-red-500 text-xs italic">{errors[field.name]}</p>}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <progress className="w-full" max="100" value={progress}></progress>
          <p className="text-center text-xs mt-1">{progress}% completed</p>
        </div>

        <form onSubmit={handleSubmit}>
          {sections[activeSectionIndex].fields.map(renderField)}

          <div className="flex items-center justify-between mt-6">
            {activeSectionIndex > 0 && (
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setActiveSectionIndex(prevIndex => prevIndex - 1)}
              >
                Previous Section
              </button>
            )}
            {activeSectionIndex === sections.length - 1 ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setActiveSectionIndex(prevIndex => prevIndex + 1)}
              >
                Next Section
              </button>
            )}
          </div>
        </form>

        {isSubmitting && (
          <div className="flex justify-center items-center mt-4">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            </div>
            <span className="visually-hidden">Loading...</span>

          </div>
        )}

        {submitError && (
          <div className="text-center text-red-500 mt-4">
            {submitError}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => setSubmitError(null)}
            >
              Retry
            </button>
          </div>
        )}

        {submitSuccess === true && (
          <div className="text-center text-green-500 mt-4">
            Thank you for sending your information. Our managers will contact you soon.
          </div>
        )}

        {submitSuccess === false && !submitError && (
          <div className="text-center text-red-500 mt-4">
            Sorry, something went wrong. Please try again later.
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => setSubmitSuccess(null)}
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicForm;
