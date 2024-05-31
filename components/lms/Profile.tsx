import React from 'react';
import Image from 'next/image';
import { BiSolidCheckShield } from 'react-icons/bi';

const avatar = '/images/avatar-1.jpeg';

const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="progress-circle">
        <Image
          src={avatar}
          alt="user"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>
      <div className="flex gap-2 items-center text-gray-800 my-3">
        <h1 className="text-xl font-bold">Simon Agyei</h1>
        <BiSolidCheckShield size={23} />
      </div>
      <p className="text-lg font-semibold">College Student</p>
    </div>
  );
};

export default Profile;
