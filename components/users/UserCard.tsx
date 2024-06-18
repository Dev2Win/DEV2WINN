'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import image from '../../public/images/aboutImage.webp';
import { useUser } from '@clerk/nextjs';

const UserCard = ({ data }: any) => {
  const { user } = useUser();
  const [checkConnection,setCheckConnection]= useState([])
  const handleConnect = async () => {
    try {
      const response:any = await fetch(`https://dev-2-winn.vercel.app/api/users/mentor/${data?._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // The specific data you want to update
          connections: [user?.publicMetadata?.userId], 
        }),
      });

      if (response?.message === 'SUCCESS') {
        setCheckConnection(response)
      }

      const result = await response.json();
      console.log('Update successful:', result);
    } catch (error) {
      console.error('Error updating mentor:', error);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <Image src={image} alt={data.name} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold">{data?.userId?.firstName}</h3>
        <p className="mb-2 text-gray-600 text-[1rem] font-normal">{data?.email}</p>
        <p className="mb-4 text-gray-500">{data?.email}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            <p className='text-[13px] text-gray-400'>Experience</p>
            <p className='font-bold'>{data?.experience_level} year{data.experience_level !== 1 ? 's' : ''}</p>
          </span>
          <button
            className="bg-purple-1/40 p-[7px] text-white rounded-lg"
            onClick={handleConnect}
          >
            { checkConnection ? 'connected' : 'connect'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
