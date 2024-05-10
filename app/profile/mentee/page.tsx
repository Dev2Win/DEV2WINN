'use client'

import { useState } from 'react';
import StepOneMentee from '@/components/profile/StepOneMentee';
import StepTwoMentee from '@/components/profile/StepTwoMentee';
import StepFourForm from '@/components/profile/StepFourForm';




export type FormValues = {
    bio: string;
    career_path: string;
    education_status: string;
    industry_pref: string;
    experience_level: string;
    availability: string;
    desired_skills: string;
};

// const menteeUrl: string = process.env.MENTEE_PROFILE_ENDPOINT || ''
const menteeUrl: string = 'http://localhost:3000/api/users/mentee'


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

  
  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({...prevData, [name]: value})
  )};

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };


  const handleMenteeFormSubmit = async ( ) => {
    // const { userId } = await getAuth(req);
    
    try {
      // if (!userId) {
      //   return res.status(401).json({ error: "Not authenticated" });
      // }
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

  };
  
  

  return (
    <form >
       
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
        onSubmit={handleMenteeFormSubmit}
        onPrevious={handlePrevious} 
        complete={complete}
        currentStep={currentStep}
        steps={steps}
      />}
    </form>
  );
}

export default MultiStepPage;