
import React, { useState } from 'react';

const Speedometer = ({ value }: any) => {
  // const needleRotation = (value / 10) * 180;
  const [selectedOption, setSelectedOption] = useState('daily');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <section className="flex flex-col rounded-xl border border-gray-300 p-4">
      <div className="flex justify-between gap-4">
        <article className="flex items-center gap-2">
          <div className="size-4 rounded-[4px] bg-gray-500"></div>
          <small className='font-semibold'>Point progress</small>
        </article>

        <select
          id="frequency"
          value={selectedOption}
          onChange={handleChange}
          className="rounded-sm border bg-black/15 px-2 py-1 font-semibold focus:outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      {/* <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="absolute top-0 left-0 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="50%"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="12"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#a5b4fc"
            strokeWidth="12"
          />
          <path
            d="M 180 100 A 80 80 0 0 1 240 100"
            fill="none"
            stroke="#fde68a"
            strokeWidth="12"
          />
        </svg>
        <div
          className="absolute w-2 h-24 bg-orange-500 transform origin-bottom transition-transform"
          style={{ transform: `rotate(${needleRotation}deg)` }}
        ></div>
        <div className="absolute w-4 h-4 bg-orange-500 rounded-full"></div>
      </div> */}
      <p className="mt-4 text-gray-600">
        Your Point: <span className="font-bold text-black">{value}</span>
      </p>
    </section>
  );
};

export default Speedometer;
