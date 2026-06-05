import Image from 'next/image';
import React from 'react';
import image from '@/public/images/Simon.webp';
import EducationForm from './EducationForm';
import useStore from '@/lib/store';

interface Education {
  id: string;
  university: string;
  degree: string;
  startYear: string;
  endYear: string;
}

interface EducationCardProps {
  education: Education;
  index: number;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  // const [showForm, setShowForm] = useState(false);
  const {
    showUpdateForm,
    setShowUpdateForm,
    setEditingEducationId,
    editingEducationId,
  } = useStore();

  const handleClick = () => {
    setShowUpdateForm(true);
    setEditingEducationId(education.id);
  };
  return (
    <>
      <div className="mb-8 flex w-full justify-between rounded-md border p-5">
        <div>
          <Image
            src={image}
            alt={education.degree}
            width={20}
            height={40}
            className="mr-4 size-12 rounded-full"
          />
        </div>
        <div>
          <p className="font-semibold ">{education.university}</p>
          <p className="text-gray-600 ">{education.degree}</p>
        </div>
        <div className="flex justify-end gap-x-4">
          <p className="cursor-pointer text-gray-600" onClick={handleClick}>
            ✏️
          </p>
          <p className="inline-flex h-8  w-2/3   items-center bg-blue-100  text-center text-xs font-semibold text-black">
            {education.startYear} - {education.endYear}
          </p>
        </div>
      </div>
      {showUpdateForm && editingEducationId === education.id && (
        <EducationForm initialEducation={education} />
      )}
    </>
  );
};

export default EducationCard;
