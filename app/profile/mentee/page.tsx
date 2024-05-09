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
  achievement: string;
  availability: string;
  expertise: string; 

};


const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const steps: string[] = ['personal', 'career', 'finish'];
  const [formData, setFormData] = useState<FormValues>({
    title: '',
    bio: '',
    careerChoice: '',
    education: '',
    industry: '',
    experience: '',
    achievement: '',
    availability: '',
    expertise: ''

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
    console.log('mentee', formData);
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

