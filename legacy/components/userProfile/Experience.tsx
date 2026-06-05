import React from 'react';
import ExperienceSection from './ExperienceSection';
import image from '@/public/images/Simon.webp';

const Experience: React.FC = () => {
  // Sample data for experiences
  const experiences = [
    {
      position: 'Frontend Developer',
      company: 'ABC Technologies',
      startYear: 'SEP 2021',
      endYear: 2023,
      logo: image,
    },
    {
      position: 'UI/UX Designer',
      company: 'XYZ Designs',
      startYear: 'SEP 2019',
      endYear: 2021,
      logo: image,
    },
  ];

  return (
    <div className=" mt-8 border flex  w-full  lg:w-8/12 flex-col rounded-lg gap-y-6 px-4 pt-8 ">
      <ExperienceSection experiences={experiences} />
    </div>
  );
};

export default Experience;
