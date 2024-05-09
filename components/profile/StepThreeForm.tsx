'use client'

import { FormValues } from '@/app/profile/mentor/page';
import Stepper from './Stepper'


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
          <label htmlFor="education" className='font-semibold text-gray-700 text-sm'>Level of Education</label>
          <select
            id="education"
            name="education"
            value={formData.education}
            onChange={handleFormChange}
            className='my-1 px-2 py-1 text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20'
            required
          >
            <option value="" className='text-gray-400'>Level of Education</option>
            <option value="diploma">Diploma</option>
            <option value="degree">Degree</option>
            <option value="masters">Master's level</option>
          </select>
         </div>
        
         <div className='w-[80%] my-1'>
          <label htmlFor="careerChoice" className='font-semibold text-gray-700 text-sm'>Career Choice</label>
          <select
            id="careerChoice"
            name="careerChoice"
            value={formData.careerChoice}
            onChange={handleFormChange}
            className='my-1 px-2 py-1 text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20'
            required
          >
            <option value="" className='text-gray-400'>Career Choice</option>
            <option value="business">Business</option>
            <option value="technology">Technology</option>
            <option value="entrepreneurship">Entrepreneurship</option>
          </select>
         </div>

         <div className='w-[80%] my-1'>
          <label htmlFor="experience" className='font-semibold text-gray-700 text-sm'>Level of Experience</label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleFormChange}
            className='my-1 px-2 py-1 text-sm text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20'
            required
          >
            <option value="" className='text-gray-400'>Level of Experience</option>
            <option value="novice">Novice</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
         </div>

         <div className='w-[80%] my-1'>
          <label htmlFor="review" className='font-semibold text-gray-700 text-sm'>Reviews from Mentor</label>
          <textarea
            id="review"
            name="review"
            placeholder='Reviews from mentor'
            value={formData.review}
            onChange={handleFormChange}
            rows={3}
            className="my-1 px-2 py-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-black/20"
            required
          ></textarea>
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
