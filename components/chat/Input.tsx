import React, { useState } from 'react';
import { BsEmojiLaughing } from 'react-icons/bs';
import { ImAttachment } from 'react-icons/im';
import { IoMdSend, IoMdClose } from 'react-icons/io';

const Input = ({ handleSendMessage }: any) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // const convertFile = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const onSendMessage = async () => {
    if (message.trim() || file) {
      let fileData = null;
      // if (file) {
      //   fileData = await convertFile(file);
      // }
      await handleSendMessage({ message, file: fileData });
      setMessage('');
      setFile(null);
      (document.getElementById('fileInput') as HTMLInputElement).value = '';
    }
  };


  
  return (
    <div className="flex items-center gap-4 absolute bottom-0 left-0 right-0 w-full bg-white">
      <div className="flex items-center justify-between bg-purple-1/5 border border-gray-300 py-1 px-3 rounded-md w-[80%]">
        <input
          type="text"
          placeholder="message"
          className="outline-none border-0 bg-transparent px-2 py-1 w-[94%] sm:w-[85%]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <div className="flex gap-4 text-gray-500 items-center justify-center">
          <BsEmojiLaughing className="" />
          <div className="relative cursor-pointer">
            <input
              type="file"
              id="fileInput"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="absolute inset-0 w-full h-full opacity-0"
            />
            <ImAttachment className="cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 bg-purple-1 text-white sm:px-3 py-2 rounded w-[14%]">
        <button
          onClick={onSendMessage}
          className="font-semibold hidden sm:block "
        >
          send
        </button>
        <IoMdSend className=''/>
      </div>

      {file && (
        <div className="z-20 flex flex-col  bg-white/90 px-2 py-1 h-[30vh] sm:h-[40vh] gap-8 absolute bottom-0 left-[2%] right-[2%] sm:right-[38%] w-[96%] sm:w-[60%] rounded-md">
          <IoMdClose
            size={24}
            onClick={() => setFile(null)}
            className="text-black rounded-full cursor-pointer flex-end"
          />
          <div className="flex gap-8 justify-center items-center text-gray-600 font-semibold">
            <p>{file?.name}</p>
            <IoMdSend
              size={30}
              onClick={onSendMessage}
              className="bg-purple-1 text-white p-2 rounded-full cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Input;
