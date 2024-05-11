'use client';
import React, { useState } from 'react';

interface BackgroundProps {
  expertise: string[];
  disciplines: string[];
  industries: string[];
  fluentin: string[];
}

const Background: React.FC<BackgroundProps> = ({
  expertise,
  disciplines,
  industries,
  fluentin,
}) => {
  const [showExpertisePopdown, setShowExpertisePopdown] = useState(false);
  const [showDisciplinesPopdown, setShowDisciplinesPopdown] = useState(false);
  const [showIndustriesPopdown, setShowIndustriesPopdown] = useState(false);
  const [showFluentinPopdown, setShowFluentinPopdown] = useState(false);

  const showPopdown = (
    setPopdown: React.Dispatch<React.SetStateAction<boolean>>,
    popdownState: boolean,
  ) => {
    setPopdown(!popdownState);
  };

  const renderItems = (
    items: string[],
    setPopdown: React.Dispatch<React.SetStateAction<boolean>>,
    popdownState: boolean,
    section: string,
  ) => {
    const maxItemsToShow = 2;
    const visibleItems = items.slice(0, maxItemsToShow);
    const remainingItems = items.slice(maxItemsToShow);

    // Define different CSS classes based on the section
    const mainButtonClass =
      section === 'Expertise' ? 'bg-purple-1 text-white' : '';
    const largeButtonClass =
      section === 'Expertise' ? 'bg-red-300 text-white' : '';
    const secondButtonClass = section === 'Disciplines' ? 'border py-0 ' : '';

    const thirdButtonClass = section === 'Industries' ? 'border ' : '';

    const fourthButtonClass = section === 'Fluentin' ? 'border' : '';

    const popdownButtonClass = 'border ';

    return (
      <div className="flex flex-wrap items-center relative">
        <div className="sm:hidden inline-flex gap-x-2">
          <button
            className={` w-24 py-2 text-sm font-bold rounded-md text-black ${mainButtonClass} ${secondButtonClass} ${thirdButtonClass} ${fourthButtonClass} `}
          >
            {visibleItems[0]}
          </button>
          {remainingItems.length > 0 && (
            <button
              className={`rounded-md px-3 py-1 mr-2  cursor-pointer ${popdownButtonClass}`}
              onClick={() => showPopdown(setPopdown, popdownState)}
            >
              +{remainingItems.length}
            </button>
          )}
        </div>
        <div className="hidden sm:flex">
          <button
            className={` w-24 py-2 text-sm mr-2 font-bold rounded-md text-black ${mainButtonClass} ${secondButtonClass} ${thirdButtonClass} ${fourthButtonClass} `}
          >
            {visibleItems[0]}
          </button>
          {visibleItems.length > 1 && (
            <button
              className={` w-24 mr-2 py-2 text-sm font-bold rounded-md text-black ${largeButtonClass} ${secondButtonClass} ${thirdButtonClass} ${fourthButtonClass} `}
            >
              {visibleItems[1]}
            </button>
          )}
          {remainingItems.length > 0 && (
            <button
              className={`rounded-md px-3  mr-2  cursor-pointer ${popdownButtonClass}`}
              onClick={() => showPopdown(setPopdown, popdownState)}
            >
              +{remainingItems.length}
            </button>
          )}
        </div>
        {popdownState && (
          <div className="absolute z-10 bg-white rounded-md shadow-lg p-4 top-8 left-0">
            {remainingItems.map((item, index) => (
              <button key={index} className="block mb-2">
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 mt-8 border flex  w-full lg:w-8/12  flex-col rounded-lg gap-y-6 px-4 py-8">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-2">Expertise</h3>
        {renderItems(
          expertise,
          setShowExpertisePopdown,
          showExpertisePopdown,
          'Expertise',
        )}
      </div>
      <hr className="mx-2"></hr>
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-2">Disciplines</h3>
        {renderItems(
          disciplines,
          setShowDisciplinesPopdown,
          showDisciplinesPopdown,
          'Disciplines',
        )}
      </div>
      <hr className="mx-2"></hr>
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-2">Industries</h3>
        {renderItems(
          industries,
          setShowIndustriesPopdown,
          showIndustriesPopdown,
          'Industries',
        )}
      </div>
      <hr className="mx-2"></hr>
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold mb-2">Fluent in</h3>
        {renderItems(
          fluentin,
          setShowFluentinPopdown,
          showFluentinPopdown,
          'Fluentin',
        )}
      </div>
    </div>
  );
};

export default Background;
