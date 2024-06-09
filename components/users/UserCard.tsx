import Image from 'next/image';
import React from 'react';

const UserCard = ({ data}:any) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <Image src={data.image} alt={data.name} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold">{data.name}</h3>
        <p className="mb-2 text-gray-600 text-[1rem] font-normal">{data.title}</p>
        <p className="mb-4 text-gray-500">{data.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
           <p  className=' text-[13px] text-gray-400'>Experience</p> 
           <p className='  font-bold'> {data.experience} year{data.experience !== 1 ? 's' : ''}</p>
          </span>
          <button
              className="bg-purple-1/40 p-[7px] text-white rounded-lg   "
             
            >
              Connect
            </button>
           </div>
      </div>
    </div>
  );
};

export default UserCard;