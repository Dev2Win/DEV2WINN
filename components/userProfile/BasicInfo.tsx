'use client';
// import useStore from '@/lib/store';
import Image from 'next/image';
import React, { useState, useRef } from 'react';

const ProfileEdit: React.FC<any> = () => {
  // const { userDetails } = useStore()
  const [formData, setFormData] = useState<any>();
  //  userDetails

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // upload to cloud and get cloudinary img url
      console.log(file, formData);

      setFormData((prevData: any) => ({ ...prevData, profilePhoto: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setFormData((prevData: any) => ({ ...prevData, profilePhoto: null }));
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
    <div className="mx-auto h-[50vh] max-w-lg overflow-y-scroll rounded-md bg-white  p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload profile photo
          </label>
          <div className="mt-2 flex items-center space-x-4">
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
                    className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                  <span className="ml-2 text-gray-500">No Image</span>
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
            className="mt-2 w-full rounded border p-2"
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
            className="mt-2 w-full rounded border p-2"
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
            className="mt-2 w-full rounded border p-2"
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
            className="mt-2 w-full rounded border p-2"
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
            className="mt-2 w-full rounded border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData?.bio}
            onChange={handleChange}
            className="mt-2 w-full rounded border p-2"
            rows={3}
            required
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            className="rounded bg-purple-1 px-4 py-2 text-white"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
