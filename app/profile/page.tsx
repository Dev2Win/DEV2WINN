 'use client'


import { useState } from 'react';
import StepOneForm from '@/components/StepOneForm';
import StepTwoForm from '@/components/StepTwoForm';
import StepThreeForm from '@/components/StepThreeForm';
import StepFourForm from '@/components/StepFourForm';


export type FormValues = {
  title: string;
  bio: string;
  careerChoice: string;
  educationLevel: string;
  industry: string;
  experience: string;
  achievement: string;
  availability: string;
};


const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const steps: string[] = ['start', 'career', 'education', 'finish'];
  const [formData, setFormData] = useState<FormValues>({
    title: '',
    bio: '',
    careerChoice: '',
    educationLevel: '',
    industry: '',
    experience: '',
    achievement: '',
    availability: '',
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
    console.log('Form submitted!');
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
        <StepThreeForm 
          onNext={handleNext} 
          onPrevious={handlePrevious}
          complete={complete}
          currentStep={currentStep} 
          steps={steps}
        />}
     
      {currentStep === 4 && 
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

