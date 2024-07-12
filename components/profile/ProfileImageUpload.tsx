/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Qt1rbHflb1K
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client';

import { useState } from 'react';

export default function ProfileImageUpload() {
  const [image, setImage] = useState(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-primary text-primary-foreground relative flex  h-8 w-32 items-center justify-center rounded-full text-4xl font-bold">
        {image ? (
          <img
            src="/placeholder.svg"
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full  object-cover"
          />
        ) : (
          'JD'
        )}
      </div>
      <label
        htmlFor="image-upload"
        className="bg-primary text-primary-foreground hover:bg-primary-600 inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2"
      >
        <UploadIcon className="h-5 w-5" />
        <span>Upload Image</span>
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
