import React from 'react'
import { FiMessageCircle } from "react-icons/fi";

const Message = () => {
  return (
    <div className='flex h-[100%] w-full flex-col items-center justify-center gap-4'>
        <FiMessageCircle size={40} className='text-gray-400' />
       <h1 className='text-lg text-gray-400'>Send chat and view conversation</h1>
    </div>
  )
}

export default Message
