import React from 'react';

interface Education {
  university: string;
  degree: string;
  startYear: string;
  endYear: string;
}

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <div className="font-bold">{education.university}</div>
      <div className="text-gray-600">{education.degree}</div>
      <div>
        {education.startYear} - {education.endYear}
      </div>
    </div>
  );
};

export default EducationCard;
