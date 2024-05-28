import uploadFile from '@/lib/uploadFile';
import Image from 'next/image';
import React, { useState } from 'react';
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

  const handleUploadImage = async (e:any) => {
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

  const handleUploadVideo = async (e:any) => {
    const file = e.target.files[0]  

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

  const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {  value } = e.target;

    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  return (
    <div className="">
      <div className="absolute inset-x-0 bottom-0 flex w-full items-center gap-4 bg-white">
        <div className="flex w-[80%] items-center justify-between rounded-md border border-gray-300 bg-purple-1/5 px-3 py-1">
          <input
            type="text"
            placeholder="message"
            className="w-[94%] border-0 bg-transparent px-2 py-1 outline-none sm:w-[85%]"
            value={message.text}
            onChange={handleOnChange}
          />
          <div className="flex items-center justify-center gap-4 text-gray-500">
            {/* <BsEmojiLaughing className="" /> */}
            <div className="relative cursor-pointer">
            
              <ImAttachment
                onClick={handleUploadImageVideoOpen}
                className="cursor-pointer"
              />
              {message.imageUrl && (
                <div className="absolute bottom-[4rem] right-5  h-[220px] w-[300px]  overflow-hidden rounded">
                  <div
                    className="absolute right-0 top-0 w-fit cursor-pointer p-2 hover:text-red-600"
                    onClick={handleClearUploadImage}
                  >
                    <IoClose size={30} />
                  </div>
                  <div className="bg-white p-3">
                    <Image
                      src={message.imageUrl}
                      alt="uploadImage"
                      className="m-2 aspect-square size-full  object-contain "
                    />
                  </div>
                </div>
              )}

              {message.videoUrl && (
                <div className="absolute bottom-[4rem] right-5  h-[220px] w-[300px]  overflow-hidden rounded">
                  <div
                    className="absolute right-0 top-0 w-fit cursor-pointer p-2 hover:text-red-600"
                    onClick={handleClearUploadVideo}
                  >
                    <IoClose size={30} />
                  </div>
                  <div className="bg-white p-3">
                    <video
                      src={message.videoUrl}
                      className="m-2 aspect-square size-full max-w-sm object-scale-down"
                      controls
                      muted
                      autoPlay
                    />
                  </div>
                </div>
              )}
              {openImageVideoUpload && (
                <div className="absolute bottom-14 w-36 rounded bg-white p-2 shadow">
                  <form>
                    <label
                      htmlFor="uploadImage"
                      className="flex cursor-pointer items-center gap-3 p-2 px-3 hover:bg-slate-200"
                    >
                      <div className="text-primary">
                        <FaImage size={18} />
                      </div>
                      <p>Image</p>
                    </label>
                    <label
                      htmlFor="uploadVideo"
                      className="flex cursor-pointer items-center gap-3 p-2 px-3 hover:bg-slate-200"
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

        <div className="flex w-[14%] items-center justify-center gap-4 rounded bg-purple-1 py-2 text-white sm:px-3">
          <button
            onClick={onSendMessage}
            className="hidden font-semibold sm:block "
          >
            send
          </button>
          <IoMdSend className="" />
        </div>
      </div>
    </div>
  );
};

export default Input;
