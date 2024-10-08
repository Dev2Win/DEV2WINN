'use client';

import React from 'react';
import { FormValues } from '@/app/profile/mentee/page';
import Stepper from './Stepper';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';



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
  
};

function StepOneForm({
  onNext,
  formData,
  handleFormChange,
  currentStep,
  complete,
  steps,
  selectedOptions,
  handleSelect,
  options
}: FormOne) {

  const animatedComponents = makeAnimated();


  return (
    <section className="flex flex-col justify-center items-center h-screen max-w-lg lg:max-w-2xl 2xl:max-w-[1200px]  mx-auto">
      <h1 className="font-bold text-3xl mb-4">Dev2Win</h1>
      <div className="max-w-md">
        <Stepper currentStep={currentStep} complete={complete} steps={steps} />
      </div>
      <h2 className="text-xl font-semibold my-4">Personal Detail</h2>
     
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

      <div className="w-[80%] my-1 lg:my-6">
        <label
          htmlFor="industry_pref"
          className="font-semibold text-gray-700 text-sm"
        >
          Industry of interest
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

      <div className='w-[80%] my-1'>
          <label htmlFor="availability" className='font-semibold text-gray-700 text-sm'>Availability</label>
          <select
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleFormChange}
            className='my-1 px-2 py-[10px] text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20'
            required
          >
            <option value="" className='text-gray-400'>Select availability</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Everyday">Everyday</option>
          </select>
         </div>
      <button
        onClick={onNext}
        className="bg-purple-1 px-4 py-2 rounded w-[80%] text-white mt-5 hover:bg-dark-4 transition-all duration-300"
      >
        Next
      </button>
    </section>
  );
}

export default StepOneForm;
