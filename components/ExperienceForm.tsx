'use client';
import useStore from '@/lib/store';
import React, { useState } from 'react';

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface ExperienceFormProps {
  initialExperience?: Experience;
  onAddExperience?: (newExperience: Experience) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  initialExperience,
  onAddExperience,
}) => {
  const [company, setCompany] = useState(initialExperience?.company || '');
  const [role, setRole] = useState(initialExperience?.role || '');
  const [startDate, setStartDate] = useState(
    initialExperience?.startDate || '',
  );
  const [endDate, setEndDate] = useState(initialExperience?.endDate || '');
  const [current, setCurrent] = useState(initialExperience?.current || false);
  const {
    addExperience,
    updateExperience,
    setShowUpdateForm,
    setShowWorkExperienceForm,
  } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExperience = {
      id: initialExperience ? initialExperience.id : generateUUID(),
      company,
      role,
      startDate,
      endDate,
      current,
    };

    if (initialExperience) {
      updateExperience(newExperience);
      setShowUpdateForm(false);
    } else {
      addExperience(newExperience);
      setShowWorkExperienceForm(false);
      // onAddExperience && onAddExperience(newExperience);
    }
  };

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded-md bg-white p-4 shadow-md"
    >
      <div className="mb-4">
        <label className="mb-2 block font-bold text-gray-700">Company</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-bold text-gray-700">Role</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-bold text-gray-700">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-bold text-gray-700">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
          disabled={current}
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-bold text-gray-700">
          <input
            type="checkbox"
            checked={current}
            onChange={(e) => setCurrent(e.target.checked)}
            className="mr-2"
          />
          Current
        </label>
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
      >
        {initialExperience ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default ExperienceForm;
