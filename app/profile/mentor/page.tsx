'use client';

import { FormEvent, useState } from 'react';
import StepOneMentor from '@/components/profile/StepOneMentor';
import StepTwoMentor from '@/components/profile/StepTwoMentor';
import StepFourForm from '@/components/profile/StepFourForm';
import { useRouter } from 'next/navigation';


export type FormValues = {
  title: string;
  bio: string;
  career_path: string;
  industry_pref: string;
  experience_level: string;
  availability: string;
  expertise: string;
};
// const mentorUrl: string = process.env.MENTOR_PROFILE_ENDPOINT || ""
// const mentorUrl: string = 'http://localhost:3001/api/users/mentor '


const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const steps: string[] = ['personal', 'career', 'finish'];
  const router = useRouter()
  const [formData, setFormData] = useState<FormValues>({
    title: '',
    bio: '',
    career_path: '',
    industry_pref: '',
    experience_level: '',
    availability: '',
    expertise: '',
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
  

  const handleMentorFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await fetch('https://dev-2-winn.vercel.app/users/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to post form');
      }
  
      const data = await response.json();
      console.log('mentor', data);
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
          currentStep={currentStep}
          steps={steps}
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
