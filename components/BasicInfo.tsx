import Image from 'next/image';
import React, { ChangeEvent, useRef } from 'react';

interface BasicInfoProps {
  name: string;
  gender?: string;
  country: string;
  language: string;
  bio: string;
  profileImage: string;
  onNameChange: (name: string) => void;
  onGenderChange: (gender: string) => void;
  onCountryChange: (country: string) => void;
  onLanguageChange: (language: string) => void;
  onBioChange: (bio: string) => void;
  onProfileImageChange: (file: File) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  name,
  gender,
  country,
  language,
  bio,
  profileImage,
  onNameChange,
  onGenderChange,
  onCountryChange,
  onLanguageChange,
  onBioChange,
  onProfileImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onProfileImageChange(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg   overflow-y-scroll h-[50vh] ">
      <div className="flex-col items-center mb-4">
        <h3 className="text-sm font-semibold pb-4 mr-4">
          Upload profile photo
        </h3>
        <div className="flex">
          <Image
            src={profileImage}
            alt="Profile"
            width={64}
            height={64}
            className="rounded-full w-16 h-16 mr-4"
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleProfileImageChange}
            className=""
          />

          {profileImage && (
            <span className="ml-4 text-gray-700">update file</span>
          )}
        </div>
      </div>
      <div className="flex ">
        <div className="w-full  px-4 mb-4">
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Your full name*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-1 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Select Gender*
            </label>
            <select
              id="gender"
              value={gender || ''}
              onChange={(e) => onGenderChange(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select one</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-2">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Which country do you live in?*
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              What language(s) do you speak?*
            </label>
            <input
              type="text"
              id="language"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio*
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => onBioChange(e.target.value)}
              className="mt-1 block h-[10rem] w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
