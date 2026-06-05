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
      <div className="relative flex flex-wrap items-center">
        <div className="inline-flex gap-x-2 sm:hidden">
          <button
            className={` w-24 rounded-md py-2 text-sm font-bold text-black ${mainButtonClass} ${secondButtonClass} ${thirdButtonClass} ${fourthButtonClass} `}
          >
            {visibleItems[0]}
          </button>
          {remainingItems.length > 0 && (
            <button
              className={`mr-2 cursor-pointer rounded-md px-3  py-1 ${popdownButtonClass}`}
              onClick={() => showPopdown(setPopdown, popdownState)}
            >
              +{remainingItems.length}
            </button>
          )}
        </div>
        <div className="hidden sm:flex">
          <button
            className={` mr-2 w-24 rounded-md py-2 text-sm font-bold text-black ${mainButtonClass} ${secondButtonClass} ${thirdButtonClass} ${fourthButtonClass} `}
          >
            {visibleItems[0]}
          </button>
          {visibleItems.length > 1 && (
            <button
              className={` mr-2 w-24 rounded-md py-2 text-sm font-bold text-black ${largeButtonClass} ${secondButtonClass} ${thirdButtonClass} ${fourthButtonClass} `}
            >
              {visibleItems[1]}
            </button>
          )}
          {remainingItems.length > 0 && (
            <button
              className={`mr-2 cursor-pointer  rounded-md  px-3 ${popdownButtonClass}`}
              onClick={() => showPopdown(setPopdown, popdownState)}
            >
              +{remainingItems.length}
            </button>
          )}
        </div>
        {popdownState && (
          <div className="absolute left-0 top-8 z-10 rounded-md bg-white p-4 shadow-lg">
            {remainingItems.map((item, index) => (
              <button key={index} className="mb-2 block">
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8 flex w-full flex-col  gap-y-6 rounded-lg  border p-4 px-4 py-8 lg:w-8/12">
      <div className="flex justify-between">
        <h3 className="mb-2 text-lg font-semibold">Expertise</h3>
        {renderItems(
          expertise,
          setShowExpertisePopdown,
          showExpertisePopdown,
          'Expertise',
        )}
      </div>
      <hr className="mx-2"></hr>
      <div className="flex justify-between">
        <h3 className="mb-2 text-lg font-semibold">Disciplines</h3>
        {renderItems(
          disciplines,
          setShowDisciplinesPopdown,
          showDisciplinesPopdown,
          'Disciplines',
        )}
      </div>
      <hr className="mx-2"></hr>
      <div className="flex justify-between">
        <h3 className="mb-2 text-lg font-semibold">Industries</h3>
        {renderItems(
          industries,
          setShowIndustriesPopdown,
          showIndustriesPopdown,
          'Industries',
        )}
      </div>
      <hr className="mx-2"></hr>
      <div className="flex justify-between">
        <h3 className="mb-2 text-lg font-semibold">Fluent in</h3>
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
