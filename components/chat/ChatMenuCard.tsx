import React from 'react';
import Image from 'next/image';
import avater from '../../public/images/avatar-3.png';
import moment from 'moment';
import { FaImage, FaVideo } from 'react-icons/fa';

// type CardProps = {
//   user: UsersProps;
//   onSelectUser: (user: UsersProps) => void;
// };

const ChatMenuCard = ({
  user,
  onSelectUser,
  setClose,
  showChatbox,
  setShowChatbox,
}: any) => {
  const handleUserClick = () => {
    onSelectUser(user);
    setShowChatbox(!showChatbox);
    setClose();
  };

  return (
    <div
      className="flex gap-2 py-2 2xl:py-4 px-2 border-b border-gray-200 cursor-pointer hover:bg-purple-1 hover:text-white rounded-sm transition-all"
      onClick={handleUserClick}
    >
      <div className="flex-shrink-0">
        <Image
          src={avater}
          width={45}
          height={45}
          alt={`${user?.userDetails?.firstName}`}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div className="flex justify-between items-center gap-3">
          <h3 className="font-bold flex-start">
            {user?.userDetails?.firstName || user?.firstName}{' '}
            {user?.userDetails?.lastName || user?.lastName}
          </h3>
          {/* <p className="text-sm">{user?.userDetails?.lastName}</p> */}
          <p className="text-[12px]  w-fit flex-end">
            {moment(user?.lastMsg?.createdAt)?.format('hh:mm')}
          </p>
        </div>
        <div className="flex justify-between items-center">
          {user?.lastMsg?.imageUrl && (
            <div className="flex items-center gap-1">
              <span>
                <FaImage />
              </span>
              {!user?.lastMsg?.text && <span>Image</span>}
            </div>
          )}
          {user?.lastMsg?.videoUrl && (
            <div className="flex items-center gap-1">
              <span>
                <FaVideo />
              </span>
              {!user?.lastMsg?.text && <span>Video</span>}
            </div>
          )}
          <p className="text-sm text-gray-400  hover:text-gray-100">
            {user?.lastMsg?.text?.substring(0, 30)}
          </p>

          {Boolean(user?.unseenMsg) && (
            <p className="text-[10px] w-5 h-5 flex justify-center items-center ml-auto p-[3px]  bg-purple-500 text-white font-semibold rounded-full">
              {user?.unseenMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMenuCard;
