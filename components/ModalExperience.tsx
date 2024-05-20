// components/ModalExperience.tsx
import { useState } from 'react';
import EducationForm from './EducationForm';

interface ExperienceProps {
  expertise: string;
  seniority?: string;
  workExperience: {
    company: string;
    role: string;
    current: boolean;
  }[];
  education: {
    university: string;
    degree: string;
    startYear: string;
    endYear: string;
  }[];
  onExpertiseChange: (expertise: string) => void;
  onSeniorityChange: (seniority: string) => void;
  onWorkExperienceChange: (
    workExperience: {
      company: string;
      role: string;
      current: boolean;
    }[],
  ) => void;
  onEducationChange: (
    education: {
      university: string;
      degree: string;
      startYear: string;
      endYear: string;
    }[],
  ) => void;
}

const ModalExperience: React.FC<ExperienceProps> = ({
  expertise,
  seniority,
  workExperience,
  education,
  onExpertiseChange,
  onSeniorityChange,
  onWorkExperienceChange,
  onEducationChange,
}) => {
  const [newExperience, setNewExperience] = useState({
    company: '',
    role: '',
    current: false,
  });

  const handleExpertiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onExpertiseChange(e.target.value);
  };

  const handleSeniorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSeniorityChange(e.target.value);
  };

  const handleNewExperienceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewExperience({
      ...newExperience,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleNewExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onWorkExperienceChange([...workExperience, newExperience]);
    setNewExperience({
      company: '',
      role: '',
      current: false,
    });
  };

  const handleAddEducation = (newEducation: {
    university: string;
    degree: string;
    startYear: string;
    endYear: string;
  }) => {
    onEducationChange([...education, newEducation]);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md">
      <h2 className="text-2xl font-bold mb-4">Update your profile details</h2>
      <div>
        <h3 className="text-xl font-bold mb-4">Work experience</h3>
        {workExperience.map((experience, index) => (
          <div key={index} className="bg-white p-4 rounded-md shadow-md mb-4">
            <div className="font-bold">{experience.company}</div>
            <div className="text-gray-600">{experience.role}</div>
            <div>{experience.current ? 'Present' : ''}</div>
          </div>
        ))}
        <form
          onSubmit={handleNewExperienceSubmit}
          className="bg-white p-4 rounded-md shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="company"
              className="block text-gray-700 font-bold mb-2"
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={newExperience.company}
              onChange={handleNewExperienceChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-gray-700 font-bold mb-2"
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={newExperience.role}
              onChange={handleNewExperienceChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="current" className="flex items-center">
              <span className="mr-2">Current</span>
              <input
                type="checkbox"
                id="current"
                name="current"
                checked={newExperience.current}
                onChange={handleNewExperienceChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Add Experience
          </button>
        </form>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Education</h3>
        {education.map((edu, index) => (
          <div key={index} className="bg-white p-4 rounded-md shadow-md mb-4">
            <div className="font-bold">{edu.university}</div>
            <div className="text-gray-600">{edu.degree}</div>
            <div>
              {edu.startYear} - {edu.endYear}
            </div>
          </div>
        ))}
        <EducationForm onAddEducation={handleAddEducation} />
      </div>
    </div>
  );
};

export default ModalExperience;
