'use client';

import { useState } from 'react';
import StepOneMentor from '@/components/profile/StepOneMentor';
import StepTwoMentor from '@/components/profile/StepTwoMentor';
import StepFourForm from '@/components/profile/StepFourForm';
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";



export type FormValues = {
  title: string;
  bio: string;
  career_path: string;
  industry_pref: string;
  experience_level: string;
  availability: string;
  expertise: string;
};

const mentorUrl: string = 'http://localhost:3000/api/users/mentee'


const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const steps: string[] = ['personal', 'career', 'finish'];

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
  

  const handleMentorFormSubmit = async ( req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = getAuth(req);
    
    try {
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
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

    return res.status(200).json({ userId: userId });
  };
  
  return (
    <form onSubmit={handleMentorFormSubmit}>
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
