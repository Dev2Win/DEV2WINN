'use client';

import { useState } from 'react';
import StepOneForm from '@/components/profile/StepOneForm';
import StepTwoForm from '@/components/profile/StepTwoForm';
import StepFourForm from '@/components/profile/StepFourForm';


export type FormValues = {
  title: string;
  bio: string;
  careerChoice: string;
  industry: string;
  experience: string;
  availability: string;
  expertise: string;
  education: string;
};

const mentorUrl: string = process.env.MENTOR_PROFILE_ENDPOINT || ''

const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const steps: string[] = ['personal', 'career', 'finish'];

  const [formData, setFormData] = useState<FormValues>({
    title: '',
    bio: '',
    careerChoice: '',
    industry: '',
    experience: '',
    availability: '',
    expertise: '',
    education: '',
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
  

  const fetchMentorData = async () => {
    try {
      const response = await fetch(mentorUrl, {
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

       return data;

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      {currentStep === 1 && (
        <StepOneForm
          onNext={handleNext}
          formData={formData}
          handleFormChange={handleFormChange}
          complete={complete}
          currentStep={currentStep}
          steps={steps}
        />
      )}

      {currentStep === 2 && (
        <StepTwoForm
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
          onSubmit={fetchMentorData}
          onPrevious={handlePrevious}
          complete={complete}
          currentStep={currentStep}
          steps={steps}
        />
      )}
    </div>
  );
};

export default MultiStepPage;
