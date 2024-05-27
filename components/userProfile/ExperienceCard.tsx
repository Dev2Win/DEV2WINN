import React from 'react';

interface Experience {
  company: string;
  role: string;
  industry: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <div className="font-bold">{experience.company}</div>
      <div className="text-gray-600">{experience.role}</div>
      <div>{experience.industry}</div>
      <div>{experience.location}</div>
      <div>{experience.startDate} - {experience.current ? 'Present' : experience.endDate}</div>
    </div>
  );
};

export default ExperienceCard;