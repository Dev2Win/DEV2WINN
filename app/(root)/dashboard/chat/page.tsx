'use client';
import React, { useState } from 'react';
import ChatMenu from '@/components/chat/ChatMenu';
import ChatboxHeader from '@/components/chat/ChatboxHeader';
import Input from '@/components/chat/Input';
import Message from '@/components/chat/Message';
import { UsersProps } from '@/components/chat/ChatMenu';

const Page = () => {
  const [selectedUser, setSelectedUser] = useState<UsersProps | null>(null);
  const [showChatbox, setShowChatbox] = useState(false);

  const handleSelectUser = (user: UsersProps) => {
    setSelectedUser(user);
  };

  return (
    <div className="2xl:mx-auto 2xl:max-w-[1400px] rounded-md">
      <div className="relative h-[78vh] bg-white shadow-md overflow-hidden">
        <h1 className="font-bold text-xl text-purple-1 px-4 py-2">Messages</h1>
        <div className="grid lg:grid-cols-12 gap-4 h-[90%] absolute left-0 right-0 ">
          <section className="overflow-y-scroll mb-4 scrollbar-hidden  lg:col-span-5 xl:col-span-4">
            <ChatMenu onSelectUser={handleSelectUser} showChatbox={showChatbox} />
          </section>
          <section className="hidden lg:block lg:col-span-7 border border-gray-200 rounded-md mb-4 relative xl:col-span-8">
            {selectedUser ? (
              <>
                <ChatboxHeader />
                <Input />
              </>
            ) : (
              <Message />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
