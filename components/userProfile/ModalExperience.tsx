'use client';
import React, { useState, useMemo } from 'react';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import ExperienceCard from './ExperienceCard';
import EducationCard from './EducationCard';
import { options, seniority } from '@/app/profile/data';
import Select from 'react-select';

interface Experience {
  company: string;
  role: string;
  industry: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

const NewOptions: any = options;
const NewSeniority: any = seniority;

interface Education {
  university: string;
  degree: string;
  startYear: string;
  endYear: string;
}

interface ExperienceProps {
  workExperience: Experience[];
  education: Education[];
  onWorkExperienceChange: (workExperience: Experience[]) => void;
  onEducationChange: (education: Education[]) => void;
}

const ModalExperience: React.FC<ExperienceProps> = ({
  workExperience,
  education,
  onWorkExperienceChange,
  onEducationChange,
}) => {
  const [showWorkExperienceForm, setShowWorkExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [selectedOptionsRaw, setSelectedOptionsRaw] = useState([]);
  const [selectedSeniorityRaw, setSelectedSeniorityRaw] = useState([]);

  const selectedOptions = useMemo(
    () => selectedOptionsRaw,
    [selectedOptionsRaw],
  );
  const selectedSeniority = useMemo(
    () => selectedSeniorityRaw,
    [selectedSeniorityRaw],
  );

  const handleSeniorityChange = (selected: any) => {
    setSelectedSeniorityRaw(selected);
    console.log(selected);
  };

  const handleSelect = (selected: any) => {
    setSelectedOptionsRaw(selected);
    console.log(selected);
  };

  const handleAddEducation = (newEducation: Education) => {
    onEducationChange([...education, newEducation]);
    setShowEducationForm(false);
  };

  const handleAddWorkExperience = (newExperience: Experience) => {
    onWorkExperienceChange([...workExperience, newExperience]);
    setShowWorkExperienceForm(false);
  };

  return (
    <div className="bg-white h-[50vh] overflow-y-scroll p-6 rounded-md">
      <h2 className="text-2xl font-bold mb-4">Update your profile details</h2>
      <div className="mb-8">
        <label className="block text-gray-700 font-bold mb-2">Expertise</label>
        <Select
          isMulti
          options={NewOptions}
          value={selectedOptions}
          onChange={handleSelect}
          placeholder="Select options..."
        />
      </div>
      <div className="mb-8">
        <label className="block text-gray-700 font-bold mb-2">Seniority</label>
        <Select
          isMulti
          options={NewSeniority}
          value={selectedSeniority}
          onChange={handleSeniorityChange}
          placeholder="Select options..."
        />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Work Experience</h3>
        {workExperience.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} />
        ))}
        <button
          onClick={() => setShowWorkExperienceForm(!showWorkExperienceForm)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          {showWorkExperienceForm ? 'Cancel' : 'Add Another'}
        </button>
        {showWorkExperienceForm && (
          <ExperienceForm onAddExperience={handleAddWorkExperience} />
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Education</h3>
        {education.map((edu, index) => (
          <EducationCard key={index} education={edu} />
        ))}
        <button
          onClick={() => setShowEducationForm(!showEducationForm)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          {showEducationForm ? 'Cancel' : 'Add Another'}
        </button>
        {showEducationForm && (
          <EducationForm onAddEducation={handleAddEducation} />
        )}
      </div>
    </div>
  );
};

export default ModalExperience;
