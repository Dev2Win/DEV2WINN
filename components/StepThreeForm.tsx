'use client'

import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Stepper from '@/components/Stepper';

 type CardType = 'mentor' | 'mentee';

 type FormTwo = {
  onNext : () => void;
  onPrevious: () => void;
  currentStep: number;
  complete: boolean;
  steps: string[];
}


function StepFourForm({onNext, onPrevious, currentStep, complete, steps} : FormTwo) {
    const [changeBorder, setChangeBorder] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  
    const handleBorderChange = (card: CardType) => {
      setChangeBorder(!changeBorder);
      setSelectedCard(card);
    };
  

  return (
    <section className="flex flex-col justify-center items-center h-screen max-w-md mx-auto">
      <h1 className="font-bold text-3xl mb-4">Dev2Win</h1>
       <div className='max-w-md'>
         <Stepper currentStep={currentStep} complete={complete} steps={steps}/>
       </div>
      <h1 className="my-8 font-semibold text-xl">Which user type do you prefer ?</h1>
      <div className="flex gap-4 my-3 w-[80%]">
        <div
          className={`flex flex-col border ${
            selectedCard === 'mentor'
              ? 'border-purple-1'
              : 'border-black/10'
          } px-4 py-2 rounded cursor-pointer hover:border-purple-1/60 shadow-sm w-[50%]`}
          onClick={() => handleBorderChange('mentor')}
        >
          <FaUser className={`${selectedCard === 'mentor' ? 'text-purple-1' : 'text-black'} mb-4`} />
          <h1 className="font-semibold">Mentor</h1>
          <p className="text-[14px]">Coach a mentee</p>
        </div>
        <div
          className={`flex flex-col border ${
            selectedCard === 'mentee'
              ? 'border-purple-1'
              : 'border-black/10'
          } px-4 py-2 rounded cursor-pointer hover:border-purple-1/60 shadow-sm w-[50%]`}
          onClick={() => handleBorderChange('mentee')}
        >
          <FaUser className={`${selectedCard === 'mentee' ? 'text-purple-1' : 'text-black'} mb-4`} />
          <h1 className="font-semibold">Mentee</h1>
          <p className="text-[14px]">Coach a mentee</p>
        </div>
       </div>
       <div className='flex justify-between items-center gap-8 w-[80%]'>
        <button 
          onClick={onPrevious} 
          className='bg-purple-1 px-4 py-2 rounded  text-white mt-5 hover:bg-dark-4 transition-all w-[50%]'>
            Previous
        </button>
        <button 
          onClick={onNext} 
          className='bg-purple-1 px-4 py-2 rounded  text-white mt-5 hover:bg-dark-4 transition-all w-[50%]'>
            Next
        </button>
      </div> </section>
  );
};

export default StepFourForm;
