/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable object-shorthand */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import Message from '@/components/chat/Message';
import ChatboxHeader from '@/components/chat/ChatboxHeader';
import Input from '@/components/chat/Input';
import ChatMenu from '@/components/chat/ChatMenu';
import io from 'socket.io-client';
import moment from 'moment';
import { useUser } from '@clerk/clerk-react';
import ChatMenuCard from './ChatMenuCard';
import { BiCheckDouble } from 'react-icons/bi';
import { LuCheck, LuPlus } from 'react-icons/lu';
import Image from 'next/image';
import GeneralModal from '../reusables/GeneralModal';

const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL! || "http://localhost:3001"
// const ALL_USERS = process.env.ALL_USERS || "http://localhost:3001/api/users"

const ChatRender = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showChatbox, setShowChatbox] = useState(true);
  const [allUsers, setAllUsers] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [users , setUsers] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const currentMessage = useRef<any>(null);
  const toggleShowWindow = () => {
    setShowChatbox(!showChatbox);
  };

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL, {
      auth: { token: user?.publicMetadata?.userId },
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log(`Connected to server ${socketInstance.id}`);
    });

    // for sending  i of  the current user to fetch users he  established a conversatiom with
    socketInstance.emit('sidebar', user?.publicMetadata?.userId);
    // indicating seen messages
    socketInstance.emit('seen', selectedUser?._id);
    // fetches data for a particular conversation
    socketInstance.on('message', (data) => {
      console.log(data);
      setMessages(data);
    });
    // socket for a selected user data for messaging
    socketInstance.on('message-user', (data) => {
      console.log(data, 'selected user');
      setSelectedUser(data);
    });

    socketInstance.on('conversation', (data) => {
      console.log('conversation', data);
      // all users you have set up communication with
      const conversationUserData = data.map(
        (conversationUser: any, index: any) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (
            conversationUser?.receiver?._id !== user?.publicMetadata?.userId
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        },
      );
      setAllUsers(conversationUserData);
    });

    socketInstance.on('receiveMessage', (message) => {
      console.log('receive msg', message);
      setMessages((prevMessages: any) => [...prevMessages, message]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.publicMetadata?.userId,selectedUser?._id]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/all", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const users = await res.json();
        setUsers(users);
        console.log(users);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages]);

  const sendMessage = (message: any) => {
    const { text, imageUrl, videoUrl } = message;
    if (socket && selectedUser) {
      const messageData = {
        senderId: user?.publicMetadata?.userId,
        receiverId: selectedUser?._id ,
        text: text,
        imageUrl: imageUrl,
        videoUrl: videoUrl,
      };

      console.log(messageData);
      

      socket.emit('sendMessage', messageData);
    }
  };

  const handleSelectUser = (user: any) => {
    if (socket) {
      socket.emit('message-page', user?.userDetails?._id || user?._id);
      socket.emit('seen', user?.userDetails?._id || user?._id);
      setShowChatbox(true);
    }
  };

  // const filteredMessages = messages.filter(
  //   (msg: any) =>
  //     (msg.msgByUserId === user?.publicMetadata?.userId &&
  //       msg.msgByUserId === selectedUser?._id) ||
  //     (msg.msgByUserId === selectedUser?._id &&
  //       msg.msgByUserId === user?.publicMetadata?.userId),
  // );

  return (
    <div className="2xl:mx-auto 2xl:max-w-[1400px] ">
      <div className="relative h-[80vh] overflow-hidden rounded-xl bg-white ">
        <div className="mx-3 flex items-center justify-between gap-[12rem] lg:justify-start">
          <h1 className="py-2 text-xl font-bold  text-purple-1">Messages</h1>
          <div
            onClick={() => setOpen(!open)}
            className="mt-2 flex size-[30px] cursor-pointer items-center justify-center rounded-full bg-purple-200 text-center text-xl font-bold text-purple-1"
          >
            <LuPlus />
          </div>
        </div>
        <div className="absolute inset-x-0 h-[90%] lg:grid lg:grid-cols-12 ">
          <section
            className={`${showChatbox ? 'block' : 'hidden'} scrollbar-hidden mb-4 overflow-y-scroll lg:col-span-5 lg:block xl:col-span-4`}
          >
            <ChatMenu
              onSelectUser={handleSelectUser}
              users={allUsers}
              showChatbox={showChatbox}
              setClose={() => setOpen(false)}
              setShowChatbox={setShowChatbox}
            />
          </section>
          <section
            className={`${showChatbox ? 'hidden' : 'block'} relative mb-4 rounded-md border border-gray-300 lg:col-span-7 lg:block xl:col-span-8`}
          >
            {selectedUser ? (
              <div className="flex flex-col">
                <div className="h-fit">
                  <ChatboxHeader
                    user={selectedUser}
                    toggleShowWindow={toggleShowWindow}
                  />
                </div>
                <div className="scrollbar-hidden scrollbar h-[50vh] space-y-3 overflow-x-hidden overflow-y-scroll bg-black/10 p-2 lg:h-[300px]">
                  {messages?.map((msg: any, index: any) => (
                    <div
                      ref={currentMessage}
                      className={`max-w-[200px] p-2 text-[10px] text-gray-600 ${user?.publicMetadata?.userId === msg?.msgByUserId ? ' rounded-l-2xl rounded-br-2xl' : ' rounded-r-2xl rounded-bl-2xl'} flex items-baseline justify-between  ${user?.publicMetadata?.userId === msg?.msgByUserId ? 'ml-auto bg-purple-700/10' : 'bg-white'}`}
                      key={index}
                    >
                      <p>{msg.text}</p>
                      {msg?.imageUrl && (
                        <Image
                          src={msg?.imageUrl}
                          className="size-full object-scale-down"
                          alt='message image'
                        />
                      )}
                      {msg?.videoUrl && (
                        <video
                          src={msg.videoUrl}
                          className="size-full object-scale-down"
                          controls
                        />
                      )}
                      <div className="">
                        <p className="  mt-2 text-[8px]">
                          {msg?.seen ? (
                            <BiCheckDouble
                              size={22}
                              className="text-purple-700"
                            />
                          ) : (
                            <LuCheck size={20} className="text-gray-400" />
                          )}
                        </p>
                        <p className="ml-auto w-fit text-[8px]">
                          {moment(msg?.createdAt)?.format('hh:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-fit ">
                  <Input handleSendMessage={sendMessage} />
                </div>
              </div>
            ) : (
              <Message />
            )}
          </section>
        </div>
      </div>
      <GeneralModal
        isOpen={open}
        onClose={() => setOpen(!open)}
        title="Connections"
      >
        <div className="">
          { users?.map((con: any) => 
            <ChatMenuCard
              key={con?._id}
              user={con}
              setClose={() => setOpen(!open)}
              onSelectUser={handleSelectUser}
              setShowChatbox={setShowChatbox}
            />
          )}
        </div>
      </GeneralModal>
    </div>
  );
};

export default ChatRender;
