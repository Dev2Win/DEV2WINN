'use client';

import React from 'react';
import { FormValues } from '@/app/profile/mentor/page';
import Stepper from './Stepper';
import Select from 'react-select';

type FormOne = {
  onNext: () => void;
  formData: FormValues;
  handleFormChange: (e: React.ChangeEvent< HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  currentStep: number;
  complete: boolean;
  steps: string[];
  options: any[];
  selectedOptions: any;
  handleSelect: any;
  handleSelectLang: any;
};

function StepOneMentor({
  onNext,
  formData,
  handleFormChange,
  currentStep,
  complete,
  steps,
  selectedOptions,
  handleSelect,
  handleSelectLang,
  options
}: FormOne) {

 
  return (
    <section className="flex flex-col justify-center items-center h-screen max-w-lg mx-auto">
      <h1 className="font-bold text-3xl mb-4">Dev2Win</h1>
      <div className="max-w-md">
        <Stepper currentStep={currentStep} complete={complete} steps={steps} />
      </div>
      <h2 className="text-xl font-semibold my-4">Tell us about yourself</h2>
      <div className="w-[80%]">
        <label
          htmlFor="title"
          className="block text-sm text-gray-700 font-semibold"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleFormChange}
          className="my-1 px-2 py-1 block w-full border border-gray-300 rounded-sm shadow-sm focus:outline-black/20"
          required
        />
      </div>
      <div className="w-[80%] my-1">
        <label
          htmlFor="bio"
          className="block text-sm text-gray-700 font-semibold"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Tell us about yourself"
          value={formData.bio}
          onChange={handleFormChange}
          rows={3}
          className="my-1 px-2 py-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20"
          required
        ></textarea>
      </div>

      <div className="w-[80%] my-1">
        <label
          htmlFor="industry_pref"
          className="font-semibold text-gray-700 text-sm"
        >
         Your Languages 
        </label>
       
        <Select
          isMulti
          options={options}
          value={selectedOptions}
          onChange={handleSelectLang}
          placeholder="Select options..."
        />
      </div>

      <div className='w-[80%] my-1'>
          <label htmlFor="gender" className='font-semibold text-gray-700 text-sm'>Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleFormChange}
            className='my-1 px-2 py-1 text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20'
            required
          >
            <option value="" className='text-gray-400'>Select Gender</option>
            <option value="Weekdays">Male</option>
            <option value="Weekends">Female</option>
        
          </select>
         </div>
      <button
        onClick={onNext}
        className="bg-purple-1 px-4 py-2 rounded w-[80%] text-white mt-5 hover:bg-dark-4 transition-all"
      >
        Next
      </button>
    </section>
  );
}

export default StepOneMentor;
