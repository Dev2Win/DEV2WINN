import React, { useState } from 'react';
import ChatMenuCard from './ChatMenuCard';
import { StaticImageData } from 'next/image';

type userDetailsProps = {
  firstName: string
}

export type UsersProps = {
  id: number;
  name: string;
  image: StaticImageData;
  message: string;
  time: string;
  status: boolean;
  userDetails: userDetailsProps
};

interface ChatMenuProps {
  onSelectUser: (user: UsersProps) => void;
  showChatbox: boolean;
  users: UsersProps[];
  setShowChatbox: React.Dispatch<React.SetStateAction<boolean>>;
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatMenu = ({
  onSelectUser,
  users,
  setShowChatbox,
  showChatbox,
  setClose,
}: ChatMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = searchQuery
    ? users?.filter((user) =>
        user?.userDetails?.firstName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
    : users;

  return (
    <div className="mt-8">
      <input
        type="text"
        placeholder="search here"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full border-b border-gray-300 px-4 outline-none"
      />
      <section className="border-b border-gray-200">
        {filteredUsers.map((user: UsersProps) => (
          <ChatMenuCard
            key={user.id}
            user={user}
            onSelectUser={onSelectUser}
            setShowChatbox={setShowChatbox}
            showChatbox={showChatbox}
            setClose={setClose}
          />
        ))}
      </section>
    </div>
  );
};

export default ChatMenu;
