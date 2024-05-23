import React from 'react';
import Image from 'next/image';
import avater from '../../public/images/avatar-3.png';
import moment from "moment"
// type CardProps = {
//   user: UsersProps;
//   onSelectUser: (user: UsersProps) => void; 
// };

const ChatMenuCard = ({ user, onSelectUser,setClose }: any) => {
  const handleUserClick = () => {
    onSelectUser(user); 
    setClose()
  };

  return (
    <div
      className="flex gap-2 py-2 px-4 border-b border-gray-200 cursor-pointer hover:bg-purple-1 hover:text-white rounded-sm transition-all"
      onClick={handleUserClick} 
    >
      <div className="flex items-start">
        <Image
          src={avater}
          width={50}
          height={50}
          alt={`${user?.userDetails?.firstName}`}
          className="rounded-full"
        />
      </div>
      <div>
        <div  className="flex justify-between items-center gap-3">
          <h3  className="font-bold">{user?.userDetails?.firstName || user?.firstName } {user?.userDetails?.lastName ||user?.lastName }</h3>
          {/* <p className="text-sm">{user?.userDetails?.lastName}</p> */}
        </div>
       <div className="flex justify-between items-center">
       <p className="text-sm text-gray-400  hover:text-gray-100">{user?.lastMsg?.text?.substring(0, 20)}</p>
       <p className='text-[8px]  w-fit'>{moment(user?.lastMsg?.createdAt)?.format('hh:mm')}</p>
        {
         Boolean(user?.unseenMsg) && (
         <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1  bg-purple-300 text-white font-semibold rounded-full'>{user?.unseenMsg}</p>
          )}
       </div>
      </div>
    </div>
  );
};

export default ChatMenuCard;
