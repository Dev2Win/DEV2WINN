import React from 'react';
import avater from '../../public/images/avatar-3.png';
import Image from 'next/image';
import { IoCallOutline, IoVideocamOutline } from 'react-icons/io5';
import { BsThreeDotsVertical ,BsArrowLeft} from 'react-icons/bs';


type HeaderProps = {
  user:any;
  toggleShowWindow: () => void;
}

const ChatboxHeader = (
 {user, toggleShowWindow}:HeaderProps
) => {

  return (
    <section className="flex justify-between items-center text-black border-b border-gray-200 px-2 py-1 rounded-md">
      <div className="flex gap-2 items-center">
        <div onClick={toggleShowWindow}>
          <BsArrowLeft
            className="bg-purple-1/5 p-2 text-3xl rounded-full cursor-pointer lg:hidden"
          />
        </div>
        <Image
          src={avater}
          width={45}
          height={45}
          alt="user"
          className="rounded-full "
        />

        <div className="flex flex-col justify-between items-center gap-1">
          <h3 className="font-bold">{user?.name}</h3>
          <p className="text-sm">{user?.online ? <p className=' text-purple-700'>online</p> : 'offline'}</p>
        </div>
      </div>
      
      <div className="flex gap-4">
        {/* <IoCallOutline className="bg-purple-1/5 p-2 text-4xl rounded-full cursor-pointer" />
        <IoVideocamOutline className="bg-purple-1/5 p-2 text-4xl rounded-full cursor-pointer" />*/}
        <BsThreeDotsVertical className="bg-purple-1/5 p-2 text-4xl rounded-full cursor-pointer" /> 
      </div>
    </section>
  );
};

export default ChatboxHeader;
