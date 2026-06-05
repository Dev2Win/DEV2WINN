'use client';

import React, { FormEvent, useMemo, useState } from 'react';
import StepOneMentee from '@/components/profile/StepOneMentee';
import StepFourForm from '@/components/profile/StepFourForm';
import { Industry, Option } from '../data';
import useStore from '@/lib/store';

import { useRouter } from 'next/navigation';

export type FormValues = {
  first_job_description: string;
  career_path: string;
  industry_pref: Option[] | null;
  availability: string;
};

const menteeUrl: string = process.env.MENTEE_URL || 'http://localhost:3000/api/users/mentee';

const MultiStepPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [selectedOptionsRaw, setSelectedOptionsRaw] = useState([]);
  const steps: string[] = ['personal', 'finish'];

  const router = useRouter();
  const { setName } = useStore();

  const [formData, setFormData] = useState<FormValues>({
    first_job_description: '',
    career_path: '',
    industry_pref: null,
    availability: '',
  });

  const selectedOptions = useMemo(
    () => selectedOptionsRaw,
    [selectedOptionsRaw],
  );

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

  const handleIndustrySelect = (selected: any) => {
    setSelectedOptionsRaw(selected);
    setFormData((prevData) => ({
      ...prevData,
      industry_pref: selected.map((option: Option) => option.value),
    }));
  };
  
  const handleMenteeFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // const { userId } = await getAuth(req);
    event.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        industry_pref: selectedOptions.map((option: Option) => option.value),
      };
      console.log("Form data",formData);
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
      if (data) {
        setName('mentee');
        router.push(`/dashboard`);
      }
    } catch (error) {
      console.log('Error submitting form:', error);
    }
  };

  return (
    <form>
      {currentStep === 1 && (
        <StepOneMentee
          onNext={handleNext}
          formData={formData}
          handleFormChange={handleFormChange}
          complete={complete}
          currentStep={currentStep}
          steps={steps}
          selectedOptions={selectedOptions}
          handleIndustrySelect={handleIndustrySelect}
          // industryOptions={Industry}
        />
      )}

      {currentStep === 2 && (
        <StepFourForm
          onSubmit={handleMenteeFormSubmit}
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
