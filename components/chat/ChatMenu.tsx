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

interface ChatMenuProps {
  onSelectUser: (user: UsersProps) => void;
  showChatbox: boolean;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ onSelectUser, showChatbox }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="search here"
        className="border-b border-gray-300 outline-none px-4"
      />
      <section className="border border-gray-200">
        {users.map((user: UsersProps) => (
          <ChatMenuCard key={user.id} user={user} onSelectUser={onSelectUser} />
        ))}
      </section>
    </div>
  );
};

export default ChatMenu;
