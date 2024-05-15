'use client';

import { FormEvent, useState } from 'react';
import StepOneMentor from '@/components/profile/StepOneMentor';
import StepTwoMentor from '@/components/profile/StepTwoMentor';
import StepFourForm from '@/components/profile/StepFourForm';
import { useRouter } from 'next/navigation';
import { options, Option, expertiseOptions } from '../data';



export type FormValues = {
  title: string;
  bio: string;
  career_path: string;
  industry_pref: Option[] | null;
  experience_level: string;
  availability: string;
  expertise: Option[] | null;
};
const mentorUrl: string = process.env.MENTOR_PROFILE_ENDPOINT|| 'http://localhost:3000/api/users/mentor'


const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const steps: string[] = ['personal', 'career', 'finish'];
  const router = useRouter()
  const [formData, setFormData] = useState<FormValues>({
    title: '',
    bio: '',
    career_path: '',
    industry_pref: null,
    experience_level: '',
    availability: '',
    expertise: null,
  });


  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };
  

  const handleMentorFormSubmit = async () => {
    try {

     // const formData = new FormData();
     // formData.append('industry_pref', JSON.stringify(selectedOptions.map((option: Option) => option.value)));
     const updatedFormData = {
      ...formData,
      industry_pref: selectedOptions.map((option: Option) => option.value),
      expertise: selectedExpertise.map((option: Option) => option.value),
    };      
      const response = await fetch(mentorUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to post form');
      }
  
      const data = await response.json();
      setComplete(true);

      if (data){
        router.push(`/dashboard`)
      }
  
      return data;
    } catch (error) {
      console.error('Error submitting form:', error);
    }

  };
  
  return (
    <form >
      {currentStep === 1 && (
        <StepOneMentor
          onNext={handleNext}
          formData={formData}
          handleFormChange={handleFormChange}
          complete={complete}
          options={options}
          currentStep={currentStep}
          steps={steps}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
      )}

      {currentStep === 2 && (
        <StepTwoMentor
          onNext={handleNext}
          onPrevious={handlePrevious}
          formData={formData}
          handleFormChange={handleFormChange}
          complete={complete}
          currentStep={currentStep}
          steps={steps}
          expertiseOptions={expertiseOptions}
          selectedExpertise={selectedExpertise}
          setSelectedExpertise={setSelectedExpertise}
        />
      )}

      {currentStep === 3 && (
        <StepFourForm
          onSubmit={handleMentorFormSubmit}
          onPrevious={handlePrevious}
          complete={complete}
          currentStep={currentStep}
          steps={steps}
        />
      )}
    </form>
  );
};

export default MultiStepPage;
