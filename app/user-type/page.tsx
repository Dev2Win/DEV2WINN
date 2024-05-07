'use client'

import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';


type CardType = 'mentor' | 'mentee';

const Page = () => {
    const [changeBorder, setChangeBorder] = useState(false);
    const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  
    const handleBorderChange = (card: CardType) => {
      setChangeBorder(!changeBorder);
      setSelectedCard(card);
    };
  

  return (
    <section className="flex flex-col justify-center items-center h-screen max-w-md mx-auto">
      <h1 className="font-bold text-3xl mb-4">Dev2Win</h1>
      {/* <Stepper/> */}
      <h1 className="my-8 font-semibold text-xl">Which user type do you prefer ?</h1>
      <div className="flex gap-4 my-3">
        <div
          className={`flex flex-col border ${
            selectedCard === 'mentor'
              ? 'border-purple-1'
              : 'border-black/10'
          } px-4 py-2 rounded cursor-pointer hover:border-purple-1/60 shadow-sm`}
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
          } px-4 py-2 rounded cursor-pointer hover:border-purple-1/60 shadow-sm`}
          onClick={() => handleBorderChange('mentee')}
        >
          <FaUser className={`${selectedCard === 'mentee' ? 'text-purple-1' : 'text-black'} mb-4`} />
          <h1 className="font-semibold">Mentee</h1>
          <p className="text-[14px]">Coach a mentee</p>
        </div>
      </div>
      <button className="bg-purple-1 px-4 py-2 rounded w-[80%] text-white mt-5">Continue</button>
    </section>
  );
};

export default Page;
