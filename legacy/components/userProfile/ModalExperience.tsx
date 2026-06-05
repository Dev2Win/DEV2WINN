'use client';
import React, { useState, useMemo } from 'react';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import ExperienceCard from './ExperienceCard';
import EducationCard from './EducationCard';
import { options, seniority } from '@/app/profile/data';
import Select from 'react-select';
import useStore from '@/lib/store';

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

const NewOptions: any = options;
const NewSeniority: any = seniority;

interface Education {
  id: string;
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
  const { showWorkExperienceForm, setShowWorkExperienceForm } = useStore();
  const { showEducationForm, setShowEducationForm } = useStore();
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
  const newExp = new Set(workExperience);

  const mappedArray = [];
  newExp.forEach((item) => {
    // Perform mapping operations on each item and push the result to a new array
    mappedArray.push(item);
  });

  return (
    <div className="h-[50vh] overflow-y-scroll rounded-md bg-white p-6">
      <h2 className="mb-4 text-2xl font-bold">Update your profile details</h2>
      <div className="mb-8">
        <label className="mb-2 block font-bold text-gray-700">Expertise</label>
        <Select
          isMulti
          options={NewOptions}
          value={selectedOptions}
          onChange={handleSelect}
          placeholder="Select options..."
        />
      </div>
      <div className="mb-8">
        <label className="mb-2 block font-bold text-gray-700">Seniority</label>
        <Select
          isMulti
          options={NewSeniority}
          value={selectedSeniority}
          onChange={handleSeniorityChange}
          placeholder="Select options..."
        />
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold">Work Experience</h3>
        {workExperience.map((experience, index) => (
          <ExperienceCard index={index} key={index} experience={experience} />
        ))}
        <button
          onClick={() => setShowWorkExperienceForm(!showWorkExperienceForm)}
          className="rounded-md bg-purple-1/50 px-4 py-2 text-white transition-colors duration-300 hover:bg-purple-1"
        >
          {showWorkExperienceForm ? 'Cancel' : 'Add Another'}
        </button>
        {showWorkExperienceForm && (
          <ExperienceForm onAddExperience={handleAddWorkExperience} />
        )}
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-xl font-bold">Education</h3>
        {education.map((edu, index) => (
          <EducationCard index={index} key={index} education={edu} />
        ))}
        <button
          onClick={() => setShowEducationForm(!showEducationForm)}
          className="rounded-md bg-purple-1/50 px-4 py-2 text-white transition-colors duration-300 hover:bg-purple-1"
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
