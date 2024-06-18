'use client'

import React from 'react';
import { FormValues } from '@/app/profile/mentee/page';
import Stepper from './Stepper'
import { careerPrefOptions } from '@/app/profile/data';


type FormTwo = {
  onNext : () => void;
  onPrevious: () => void;
  formData: FormValues;
  currentStep: number;
  complete: boolean;
  steps: string[];
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement  | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

function StepThreeForm({onNext, onPrevious, formData, handleFormChange, steps, currentStep, complete} : FormTwo) {

  return (
    <section className='flex flex-col justify-center items-center h-screen max-w-lg mx-auto'>
      <h1 className="font-bold text-3xl mb-4">Dev2Win</h1>
      <div className='max-w-md'>
         <Stepper currentStep={currentStep} complete={complete} steps={steps}/>
       </div>
      <h2 className='text-xl font-semibold my-6'>Career and Education</h2>

        <div className='w-[80%] my-1'>
          <label htmlFor="education_status" className='font-semibold text-gray-700 text-sm'>Level of Education</label>
          <select
            id="education_status"
            name="education_status"
            value={formData.education_status}
            onChange={handleFormChange}
            className='my-1 px-2 py-1 text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20'
            required
          >
            <option value="" className='text-gray-400'>Level of Education</option>
            <option value="high school diploma">High school diploma</option>
            <option value="degree">Degree</option>
            <option value="masters"> Masters</option>
            <option value="masters">Phd</option>

          </select>
         </div>
        
         <div className='w-[80%] my-1'>
          <label htmlFor="career_path" className='font-semibold text-gray-700 text-sm'>Career Path</label>
          <select
            id="career_path"
            name="career_path"
            value={formData.career_path}
            onChange={handleFormChange}
            className='my-1 px-2 py-1 text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20'
          >
            <option value="" className='text-gray-400'>Career Path</option>
            {
              careerPrefOptions.map((item)=>(
                <option key={item.label} value={item.value}>{item.label}</option>
              ))
            }
            
          </select>
         </div>

         <div className='w-[80%] my-1'>
          <label htmlFor="experience_level" className='font-semibold text-gray-700 text-sm'>Level of Experience</label>
          <select
            id="experience_level"
            name="experience_level"
            value={formData.experience_level}
            onChange={handleFormChange}
            className='my-1 px-2 py-1 text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20'
          >
            <option value="" className='text-gray-400'>Level of experience</option>
            <option value="novice">Novice</option>
            <option value="experienced ">Experienced </option>
            <option value="professional">Professional</option>
          </select>
         </div>

         <div className='flex justify-between items-center gap-8 w-[80%]'>
           <button 
             onClick={onPrevious} 
             className='bg-purple-1 px-4 py-2 rounded w-[50%] text-white mt-5 hover:bg-dark-4 transition-all'
           >
            Previous
          </button>
         <button 
          onClick={onNext} 
          className='bg-purple-1 py-2 rounded  w-[50%] text-white mt-5 hover:bg-dark-4 transition-all'
         >
          Next
        </button>
      </div>
    </section>
  )
}

export default StepThreeForm
