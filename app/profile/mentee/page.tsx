 'use client'

import { useState } from 'react';
import StepOneForm from '@/components/profile/StepOneForm';
import StepThreeForm from '@/components/profile/StepThreeForm';
import StepFourForm from '@/components/profile/StepFourForm';


export type FormValues = {
  title: string;
  bio: string;
  careerChoice: string;
  education: string;
  industry: string;
  experience: string;
  availability: string;
  expertise: string; 
};

// const menteeUrl: string = process.env.MENTEE_PROFILE_ENDPOINT || ''
// you can remove this, was testing
const menteeUrl = "http://localhost:3000/api/users/mentee"


const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const steps: string[] = ['personal', 'career', 'finish'];

  // title is not needed for now
  // expertise is for mentor not mentee
  const [formData, setFormData] = useState<FormValues>({
    title: '',
    bio: '',
    careerChoice: '',
    education: '',
    industry: '',
    experience: '',
    availability: '',
    expertise: ''
  });

  /*
  Esther, kindly construct the mentee object this way
    {
      career_path: "",
      desired_skills: "",
      experience_level: "",
      industry_pref: "",
      availability:"",
      education_status:"",
    }
  */

  
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


  const fetchMenteeData = async () => {
    try {
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
    <div >
       
      {currentStep === 1 && 
        <StepOneForm 
          onNext={handleNext} 
          formData={formData} 
          handleFormChange={handleFormChange}
          complete={complete}
          currentStep={currentStep}
          steps={steps}
        />}
        
      {currentStep === 2 && 
        <StepThreeForm 
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
        onSubmit={fetchMenteeData} 
        onPrevious={handlePrevious} 
        complete={complete}
        currentStep={currentStep}
        steps={steps}
      />}
    </div>
  );
}

export default MultiStepPage;

