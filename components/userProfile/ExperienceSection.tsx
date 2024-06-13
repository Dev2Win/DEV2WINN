'use client';
import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';

interface Experience {
  position: string;
  company: string;
  startYear: string;
  endYear?: number;
  logo: StaticImageData;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className=" flex  justify-between">
        <div>
          <h2 className="mb-4 text-xl font-bold">
            Experience
            <span className="ml-2 rounded-full  bg-purple-1 px-2  py-1 text-sm font-bold text-white">
              {experiences.length}
            </span>
          </h2>
          <div>
            {experiences
              .slice(0, expanded ? experiences.length : 1)
              .map((exp, index) => (
                <div key={index} className="mb-8 flex">
                  <div>
                    <Image
                      src={exp.logo}
                      alt={exp.company}
                      width={20}
                      height={40}
                      className="mr-4 size-12 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{exp.position}</p>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="bg-purple-1/20 text-center text-sm font-semibold  text-white  ">
                      {exp.startYear} - {exp.endYear || 'Present'}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          {experiences.length > 1 && (
            <button
              className="text-sm font-bold text-purple-1 focus:outline-none"
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

export default ExperienceSection;
