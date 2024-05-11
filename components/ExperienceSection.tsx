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
          <h2 className="text-xl font-bold mb-4">
            Experience
            <span className="text-sm font-bold  bg-purple-1 rounded-full  text-white px-2 py-1 ml-2">
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
                      className="size-12 mr-4 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{exp.position}</p>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm font-semibold bg-purple-1/20 text-white  text-center  ">
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

export default ExperienceSection;
