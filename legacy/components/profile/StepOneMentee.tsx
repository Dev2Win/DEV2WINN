'use client';

import React from 'react';
import { FormValues } from '@/app/profile/mentee/page';
import Stepper from './Stepper';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Industry, careerPrefOptions } from '@/app/profile/data';

type FormOne = {
  onNext: () => void;
  formData: FormValues;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  currentStep: number;
  complete: boolean;
  steps: string[];
  selectedOptions: any;
  handleIndustrySelect: any;
};

function StepOneForm({
  onNext,
  formData,
  handleFormChange,
  currentStep,
  complete,
  steps,
  selectedOptions,
  handleIndustrySelect,
}: FormOne) {

  const animatedComponents = makeAnimated();

  return (
    <section className="flex flex-col justify-center items-center h-screen max-w-lg lg:max-w-2xl 2xl:max-w-[1200px] mx-auto p-6">
      <h1 className="font-bold text-4xl text-gray-800 mb-6">Dev2Win</h1>
      <div className="max-w-md mb-6">
        <Stepper currentStep={currentStep} complete={complete} steps={steps} />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 my-4">Personal Details</h2>

      <div className="w-full max-w-md mb-6">
        <label htmlFor="first_job_description" className="block text-sm font-semibold text-gray-700 mb-2">
          Describe your first job of interest after this session
        </label>
        <textarea
          id="first_job_description"
          name="first_job_description"
          placeholder="Share your thoughts on your ideal first role"
          value={formData.first_job_description}
          onChange={handleFormChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-300 focus:outline-none text-sm text-gray-700"
          required
        ></textarea>
      </div>

      <div className="w-full max-w-md mb-6">
        <label htmlFor="industry_pref" className="block text-sm font-semibold text-gray-700 mb-2">
          Industry of interest
        </label>
        <Select
          isMulti
          options={Industry}
          value={selectedOptions}
          onChange={handleIndustrySelect}
          components={animatedComponents}
          theme={(theme) => ({
            ...theme,
            borderRadius: 4,
            colors: {
              ...theme.colors,
              primary25: '#f3f4f6', // Light background for option hover
              primary: '#6b7280', // Text color for selected options
            },
          })}
          placeholder="Select the industry you're interested in"
          className="react-select-container"
        />
      </div>

      <div className="w-full max-w-md mb-6">
        <label htmlFor="career_path" className="block text-sm font-semibold text-gray-700 mb-2">
          Career Path
        </label>
        <select
          id="career_path"
          name="career_path"
          value={formData.career_path}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-300 focus:outline-none text-sm text-gray-700"
        >
          <option value="" className="text-gray-400">Choose a career path</option>
          {careerPrefOptions.map((item) => (
            <option key={item.label} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      <div className="w-full max-w-md mb-6">
        <label htmlFor="availability" className="block text-sm font-semibold text-gray-700 mb-2">
          Availability
        </label>
        <select
          id="availability"
          name="availability"
          value={formData.availability}
          onChange={handleFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-300 focus:outline-none text-sm text-gray-700"
          required
        >
          <option value="" className="text-gray-400">Select availability</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
          <option value="Everyday">Everyday</option>
        </select>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-md bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md mt-4 transition-all duration-300"
      >
        Next
      </button>
    </section>
  );
}

export default StepOneForm;
