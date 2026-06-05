import React from 'react';
import EducationSection from './EducationSection';
import image from '@/public/images/Simon.webp';

const Education: React.FC = () => {
  // Sample data for experiences
  const educations = [
    {
      course: 'Computer Science',
      school: 'KNUST',
      startYear: 2021,
      endYear: 2023,
      logo: image,
    },
    {
      course: 'Engineering',
      school: 'University of Ghana',
      startYear: 2019,
      endYear: 2021,
      logo: image,
    },
  ];

  return (
    <div className=" mt-8 border flex  w-full  lg:w-8/12 flex-col rounded-lg  px-4 pt-8 ">
      <EducationSection educations={educations} />
    </div>
  );
};

export default Education;
