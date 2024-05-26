import uploadFile from '@/lib/uploadFile';
import React, { useState } from 'react';
import { BsEmojiLaughing } from 'react-icons/bs';
import { FaImage, FaVideo } from 'react-icons/fa';
import { ImAttachment } from 'react-icons/im';
import { IoMdSend} from 'react-icons/io';
import { IoClose } from 'react-icons/io5';

const Input = ({ handleSendMessage }: any) => {
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: '',
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  // const [file, setFile] = useState<File | null>(null);

  // const convertFile = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const onSendMessage = async () => {
    const { text } = message;
    if (!text ) {
      console.log('Message is empty. Nothing to send.');
    } 
    
    await handleSendMessage(message);
    setMessage({ 
      text: '',
      imageUrl: '',
      videoUrl: '',
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);
    console.log(uploadPhoto);

    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url,
      };
    });

    console.log(message);
  };
  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: '',
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);

    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url,
      };
    });
  };
  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: '',
      };
    });
  };

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  return (
    <div className="">
      <div className="flex items-center gap-4 absolute bottom-0 left-0 right-0 w-full bg-white">
        <div className="flex items-center justify-between bg-purple-1/5 border border-gray-300 py-1 px-3 rounded-md w-[80%]">
          <input
            type="text"
            placeholder="message"
            className="outline-none border-0 bg-transparent px-2 py-1 w-[94%] sm:w-[85%]"
            value={message.text}
            onChange={handleOnChange}
          />
          <div className="flex gap-4 text-gray-500 items-center justify-center">
            {/* <BsEmojiLaughing className="" /> */}
            <div className="relative cursor-pointer">
              {/* <input
            type="file"
            id="fileInput"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="absolute inset-0 w-full h-full opacity-0"
          /> */}
              <ImAttachment
                onClick={handleUploadImageVideoOpen}
                className="cursor-pointer"
              />
              {message.imageUrl && (
                <div className="w-[300px] h-[220px] absolute  bottom-[4rem] right-5  rounded overflow-hidden">
                  <div
                    className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
                    onClick={handleClearUploadImage}
                  >
                    <IoClose size={30} />
                  </div>
                  <div className="bg-white p-3">
                    <img
                      src={message.imageUrl}
                      alt="uploadImage"
                      className="aspect-square w-full h-full  m-2  object-contain "
                    />
                  </div>
                </div>
              )}

              {message.videoUrl && (
                <div className="w-[300px] h-[220px] absolute  bottom-[4rem] right-5  rounded overflow-hidden">
                  <div
                    className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
                    onClick={handleClearUploadVideo}
                  >
                    <IoClose size={30} />
                  </div>
                  <div className="bg-white p-3">
                    <video
                      src={message.videoUrl}
                      className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                      controls
                      muted
                      autoPlay
                    />
                  </div>
                </div>
              )}
              {openImageVideoUpload && (
                <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
                  <form>
                    <label
                      htmlFor="uploadImage"
                      className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                    >
                      <div className="text-primary">
                        <FaImage size={18} />
                      </div>
                      <p>Image</p>
                    </label>
                    <label
                      htmlFor="uploadVideo"
                      className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                    >
                      <div className="text-purple-500">
                        <FaVideo size={18} />
                      </div>
                      <p>Video</p>
                    </label>

                    <input
                      type="file"
                      id="uploadImage"
                      onChange={handleUploadImage}
                      className="hidden"
                    />

                    <input
                      type="file"
                      id="uploadVideo"
                      onChange={handleUploadVideo}
                      className="hidden"
                    />
                  </form>
                </div>
              )}
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
          <IoMdSend className="" />
        </div>

        {/* {file && (
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
    )} */}
      </div>
    </div>
  );
};

export default Input;
