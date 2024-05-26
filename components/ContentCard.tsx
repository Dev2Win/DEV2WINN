'use client';
import Tabs from './Tabs';
import ProfileCard from './ProfileCard';
import image from '@/public/images/Simon.webp';
import Image from 'next/image';
import Overview from './Overview';
import { useEffect, useState } from 'react';
import MeetingModal from './MeetingModal';
import BasicInfo from './BasicInfo';
import ModalExperience from './ModalExperience';
import SocialLinks from './SocialLinks';

// const get_all_users =
// process.env.GET_ALL_USERS || 'https://dev-2-winn.vercel.app/api/users';

const ContentCard = () => {
  const [profileData, setProfileData] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [workExperience, setWorkExperience] = useState<
    {
      industry: string;
      role: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
    }[]
  >([]);
  const [education, setEducation] = useState<
    {
      university: string;
      degree: string;
      startYear: string;
      endYear: string;
    }[]
  >([]);
  // const [formData, setFormData] = useState({
  //   name: '',
  //   gender: '',
  //   country: '',
  //   language: '',
  //   bio: '',
  //   profileImage: '', // Add profileImage to the state
  //   linkedInUrl: '',
  //   twitterUrl: '',
  //   websiteUrl: '',
  //   expertise: '',
  //   seniority: '',
  //   workExperience: [],
  // });

  // const handleNameChange = (name: string) => {
  //   setFormData({ ...formData, name });
  // };
  // const handleCountryChange = (country: string) => {
  //   setFormData({ ...formData, country });
  // };
  // const handleLanguageChange = (language: string) => {
  //   setFormData({ ...formData, language });
  // };
  // const handleBioChange = (bio: string) => {
  //   setFormData({ ...formData, bio });
  // };

  // const handleGenderChange = (gender: string) => {
  //   setFormData({ ...formData, gender });
  // };

  // // Add other handlers for form field changes

  // const handleProfileImageChange = (file: File) => {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setFormData({ ...formData, profileImage: reader.result as string });
  //   };
  //   reader.readAsDataURL(file);
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle form submission
  //   console.log(formData);
  // };

  const handleClick = () => {};

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://dev-2-winn.vercel.app/api/users/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const profileInfo: any = await res.json();
        setProfileData(profileInfo?.user);
        console.log(profileInfo);
      } catch (error) {}
    })();
  }, []);

  return (
    <div>
      <div className=" bg-primary w-full  h-[140px]"></div>
      <div className="  px-[5%] mt-[-2rem]">
        <div className="">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-5">
              <div className=" w-[150px] bg-white flex items-center justify-center h-[150px] rounded-full">
                <Image
                  className="  bg-primary w-[140px] h-[140px] rounded-full"
                  src={image}
                  alt=""
                />
              </div>
              <div className=" space-y-1">
                <h1 className=" text-xl font-bold">
                  {profileData?.firstName} {profileData?.lastName}
                </h1>
                <p className=" text-sm ">Software Engineer @ Dev2Win</p>
                <p className=" text-sm">Career : Computer Engineering </p>
              </div>
            </div>
            <button
              className="bg-purple-1/40 p-2 text-white rounded-md   "
              onClick={() => setShowModal(!showModal)}
            >
              Edit Profile
            </button>
          </div>
          <div className="">
            <Tabs
              tabs={[
                {
                  title: 'Overview',
                  content: (
                    <div>
                      <Overview />
                    </div>
                  ),
                  value: '',
                },
                {
                  title: 'Reviews',
                  content: <div>hello i am reviews</div>,
                  value: 5,
                },
                {
                  title: 'Mentees',
                  content: <ProfileCard />,
                  value: '',
                },
              ]}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <MeetingModal
          isOpen={showModal}
          onClose={() => setShowModal(!showModal)}
          title="Edit Profile"
          handleClick={handleClick}
        >
          <Tabs
            tabs={[
              {
                title: 'Info',
                content: (
                  <BasicInfo
                  // name={formData.name}
                  // gender={formData.gender}
                  // country={formData.country}
                  // language={formData.language}
                  // bio={formData.bio}
                  // profileImage={formData.profileImage}
                  // onNameChange={handleNameChange}
                  // onGenderChange={handleGenderChange}
                  // onCountryChange={handleCountryChange}
                  // onLanguageChange={handleLanguageChange}
                  // onBioChange={handleBioChange}
                  // // Add other handlers for form field changes
                  // onProfileImageChange={handleProfileImageChange}
                  />
                ),
                value: '',
              },
              {
                title: 'Experience',
                content: (
                  <ModalExperience
                    workExperience={workExperience}
                    education={education}
                    onWorkExperienceChange={setWorkExperience}
                    onEducationChange={setEducation}
                  />
                ),
                value: '',
              },
              {
                title: 'Social Links',
                content: <SocialLinks />,
                value: '',
              },
            ]}
          />
        </MeetingModal>
      )}
    </div>
  );
};

export default ContentCard;
