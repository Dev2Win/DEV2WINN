'use client';

import React, { useState } from 'react';
import { FormValues } from '@/app/profile/mentor/page';
import Stepper from './Stepper';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

type FormOne = {
  onNext: () => void;
  formData: FormValues;
  handleFormChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
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
  options,
}: FormOne) {
  const animatedComponents = makeAnimated();

  return (
    <section className="mx-auto flex h-screen max-w-lg flex-col items-center justify-center lg:max-w-2xl 2xl:max-w-[1200px]">
      <h1 className="mb-4 text-3xl font-bold">Dev2Win</h1>
      <div className="max-w-md">
        <Stepper currentStep={currentStep} complete={complete} steps={steps} />
      </div>
      <h2 className="my-4 text-xl font-semibold">Personal Details</h2>
      <div className="w-[80%] 2xl:my-6">
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="eg Software developer"
          value={formData.title}
          onChange={handleFormChange}
          className="my-1 block w-full rounded-sm border border-gray-300 px-2 py-[7px] text-sm shadow-sm focus:outline-black/20"
          required
        />
      </div>
      <div className="my-1 w-[80%]">
        <label
          htmlFor="bio"
          className="block text-sm font-semibold text-gray-700"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          placeholder="why you are a good fit for a mentor"
          value={formData.bio}
          onChange={handleFormChange}
          rows={3}
          className="my-1 block w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:outline-black/20"
          required
        ></textarea>
      </div>

      <div className="my-1 w-[80%] 2xl:my-6">
        <label
          htmlFor="industry_pref"
          className="text-sm font-semibold text-gray-700"
        >
          Your Languages
        </label>

        <Select
          isMulti
          options={options}
          value={selectedOptions}
          onChange={handleSelectLang}
          components={animatedComponents}
          classNamePrefix="react-select"
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
          <option value="Weekdays">Male</option>
          <option value="Weekends">Female</option>
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
