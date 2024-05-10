'use client';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';


 type CardType = 'mentor' | 'mentee';


function Page() {
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
       </div>
      <h1 className="my-8 font-semibold sm:text-xl">Which user type do you prefer ?</h1>
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
      
      {selectedCard && (
         <Link href={`/profile/${selectedCard}`}
             onClick={handleContinue}
             className='bg-purple-1 py-2 rounded text-center w-[80%] text-white mt-5 hover:bg-dark-4 transition-all'>
            Continue
        </Link>
      )}
      
    </section>
  );
};

export default Page;