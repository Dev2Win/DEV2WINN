'use client';
import Header from '@/components/lms/Header';
import React, { useEffect, useState, useRef } from 'react';
import Card from '@/components/lms/Card';
import { courses } from '@/lib/lmscontent';
import Speedometer from '@/components/lms/Speedometer';
import UserCard from '@/components/users/UserCard';
import { StaticImageData } from 'next/image';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

export type Submodule = {
  id: number;
  title: string;
  content: string;
};

export type Module = {
  id: number;
  title: string;
  submodules: Submodule[];
};

export type Course = {
  id: number;
  title: string;
  icon: any;
  booksCount: number;
  studentsCount: number;
  assignmentCounts: number;
  bgColor: string;
  courseLogo: StaticImageData;
  courseroadmap: Module[];
};

const Home = () => {
  const [value] = useState<number>(8.966);
  const [mentors, setMentors] = useState([]);

  const courseScrollRef = useRef(null);
  const mentorScrollRef = useRef(null);

  const scroll = (ref: any, direction: string) => {
    const { current } = ref;
    if (direction === 'left') {
      current.scrollBy({ left: -400, behavior: 'smooth' });
    } else if (direction === 'right') {
      current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const mentorsdata = [
    {
      name: 'Ayesha Khan',
      title: 'Senior Program Manager at Upstart',
      email: 'example@gmail.comm',
      experience: 20,
      reviews: 0,
    },
    {
      name: 'Ayesha Khan',
      title: 'Senior Program Manager at Upstart',
      email: 'example@gmail.comm',
      experience: 20,
      reviews: 0,
    },
    {
      name: 'Ayesha Khan',
      title: 'Senior Program Manager at Upstart',
      email: 'example@gmail.comm',
      experience: 20,
      reviews: 0,
    },
    {
      name: 'Ayesha Khan',
      title: 'Senior Program Manager at Upstart',
      email: 'example@gmail.comm',
      experience: 20,
      reviews: 0,
    },
    {
      name: 'Ayesha Khan',
      title: 'Senior Program Manager at Upstart',
      email: 'example@gmail.comm',
      experience: 20,
      reviews: 0,
    },
    {
      name: 'Ayesha Khan',
      title: 'Senior Program Manager at Upstart',
      email: 'example@gmail.comm',
      experience: 20,
      reviews: 0,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          'https://dev-2-winn.vercel.app/api/users/mentor/api/',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const users = await res.json();
        setMentors(users);
        console.log(users);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <section className="flex size-full flex-col gap-5 pb-6 2xl:mx-auto 2xl:w-[1500px]">
      <Header />

      <div className="grid grid-cols-4 gap-8 text-black/80">
      
        <section className="col-span-4">
          <div
            className="scrollbar-hidden flex gap-4 overflow-x-scroll"
            ref={courseScrollRef}
          >
            {courses.map((card: Course) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <IoIosArrowBack
              size={27}
              className="cursor-pointer rounded-full p-1 transition-all duration-500 hover:bg-black/10"
              onClick={() => scroll(courseScrollRef, 'left')}
            />
            <IoIosArrowForward
              size={27}
              className="cursor-pointer rounded-full p-1 transition-all duration-500 hover:bg-black/10"
              onClick={() => scroll(courseScrollRef, 'right')}
            />
          </div>{' '}
        </section>

        <div className="col-span-4 flex flex-col gap-5 md:flex-row ">
          <div className="flex-1 space-y-4 overflow-x-hidden p-3">
            <h1 className="text-[1.5rem] font-bold">Your Top Mentor Matches</h1>
            <div className="flex justify-between rounded-lg bg-slate-50 p-4">
              <p className="font-bold text-gray-400">
                Still want to explore great matches?
              </p>
              <p className="cursor-pointer text-[1rem] font-medium text-purple-500">
                Explore mentors
              </p>
            </div>
            <div
              className="scrollbar-hidden flex gap-4 overflow-x-scroll"
              ref={mentorScrollRef}
            >
              {mentorsdata?.map((mentor, index) => (
                <UserCard key={index} data={mentor} />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <IoIosArrowBack
                size={27}
                className="cursor-pointer rounded-full p-1 transition-all duration-500 hover:bg-black/10"
                onClick={() => scroll(mentorScrollRef, 'left')}
              />
              <IoIosArrowForward
                size={27}
                className="cursor-pointer rounded-full p-1 transition-all duration-500 hover:bg-black/10"
                onClick={() => scroll(mentorScrollRef, 'right')}
              />
            </div>
          </div>
          <div className="w-full md:w-[300px]">
            <h1 className="mb-4 text-xl font-bold">Performance</h1>
            <Speedometer value={value} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
