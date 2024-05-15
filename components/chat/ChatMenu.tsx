import React from 'react';
import { users } from './users';
import ChatMenuCard from './ChatMenuCard';
import { StaticImageData } from 'next/image';

export type UsersProps = {
  id: number;
  name: string;
  image: StaticImageData;
  message: string;
  time: string;
  status: boolean;
};
const ChatMenu = () => {
  return (
    <div>
      <input
        type="text"
        placeholder="search here"
        className="border-b border-gray-300 outline-none px-4"
      />
      <section className="border border-gray-200">
        {users.map((user: UsersProps) => (
          <ChatMenuCard user={user} />
        ))}
      </section>
    </div>
  );
};

export default ChatMenu;
