'use client';

import React from 'react';
import { FormValues } from '@/app/profile/mentor/page';
import Stepper from './Stepper';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import { Industry, languages } from '@/app/profile/data';

type FormOne = {
  onNext: () => void;
  formData: FormValues;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  currentStep: number;
  complete: boolean;
  steps: string[];
  selectedIndustries: any;
  selectedLanguages: any;
  handleSelectIndustries: any;
  handleSelectLanguages: any;
};

function StepOneMentor({
  onNext,
  formData,
  handleFormChange,
  currentStep,
  complete,
  steps,
  selectedIndustries,
  selectedLanguages,
  handleSelectIndustries,
  handleSelectLanguages,
}: FormOne) {
  const animatedComponents = makeAnimated();

  return (
    <section className="mx-auto flex h-screen max-w-lg flex-col items-center justify-center lg:max-w-2xl 2xl:max-w-[1200px]">
      <h1 className="mb-4 text-3xl font-bold">Dev2Win</h1>
      <div className="max-w-md">
        <Stepper currentStep={currentStep} complete={complete} steps={steps} />
      </div>
      
      {/* CV Upload */}
      <div className="w-[80%] my-4">
        <label htmlFor="cv" className="block text-sm font-semibold text-gray-700">
          Upload CV
        </label>
        <input
          type="file"
          id="cv"
          name="cv"
          onChange={handleFormChange}
          className="my-1 block w-full rounded-sm border border-gray-300 px-2 py-1 text-sm shadow-sm focus:outline-black/20"
          accept=".pdf,.doc,.docx"
        />
      </div>

      {/* Industries */}
      <div className="my-1 w-[80%] 2xl:my-6">
        <label htmlFor="industries" className="text-sm font-semibold text-gray-700">
          Industries
        </label>
        <Select
          isMulti
          options={Industry}
          value={selectedIndustries}
          onChange={handleSelectIndustries}
          components={animatedComponents}
          classNamePrefix="react-select"
          placeholder="Select industries..."
        />
      </div>

      {/* Languages */}
      <div className="my-1 w-[80%] 2xl:my-6">
        <label htmlFor="languages" className="text-sm font-semibold text-gray-700">
          Your Languages
        </label>
        <Select
          isMulti
          options={languages}
          value={selectedLanguages}
          onChange={handleSelectLanguages}
          components={animatedComponents}
          classNamePrefix="react-select"
          placeholder="Select languages..."
        />
      </div>

      {/* Gender */}
      <div className="my-1 w-[80%]">
        <label htmlFor="gender" className="text-sm font-semibold text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleFormChange}
          className="my-1 block w-full rounded-md border border-gray-300 px-2 py-2 text-sm text-gray-700 shadow-sm focus:outline-black/20"
          required
        >
          <option value="" className="text-gray-400">
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Availability */}
      <div className="w-[80%] my-2">
        <label htmlFor="availability" className="font-semibold text-gray-700 text-sm">
          Availability
        </label>
        <select
          id="availability"
          name="availability"
          value={formData.availability}
          onChange={handleFormChange}
          className="my-1 px-2 py-[10px] text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20"
          required
        >
          <option value="" className="text-gray-400">Select Availability</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
          <option value="Everyday">Everyday</option>
        </select>
      </div>

      <button
        onClick={onNext}
        className="mt-5 w-[80%] rounded bg-purple-1 px-4 py-2 text-white transition-all duration-300 hover:bg-dark-4"
      >
        Next
      </button>
    </section>
  );
}

export default StepOneMentor;
