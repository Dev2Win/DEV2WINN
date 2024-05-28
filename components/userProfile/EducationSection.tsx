'use client';
import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';

interface Education {
  course: string;
  school: string;
  startYear: number;
  endYear?: number;
  logo: StaticImageData;
}

interface ExperienceSectionProps {
  educations: Education[];
}

const EducationSection: React.FC<ExperienceSectionProps> = ({ educations }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className=" flex    justify-between">
        <div className="">
          <h2 className="text-xl font-bold mb-4">
            Education
            <span className="text-sm font-bold  bg-purple-1 rounded-full  text-white px-2 py-1 ml-2">
              {educations.length}
            </span>
          </h2>
          <div>
            {educations
              .slice(0, expanded ? educations.length : 1)
              .map((edu, index) => (
                <div key={index} className="mb-10 flex">
                  <div>
                    <Image
                      src={edu.logo}
                      alt={edu.school}
                      width={20}
                      height={40}
                      className="size-12 mr-4 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{edu.course}</p>
                    <span className="flex gap-x-2 flex-wrap">
                      <p className="text-gray-600">{edu.school} •</p>
                      <p className="text-gray-600">
                        {edu.startYear} - {edu.endYear || 'Present'}
                      </p>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          {educations.length > 1 && (
            <button
              className="text-purple-1 text-sm font-bold focus:outline-none"
              onClick={toggleExpanded}
            >
              {expanded ? 'View Less' : 'View All'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default EducationSection;
