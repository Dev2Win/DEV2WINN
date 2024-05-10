import React from 'react'
import Stepper from './Stepper'
import { IoCheckmarkOutline } from "react-icons/io5";
;



type FormTwo = {
  onSubmit: () => void;
  onPrevious: () => void;
  currentStep: number;
  complete: boolean;
  steps: string[];
}


function StepFourForm({onSubmit, onPrevious, currentStep, complete, steps} : FormTwo) {
  return (
    <div className='flex flex-col justify-center items-center h-screen max-w-md sm:mx-auto '>
      <h1>User name</h1>
      <div className='max-w-md mt-4'>
         <Stepper currentStep={currentStep} complete={complete} steps={steps}/>
       </div>      
        <div className='my-6 bg-purple-1 rounded-full p-3'>
          <IoCheckmarkOutline size={25} className='text-white'/>
        </div>
       <h1 className='text-2xl sm:text-3xl font-bold my-3'>Congratulations!</h1>
      <p className='text-gray-500 text-sm sm:text-md'>You have finish your onboarding stage</p>
      <div className='flex justify-between gap-6 w-[80%]'>
        <button 
          onClick={onPrevious} 
          className='bg-purple-1 px-4 py-2 rounded  text-white mt-5 hover:bg-dark-4 transition-all w-[50%]'>
            previous
        </button>
        <button 
        onClick={onSubmit}
           
           className='bg-purple-1 px-4 py-2 rounded  text-white mt-5 hover:bg-dark-4 transition-all w-[50%]'>
            finish
        </button>
      </div>
    </div>
  )
}

export default StepFourForm