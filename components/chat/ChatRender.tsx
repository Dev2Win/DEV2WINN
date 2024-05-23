'use client';
import React, { useEffect, useState } from 'react';
import Message from '@/components/chat/Message';
import ChatboxHeader from '@/components/chat/ChatboxHeader';
import Input from '@/components/chat/Input';
import ChatMenu from '@/components/chat/ChatMenu';
import io from 'socket.io-client';
import moment from 'moment';
import { useUser } from '@clerk/clerk-react';
import MeetingModal from '../MeetingModal';
import ChatMenuCard from './ChatMenuCard';
import { BiCheckDouble } from 'react-icons/bi';
import { LuCheck, LuPlus } from "react-icons/lu";


const SOCKET_SERVER_URL = 'http://localhost:3001/';

const ChatRender = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showChatbox, setShowChatbox] = useState(true);
  const [allUsers, setAllUsers] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [connections, setConnections] = useState<any>([]);
  const [socket, setSocket] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  const toggleShowWindow = () => {
    setShowChatbox(!showChatbox);
  };

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL, {
      auth: { token: user?.publicMetadata?.userId },
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to the server');
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
  }, [user?.publicMetadata?.userId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:3000/api/users/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const users = await res.json();
        setConnections(users);
        console.log(users);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const sendMessage = (text: any) => {
    if (socket && selectedUser) {
      const messageData = {
        senderId: user?.publicMetadata?.userId,
        receiverId: selectedUser?._id || selectedUser?.userDetails?._id,
        text: text,
      };

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
      <div className="relative h-[80vh] bg-white shadow-md overflow-hidden rounded-xl">
        <div className="flex justify-between lg:justify-start mx-3 gap-[12rem] items-center">
          <h1 className="font-bold text-xl text-purple-1  py-2">Messages</h1>
          <div
            onClick={() => setOpen(!open)}
            className="font-bold text-xl text-purple-1 w-[30px] h-[30px] mt-2 cursor-pointer flex items-center justify-center text-center rounded-full bg-purple-200"
          >
           <LuPlus/>
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-12 h-[90%] absolute left-0 right-0 ">
          <section
            className={`${showChatbox ? 'block' : 'hidden'} lg:block overflow-y-scroll mb-4 scrollbar-hidden lg:col-span-5 xl:col-span-4`}
          >
            <ChatMenu
              onSelectUser={handleSelectUser}
              users={allUsers}
              showChatbox={showChatbox}
              setShowChatbox={setShowChatbox}
            />
          </section>
          <section className={`${showChatbox ? 'hidden' : 'block'} lg:block lg:col-span-7 border border-gray-300 rounded-md mb-4 relative xl:col-span-8`}>
            {selectedUser ? (
              <div className="flex flex-col">
                <div className="h-fit">
                  <ChatboxHeader
                    user={selectedUser}
                    toggleShowWindow={toggleShowWindow}
                  />
                </div>
                <div className="h-[50vh] lg:h-[300px] p-2 overflow-x-hidden bg-black/10 overflow-y-scroll scrollbar-hidden scrollbar space-y-3">
                  {messages?.map((msg: any, index: any) => (
                    <div
                      className={`max-w-[200px] p-2 text-gray-600 text-[10px] ${user?.publicMetadata?.userId === msg?.msgByUserId ? ' rounded-l-2xl rounded-br-2xl' : ' rounded-r-2xl rounded-bl-2xl'} flex items-baseline justify-between  ${user?.publicMetadata?.userId === msg?.msgByUserId ? 'ml-auto bg-purple-700/10' : 'bg-white'}`}
                      key={index}
                    >
                      <p>{msg.text}</p>
                      <div className="">
                        <p className="  text-[8px] mt-2">
                          {msg?.seen ? (
                            <BiCheckDouble size={22} className='text-purple-700'/>
                          ) : (
                            <LuCheck size={20} className='text-gray-400'/>
                          )}
                        </p>
                        <p className="text-[8px] ml-auto w-fit">
                          {moment(msg?.createdAt)?.format('hh:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='h-fit '>
                  <Input handleSendMessage={sendMessage} />
                </div>
              </div>
            ) : (
              <Message />
            )}
          </section>
        </div>
      </div>
      <MeetingModal
        isOpen={open}
        onClose={() => setOpen(!open)}
        title="Connections"
      >
        <div className="">
          {connections?.map((con: any) => (
            <ChatMenuCard
              key={con?._id}
              user={con}
              setClose={() => setOpen(!open)}
              onSelectUser={handleSelectUser}
            />
          ))}
        </div>
      </MeetingModal>
    </div>
  );
};

export default ChatRender;
