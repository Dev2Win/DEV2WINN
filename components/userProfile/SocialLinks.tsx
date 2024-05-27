'use client';
import React, { useState } from 'react';

interface SocialLinksProps {}

interface Link {
  title: string;
  url: string;
}

const SocialLinks: React.FC<SocialLinksProps> = () => {
  const [formData, setFormData] = useState({
    linkedin: '',
    twitter: '',
    website: '',
  });

  const [links, setLinks] = useState<Link[]>([]);
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNewLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLink((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddLink = () => {
    setLinks((prevLinks) => [...prevLinks, newLink]);
    setNewLink({ title: '', url: '' });
    setShowAddLinkForm(false);
  };

  const handleRemoveLink = (index: number) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ ...formData, links });
  };

  return (
    <div className="max-w-lg mx-auto h-[40vh] overflow-y-scroll p-4 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            LinkedIn URL
          </label>
          <div className="flex">
            <span className="bg-gray-200 text-gray-700 p-2 rounded-l-md">
              linkedin.com/in/
            </span>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="p-2 border rounded-r-md w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Twitter URL
          </label>
          <input
            type="text"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>

        <div className="mb-4">
          {links.map((link, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="w-32 p-2 bg-gray-200 text-gray-700 rounded-l-md">
                {link.title}
              </span>
              <input
                type="text"
                value={link.url}
                className="p-2 border rounded-r-md w-full"
                readOnly
              />
              <button
                type="button"
                onClick={() => handleRemoveLink(index)}
                className="ml-2 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          {showAddLinkForm ? (
            <div className="flex items-center mb-2">
              <input
                type="text"
                name="title"
                value={newLink.title}
                onChange={handleNewLinkChange}
                placeholder="Enter title"
                className="p-2 border rounded-l-md w-1/3"
              />
              <input
                type="text"
                name="url"
                value={newLink.url}
                onChange={handleNewLinkChange}
                placeholder="Enter URL"
                className="p-2 border rounded-r-md w-2/3"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddLinkForm(false)}
                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddLinkForm(true)}
              className="px-4 py-2 bg-purple-1 text-white rounded"
            >
              + Add another
            </button>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-1/40 text-white rounded"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialLinks;
