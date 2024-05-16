'use client';

import {  useMemo, useState } from 'react';
import StepOneMentor from '@/components/profile/StepOneMentor';
import StepTwoMentor from '@/components/profile/StepTwoMentor';
import StepFourForm from '@/components/profile/StepFourForm';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';
import { options, Option, expertiseOptions ,careerPrefOptions} from '../data';



export type FormValues = {
  title: string;
  bio: string;
  career_preferences: any;
  industry_pref: Option[] | null;
  experience_level: string;
  availability: string;
  expertise: Option[] | null;
};
const mentorUrl: string = process.env.MENTOR_PROFILE_ENDPOINT|| 'http://localhost:3000/api/users/mentor'


const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [selectedOptionsRaw, setSelectedOptionsRaw] = useState([]);
  const [selectedExpertiseRaw, setSelectedExpertiseRaw] = useState([]);
  const [selectedIndustryRaw, setSelectedIndustryRaw] = useState([]);
 
  const steps: string[] = ['personal', 'career', 'finish'];
  const {setName} = useStore()
  const router = useRouter()

  const [formData, setFormData] = useState<FormValues>({
    title: '',
    bio: '',
    career_preferences: '',
    industry_pref: null,
    experience_level: '',
    availability: '',
    expertise: null,
  });
  
  const selectedOptions = useMemo(() => selectedOptionsRaw, [selectedOptionsRaw]);
  const selectedExpertise = useMemo(() => selectedExpertiseRaw, [selectedExpertiseRaw]);
  const selectedIndustry= useMemo(() => selectedIndustryRaw, [selectedIndustryRaw]);

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
  

  const handleSelect = (selected: any) => {
    setSelectedOptionsRaw(selected);
    console.log(selected);
  };

  const handleExpertise = (selected: any) => {
    setSelectedExpertiseRaw(selected);
    console.log(selected);
  };

  const handleIndustry = (selected: any) => {
    setSelectedIndustryRaw(selected);
    console.log(selected);
  };

  

  const handleMentorFormSubmit = async (e:any) => {
    e.preventDefault() 
    try {

      const updatedFormData = {
        ...formData,
        industry_pref: selectedOptions.map((option: Option) => option.value),
        expertise: selectedExpertise.map((option: Option) => option.value),
      };
      const response = await fetch("https://dev-2-winn.vercel.app/api/users/mentor", {
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
        setName('mentor')
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
          options={careerPrefOptions}
          currentStep={currentStep}
          steps={steps}
          selectedOptions={selectedOptions}
          handleSelect={handleSelect}
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
          handleIndustry={handleIndustry}
          expertiseOptions={expertiseOptions}
          IndustryOptions={options}
          selectedExpertise={selectedExpertise}
          selectedIndustry={selectedIndustry}
          handleExpertise={handleExpertise}
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
