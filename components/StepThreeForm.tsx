'use client';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Stepper from './Stepper';

 type CardType = 'mentor' | 'mentee';

 type FormThree = {
  onNext : () => void;
  onPrevious: () => void;
  currentStep: number;
  complete: boolean;
  steps: string[];
}

function Page({onNext, onPrevious, currentStep, complete, steps} : FormThree) {
  const [changeBorder, setChangeBorder] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const handleBorderChange = (card: CardType) => {
    setChangeBorder(!changeBorder);
    setSelectedCard(card);
  };

  const handleContinue = async () => {
    if (selectedCard) {
      try {
        // Send API request with the selected card value
        const response = await fetch('api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userType: selectedCard }),
        });

        if (response.ok) {
         
          console.log('Card selected successfully:');
        } else {
        
          console.error('Error selecting card:');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
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
            selectedCard === 'mentor' ? 'border-purple-1' : 'border-black/20'
          } px-4 py-2 rounded cursor-pointer hover:border-purple-1/60 shadow-sm w-[50%]`}
          onClick={() => handleBorderChange('mentor')}
        >
          <FaUser className={`${selectedCard === 'mentor' ? 'text-purple-1' : 'text-black'} mb-4`} />
          <h1 className="font-semibold">Mentor</h1>
          <p className="text-[14px]">Coach a mentee</p>
        </div>
        <div
          className={`flex flex-col border ${
            selectedCard === 'mentee' ? 'border-purple-1' : 'border-black/20'
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
  );
};

export default Page;