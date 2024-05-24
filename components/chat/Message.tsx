import React from 'react'
import { FiMessageCircle } from "react-icons/fi";

const Message = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center gap-4 h-[100%]'>
        <FiMessageCircle size={40} className='text-gray-400' />
       <h1 className='text-gray-400 text-lg'>Send chat and view conversation</h1>
    </div>
  )
}

export default Message
