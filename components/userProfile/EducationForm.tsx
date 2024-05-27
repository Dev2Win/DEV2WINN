'use client';
import React, { useState } from 'react';

interface Education {
  university: string;
  degree: string;
  startYear: string;
  endYear: string;
}

interface EducationFormProps {
  onAddEducation: (newEducation: Education) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ onAddEducation }) => {
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEducation({ university, degree, startYear, endYear });
    setUniversity('');
    setDegree('');
    setStartYear('');
    setEndYear('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-md shadow-md mb-4"
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">University</label>
        <input
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Degree</label>
        <input
          type="text"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Start Year</label>
        <input
          type="text"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">End Year</label>
        <input
          type="text"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
      >
        Add Education
      </button>
    </form>
  );
};

export default EducationForm;
