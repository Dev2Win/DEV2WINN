import React from 'react';
import Image from 'next/image';
import {UsersProps} from './ChatMenu'

type CardProps = {
  user: UsersProps
}

const ChatMenuCard = ({user} : CardProps) => {
  return (
    <div
      key={user.name}
      className="flex gap-1 py-2 px-4 border-b border-gray-200 cursor-pointer hover:bg-purple-1 hover:text-white rounded-sm transition-all"
    >
      
      <div className="flex items-start">
        <Image
          src={user.image}
          width={50}
          height={50}
          alt={`${user.name}`}
          className="rounded-full"
        />
       
      </div>
      <div>
        <div className="flex justify-between items-center gap-3">
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-sm">{user.time}</p>
        </div>
        <p className='text-sm'>{user.message.substring(0, 20)}...</p>
      </div>
    </div>
  )
};

export default ChatMenuCard;
