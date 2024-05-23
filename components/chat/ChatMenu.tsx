import React from 'react';
// import { users } from './users';
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
  users:any;
  setShowChatbox: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatMenu = ({ onSelectUser, users, setShowChatbox, showChatbox }: ChatMenuProps) => {
  return (
    <div className="mt-8">
      <input
        type="text"
        placeholder="search here"
        className="border-b border-gray-300 outline-none px-4 w-full"
      />
      <section className="border-b border-gray-200">
        {users?.map((user: UsersProps) => (
          <ChatMenuCard
            key={user.id}
            user={user}
            onSelectUser={onSelectUser}
            setShowChatbox={setShowChatbox}
            showChatbox={showChatbox}
          />
        ))}
      </section>
    </div>
  );
};

export default ChatMenu;
