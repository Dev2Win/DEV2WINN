'use client';

import React, { useMemo, useState } from 'react';
import StepOneMentor from '@/components/profile/StepOneMentor';
import StepFourForm from '@/components/profile/StepFourForm';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';

import {Option} from '../data';

export type FormValues = {
  cv: File | null;
  industries: Option[] | null;
  gender: string;
  languages: string[] | null;
  availability: string;
};

const mentorUrl: string =
  process.env.MENTOR_PROFILE_ENDPOINT || 'http://localhost:3000/api/users/mentor';

const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [selectedOptionsRaw, setSelectedOptionsRaw] = useState([]);
  const [selectedOptionsLang, setSelectedOptionsLang] = useState([]);

  const [selectedExpertiseRaw, setSelectedExpertiseRaw] = useState([]);
  const [selectedIndustryRaw, setSelectedIndustryRaw] = useState([]);

  const steps: string[] = ['personal', 'finish'];
  const { setName } = useStore();
  const router = useRouter();

  const [formData, setFormData] = useState<FormValues>({
    cv: null,
    industries: null,
    gender: '',
    languages: null,
    availability: '',
  });
  

  const selectedOptions = useMemo(
    () => selectedOptionsRaw,
    [selectedOptionsRaw],
  );
  const selectedExpertise = useMemo(
    () => selectedExpertiseRaw,
    [selectedExpertiseRaw],
  );
  const selectedIndustry = useMemo(
    () => selectedIndustryRaw,
    [selectedIndustryRaw],
  );
  const selectedLangOptions = useMemo(
    () => selectedOptionsLang,
    [selectedOptionsLang],
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSelectLanguages = (selected: any) => {
    setSelectedOptionsLang(selected);
    console.log(selected);
  };

  const handleSelectIndustry = (selected: any) => {
    setSelectedIndustryRaw(selected);
    console.log(selected);
  };

  const handleMentorFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      if (formData.cv) {
        formDataToSend.append('cv', formData.cv); // Append the actual File object
      } else {
        console.error('CV file is null or undefined.');
      }
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('availability', formData.availability);
  
      // Append array data as JSON strings
      formDataToSend.append(
        'industries',
        JSON.stringify(selectedIndustry.map((option: Option) => option.value))
      );
      formDataToSend.append(
        'languages',
        JSON.stringify(selectedLangOptions.map((option: Option) => option.value))
      );


      // Print each entry of formDataToSend
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

  
      // Send form data as multipart/form-data
      const response = await fetch(mentorUrl, {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error('Failed to post form');
      }
  
      const data = await response.json();
      setComplete(true);
  
      if (data) {
        setName('mentor');
        router.push(`/dashboard`);
      }
  
      return data;
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  return (
    <form className="">
      {currentStep === 1 && (
        <StepOneMentor
          onNext={handleNext}
          formData={formData}
          handleFormChange={handleFormChange}
          currentStep={currentStep}
          complete={complete}
          steps={steps}
          selectedIndustries={selectedIndustry}
          selectedLanguages={selectedLangOptions}
          handleSelectIndustries={handleSelectIndustry}
          handleSelectLanguages={handleSelectLanguages}
        />
      )}

      {currentStep === 2 && (
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
