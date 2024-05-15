'use client'

import { FormEvent, useState } from 'react';
import StepOneMentee from '@/components/profile/StepOneMentee';
import StepTwoMentee from '@/components/profile/StepTwoMentee';
import StepFourForm from '@/components/profile/StepFourForm';
import { options, Option } from '../data';


import { useRouter } from "next/navigation"

export type FormValues = {
    bio: string;
    career_path: string;
    education_status: string;
    industry_pref: Option[] | null;
    experience_level: string;
    availability: string;
    desired_skills: string;
};


const menteeUrl: string = process.env.MENTEE_PROFILE_ENDPOINT  || "http://localhost:3000/api/users/mentee"



const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const steps: string[] = ['personal', 'career', 'finish'];

  const router = useRouter()

  const [formData, setFormData] = useState<FormValues>({
    bio: '',
    career_path: '',
    education_status: '',
    industry_pref: null,
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

  


  const handleMenteeFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // const { userId } = await getAuth(req);
    event.preventDefault()    
    try {
      // if (!userId) {
      //   return res.status(401).json({ error: "Not authenticated" });
      // }
      //const formData = new FormData();
     // formData.append('industry_pref', JSON.stringify(selectedOptions.map((option: Option) => option.value)));
      const updatedFormData = {
        ...formData,
        industry_pref: selectedOptions.map((option: Option) => option.value),
      };
      const response = await fetch(menteeUrl, {
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
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          options={options}
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