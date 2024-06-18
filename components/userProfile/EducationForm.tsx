'use client';
import useStore from '@/lib/store';
import React, { useState } from 'react';

interface Education {
  id: string;
  university: string;
  degree: string;
  startYear: string;
  endYear: string;
}

interface EducationFormProps {
  onAddEducation?: (newEducation: Education) => void;
  initialEducation?: Education;
}

const EducationForm: React.FC<EducationFormProps> = ({
  onAddEducation,
  initialEducation,
}) => {
  const [university, setUniversity] = useState(
    initialEducation?.university || '',
  );
  const [degree, setDegree] = useState(initialEducation?.degree || '');
  const [startYear, setStartYear] = useState(initialEducation?.startYear || '');
  const [endYear, setEndYear] = useState(initialEducation?.endYear || '');
  const {
    addEducation,
    updateEducation,
    setShowUpdateForm,
    setShowEducationForm,
  } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEducation = {
      id: initialEducation ? initialEducation.id : generateUUID(),
      university,
      degree,
      startYear,
      endYear,
    };

    if (initialEducation) {
      updateEducation(newEducation);
      setShowUpdateForm(false);
    } else {
      addEducation(newEducation);
      setShowEducationForm(false);
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
        <label className="mb-2 block font-bold text-gray-700">University</label>
        <input
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-bold text-gray-700">Degree</label>
        <input
          type="text"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-bold text-gray-700">Start Year</label>
        <input
          type="text"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="mb-2 block font-bold text-gray-700">End Year</label>
        <input
          type="text"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
      >
        {initialEducation ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default EducationForm;
