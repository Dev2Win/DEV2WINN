'use client';
import Tabs from '../reusables/Tabs';
import ProfileCard from './ProfileCard';
import image from '@/public/images/Simon.webp';
import Image from 'next/image';
import Overview from './Overview';
import { useEffect, useMemo, useState } from 'react';
import BasicInfo from './BasicInfo';
import ModalExperience from './ModalExperience';
import SocialLinks from './SocialLinks';
import Reviews from './Reviews';
import useStore from '@/lib/store';
import GeneralModal from '../reusables/GeneralModal';

// eslint-disable-next-line camelcase
const get_all_users = process.env.GET_ALL_USERS || "https://dev-2-winn.vercel.app/api/users"

const ContentCard = () => {
  const [profileData, setProfileData] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const { experiences, addExperience } = useStore();
  const { education, addEducation } = useStore();

  // function generateUUID() {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
  //     /[xy]/g,
  //     function (c) {
  //       const r = (Math.random() * 16) | 0,
  //         v = c == 'x' ? r : (r & 0x3) | 0x8;
  //       return v.toString(16);
  //     },
  //   );
  // }

  // const uuid = generateUUID();
  // const handleEducation = () => {
  //   addEducation({
  //     id: uuid,
  //     university: string,
  //     degree: string,
  //     startYear: string,
  //     endYear: string,
  //   });
  // };

  const memoizedExperiences = useMemo(() => experiences, [experiences]);
  const memoizedEducation = useMemo(() => education, [education]);
  // const [workExperience, setWorkExperience] = useState<
  //   {
  //     industry: string;
  //     role: string;
  //     company: string;
  //     location: string;
  //     startDate: string;
  //     endDate: string;
  //     current: boolean;
  //   }[]
  // >([]);
  // const [education, setEducation] = useState<
  //   {
  //     university: string;
  //     degree: string;
  //     startYear: string;
  //     endYear: string;
  //   }[]
  // >([]);
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



  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(get_all_users, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const profileInfo: any = await res.json();
        setProfileData(profileInfo?.user);
        // setUserDetails(profileInfo?.user)
        
       
      } catch (error) {}
    })();
  }, []);

  return (
    <div>
      <div className=" bg-primary h-[140px]  w-full"></div>
      <div className="  mt-[-2rem] px-[5%]">
        <div className="">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-5 lg:flex">
              <div className=" flex h-[150px] w-[150px] items-center justify-center rounded-full bg-white">
                <Image
                  className="  bg-primary h-[140px] w-[140px] rounded-full"
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
              className="rounded-md bg-purple-1/40 p-2 text-white   "
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
                  content: <Reviews />,
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
        <GeneralModal
          isOpen={showModal}
          onClose={() => setShowModal(!showModal)}
          title="Edit Profile"
          
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
                    workExperience={memoizedExperiences}
                    education={memoizedEducation}
                    onWorkExperienceChange={addExperience}
                    onEducationChange={addEducation}
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
        </GeneralModal>
      )}
    </div>
  );
};

export default ContentCard;
