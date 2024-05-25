import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { BsEmojiLaughing } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';

const Input = ({ handleSendMessage }:any ) => {
  const [message, setMessage] = useState('');

  const onSendMessage = () => {
    if (message.trim()) {
    handleSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className='flex items-center gap-4 mx-4 absolute bottom-3 left-0 w-[96%]'>
      <div className='flex items-center justify-between bg-purple-1/5 border border-gray-300 py-2 px-3 rounded-md w-[80%]'>
        <input 
          type="text" 
          placeholder="message" 
          className='outline-none border-0 bg-transparent'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          // onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <div className='flex gap-4 text-gray-500'>
          <BsEmojiLaughing className='cursor-pointer'/>
          <ImAttachment className='cursor-pointer' />
        </div>
      </div>
      
      <div className='flex items-center gap-4 bg-purple-1 text-white p-2 rounded w-[14%]'>
        <button onClick={onSendMessage}>send</button>
        <FiSend />
      </div>
    </div>
  );
};

export default Input;
