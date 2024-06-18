'use client';

import React, {  useMemo, useState } from 'react';
import StepOneMentor from '@/components/profile/StepOneMentor';
import StepTwoMentor from '@/components/profile/StepTwoMentor';
import StepFourForm from '@/components/profile/StepFourForm';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';
import { options, Option, expertiseOptions, languages ,careerPrefOptions} from '../data';



export type FormValues = {
  title: string;
  bio: string;
  career_preferences: any;
  industry_pref: Option[] | null;
  experience_level: string;
  availability: string;
  gender: string;
  languages: string[] | null;
  expertise: Option[] | null;
};
const mentorUrl: string = process.env.MENTOR_URL || 'http://localhost:3000/api/users/mentor'


const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [selectedOptionsRaw, setSelectedOptionsRaw] = useState([]);
  const [selectedOptionsLang, setSelectedOptionsLang] = useState([]);
  
  const [selectedExpertiseRaw, setSelectedExpertiseRaw] = useState([]);
  const [selectedIndustryRaw, setSelectedIndustryRaw] = useState([]);
 
  const steps: string[] = ['personal', 'career', 'finish'];
  const {setName} = useStore()
  const router = useRouter()

  const [formData, setFormData] = useState<FormValues>({
    title: '',
    bio: '',
    career_preferences: null,
    industry_pref: null,
    experience_level: '',
    availability: '',
    gender: '',
    languages: null,
    expertise: null,
  });
  
  const selectedOptions = useMemo(() => selectedOptionsRaw, [selectedOptionsRaw]);
  const selectedExpertise = useMemo(() => selectedExpertiseRaw, [selectedExpertiseRaw]);
  const selectedIndustry= useMemo(() => selectedIndustryRaw, [selectedIndustryRaw]);
  const selectedLangOptions = useMemo(() => selectedOptionsLang, [selectedOptionsLang]);


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
  const handleSelectLang = (selected: any) => {
    setSelectedOptionsLang(selected);
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
        industry_pref: selectedIndustry.map((option: Option) => option.value),
        expertise: selectedExpertise.map((option: Option) => option.value),
        career_preferences: selectedOptions.map((option: Option) => option.value),
        languages: selectedLangOptions.map((option: Option) => option.value),
      };
      const response = await fetch(mentorUrl, {
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
          options={languages}
          currentStep={currentStep}
          steps={steps}
          selectedOptions={selectedLangOptions}
          handleSelect={handleSelect}
          handleSelectLang={handleSelectLang}
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
          IndustryOptions={options}
          selectedOptions={selectedOptions}
          handleSelect={handleSelect}
          options={careerPrefOptions}
          expertiseOptions={expertiseOptions}
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
