 'use client'

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
  achievement: string
};


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
    achievement: ''
  });


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => 
      ({...prevData, [name]: value})
  )};

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    console.log('mentor', formData);
    setComplete(true);

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
        <StepTwoForm 
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
        onSubmit={handleSubmit} 
        onPrevious={handlePrevious} 
        complete={complete}
        currentStep={currentStep}
        steps={steps}
      />}
    </div>
  );
};

export default MultiStepPage;

