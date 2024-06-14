import React from 'react';
import Image from 'next/image';
import image from '@/public/images/Simon.webp';
import ExperienceForm from './ExperienceForm';
import useStore from '@/lib/store';

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index,
}) => {
  const { showUpdateForm, setShowUpdateForm, setEditingExperienceId, editingExperienceId } = useStore();

  const handleClick = () => {
    setShowUpdateForm(true);
    setEditingExperienceId(experience.id);
  };

  return (
    <>
      <div className="mb-8 flex w-full justify-between rounded-md border p-5">
        <div>
          <Image
            src={image}
            alt={experience.company}
            width={20}
            height={40}
            className="mr-4 size-12 rounded-full"
          />
        </div>
        <div>
          <p className="font-semibold ">{experience.role}</p>
          <p className="text-gray-600 ">{experience.company}</p>
        </div>
        <div className="flex justify-end gap-x-4">
          <p className="cursor-pointer text-gray-600" onClick={handleClick}>
            ✏️
          </p>
          <p className="inline-flex h-8  w-2/3   items-center bg-blue-100  text-center text-xs font-semibold text-black">
            {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
          </p>
        </div>
      </div>
      {showUpdateForm && editingExperienceId === experience.id && (
        <ExperienceForm
          initialExperience={experience}
        />
      )}
    </>
  );
};

export default ExperienceCard;
