'use client';
// components/EducationForm.tsx
import { useState, ChangeEvent, FormEvent } from 'react';

interface Education {
  university: string;
  degree: string;
  startYear: string;
  endYear: string;
}

interface EducationFormProps {
  onAddEducation: (education: Education) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ onAddEducation }) => {
  const [education, setEducation] = useState<Education>({
    university: '',
    degree: '',
    startYear: '',
    endYear: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEducation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddEducation(education);
    setEducation({ university: '', degree: '', startYear: '', endYear: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-md">
      <div className="mb-4">
        <label
          htmlFor="university"
          className="block text-gray-700 font-bold mb-2"
        >
          University, college, school *
        </label>
        <input
          type="text"
          id="university"
          name="university"
          value={education.university}
          onChange={handleChange}
          placeholder="Eg: University of Texas"
          required
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="degree" className="block text-gray-700 font-bold mb-2">
          Degree / Field of study *
        </label>
        <input
          type="text"
          id="degree"
          name="degree"
          value={education.degree}
          onChange={handleChange}
          placeholder="Eg: Bachelors in BA"
          required
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Timeline *</label>
        <div className="flex space-x-2">
          <select
            name="startYear"
            value={education.startYear}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Start Year
            </option>
            {[...Array(50)].map((_, i) => (
              <option key={i} value={2024 - i}>
                {2024 - i}
              </option>
            ))}
          </select>
          <select
            name="endYear"
            value={education.endYear}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              End Year
            </option>
            {[...Array(50)].map((_, i) => (
              <option key={i} value={2024 - i}>
                {2024 - i}
              </option>
            ))}
          </select>
        </div>
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
