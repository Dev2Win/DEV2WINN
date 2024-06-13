'use client';
import useStore from '@/lib/store';
import Image from 'next/image';
import React, { useState, useRef } from 'react';



const ProfileEdit: React.FC<any> = () => {
  const {userDetails} = useStore()
  const [formData, setFormData] = useState<any>(
   userDetails
  );

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // upload to cloud and get cloudinary img url
      console.log(file,formData);
      
      setFormData((prevData) => ({ ...prevData, profilePhoto: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setFormData((prevData) => ({ ...prevData, profilePhoto: null }));
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 h-[50vh] overflow-y-scroll bg-white  rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload profile photo
          </label>
          <div className="flex items-center space-x-4 mt-2">
            <div className="relative">
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    width={48}
                    height={48}
                    alt="Profile Preview"
                    className=" rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 ml-2">No Image</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={triggerFileInput}
              className=" text-purple-1 "
            >
              Update File
            </button>
            <input
              type="file"
              name="profilePhoto"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
          <small className="text-gray-500">
            Make sure the file is below 2MB
          </small>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            FirstName
          </label>
          <input
            type="text"
            name="firstName"
            value={formData?.firstName}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            LastName
          </label>
          <input
            type="text"
            name="lastName"
            value={formData?.lastName}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Gender
          </label>
          <select
            name="gender"
            value={formData?.gender}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            required
          >
            <option value="">Select one</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Which country do you live in?
          </label>
          <select
            name="country"
            value={formData?.country}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            required
          >
            <option value="">Select one</option>
            <option value="Ghana">Ghana</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            What language(s) do you speak?
          </label>
          <input
            type="text"
            name="languages"
            value={formData?.languages}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData?.bio}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
            rows={3}
            required
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-1 text-white rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
