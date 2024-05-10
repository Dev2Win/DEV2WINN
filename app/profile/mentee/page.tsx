 'use client'

import { useState } from 'react';
import StepOneMentee from '@/components/profile/StepOneMentee';
import StepTwoMentee from '@/components/profile/StepTwoMentee';
import StepFourForm from '@/components/profile/StepFourForm';
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";


export type FormValues = {
    bio: string;
    career_path: string;
    education_status: string;
    industry_pref: string;
    experience_level: string;
    availability: string;
    desired_skills: string;
};

const menteeUrl: string = process.env.MENTEE_PROFILE_ENDPOINT || ''


const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const steps: string[] = ['personal', 'career', 'finish'];


  const [formData, setFormData] = useState<FormValues>({
    bio: '',
    career_path: '',
    education_status: '',
    industry_pref: '',
    experience_level: '',
    availability: '',
    desired_skills: ''
  });

  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({...prevData, [name]: value})
  )};

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };


  const handleMenteeFormSubmit = async ( req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = getAuth(req);
    
    try {
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const response = await fetch(menteeUrl, {
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
      console.log('mentee', data);
      setComplete(true);
  
      return data;
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    return res.status(200).json({ userId: userId });
  };
  
  

  return (
    <form onSubmit={handleMenteeFormSubmit}>
       
      {currentStep === 1 && 
        <StepOneMentee 
          onNext={handleNext} 
          formData={formData} 
          handleFormChange={handleFormChange}
          complete={complete}
          currentStep={currentStep}
          steps={steps}
        />}
        
      {currentStep === 2 && 
        <StepTwoMentee 
          onNext={handleNext} 
          onPrevious={handlePrevious} 
          formData={formData} 
          handleFormChange={handleFormChange}
          complete={complete}
          currentStep={currentStep} 
          steps={steps}
          />} 
     
     
      {currentStep === 3 && 
        <StepFourForm 
        onPrevious={handlePrevious} 
        complete={complete}
        currentStep={currentStep}
        steps={steps}
      />}
    </form>
  );
}

export default MultiStepPage;

