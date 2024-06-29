'use client';

import { FormValues } from '@/app/profile/mentor/page';
import Stepper from './Stepper';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import React from 'react';


type FormTwo = {
  onNext: () => void;
  onPrevious: () => void;
  formData: FormValues;
  currentStep: number;
  complete: boolean;
  steps: string[];
  handleFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  selectedExpertise: any;
  handleIndustry:any;
  selectedIndustry:any;
  handleExpertise: any;
  options: any;
  handleSelect:any;
  selectedOptions:any;
  expertiseOptions : any[]
  IndustryOptions: any[]
};

function StepTwoForm({
  onNext,
  onPrevious,
  formData,
  handleFormChange,
  steps,
  currentStep,
  complete,
  options,
  selectedOptions,
  handleSelect,
  selectedExpertise,
  handleExpertise,
  handleIndustry,selectedIndustry,
  expertiseOptions,
  IndustryOptions

}: FormTwo) {

  const animatedComponents = makeAnimated();


 
  return (
    <section className="flex flex-col justify-center items-center h-screen max-w-lg mx-auto lg:max-w-2xl 2xl:max-w-[1200px]">
      <h1 className="font-bold text-3xl mb-4">Dev2Win</h1>
      <div className="max-w-md">
        <Stepper currentStep={currentStep} complete={complete} steps={steps} />
      </div>
      <h2 className="text-xl font-semibold my-6">Career Path</h2>

      {/* <div className="w-[80%] my-1">
        <label
          htmlFor="expertise"
          className="font-semibold text-gray-700 text-sm"
        >
          Area of Expertise
        </label>
        <Select
          isMulti
          options={expertiseOptions}
          value={selectedExpertise}
          onChange={handleExpertise}
          placeholder="Select options..."
        />
      </div> */}
        <div className="w-[80%] my-1">
        <label
          htmlFor="industry_pref"
          className="font-semibold text-gray-700 text-sm"
        >
         Career Preferences
        </label>
       
        <Select
          isMulti
          options={options}
          value={selectedOptions}
          onChange={handleSelect}
          components={animatedComponents}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: 'primary75',
              primary: 'neutral50',
            },
          })}
          placeholder="Select options..."
        />
      </div>
      <div className="w-[80%] my-1  2xl:my-6">
        <label
          htmlFor="expertise"
          className="font-semibold text-gray-700 text-sm"
        >
          Industries of interest
        </label>
        <Select
          isMulti
          options={IndustryOptions}
          components={animatedComponents}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: 'primary75',
              primary: 'neutral50',
            },
          })}
          value={selectedIndustry}
          onChange={handleIndustry}
          placeholder="Select options..."
        />
      </div>

      <div className="w-[80%] my-3">
        <label
          htmlFor="experience_level"
          className="font-semibold text-gray-700 text-sm"
        >
          Level of experience
        </label>
        <select
          id="experience_level"
          name="experience_level"
          value={formData.experience_level}
          onChange={handleFormChange}
          className="my-1 px-2 py-[10px] text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20"
          required
        >
          <option value="" className="text-gray-400">
            Level of Experience
          </option>
          <option value="novice">Novice</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div className="w-[80%] my-2">
        <label
          htmlFor="experience_level"
          className="font-semibold text-gray-700 text-sm"
        >
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
         
          <option value="novice">weekdays</option>
          <option value="intermediate">Weekends</option>
          <option value="expert">Everyday</option>
        </select>
      </div>

      <div className="flex justify-between items-center gap-8 w-[80%]">
        <button
          onClick={onPrevious}
          className="bg-purple-1 px-4 py-2 rounded w-[50%] text-white mt-5 hover:bg-dark-4 transition-all"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="bg-purple-1 py-2 rounded  w-[50%] text-white mt-5 hover:bg-dark-4 transition-all"
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default StepTwoForm;
