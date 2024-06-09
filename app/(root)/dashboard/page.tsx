// dashboard must be two , one for mentors and one for mentee
//  when a user signs in it should know the usertype and navigate to its respective dashboard
// ensure authorization to requests

'use client'
import Header from '@/components/lms/Header';
import React, { useState } from 'react';
import Card from '@/components/lms/Card';
import { cardData, todoListData } from '@/lib/utils';
import Barchart from '@/components/lms/BarChart';
import Todo from '@/components/lms/Todo';
import Speedometer from '@/components/lms/Speedometer';
import UserCard from '@/components/users/UserCard';
import image from '@/public/images/aboutImage.webp'


type CardProps = {
  icon: any;
  title: string;
  booksCount: number;
  studentsCount: number;
  assignmentCounts: number;
};


const Home = () => {
  const [value] = useState<number>(8.966);
  const mentors = [
    {
      image: image,
      name: 'Ayesha Khan',
      title: 'Senior Program Manager at Upstart',

      experience: 20,
      reviews: 0,
    },
    {
      image: image,
      name: 'Ayesha Khan',
      title: 'Senior Program Manager at Upstart',

      experience: 20,
      reviews: 0,
    },
    {
      image: image,
      name: 'Ayesha Khan',
      title: 'Senior Program Manager at Upstart',

      experience: 20,
      reviews: 0,
    },
    // Add more mentor data as needed
  ];

  return (
    <section className="flex size-full flex-col gap-5 2xl:w-[1500px] 2xl:mx-auto">
      <Header />

      <div className="grid grid-cols-4 gap-8 text-black/80">

        <section className="col-span-4">
          <div className="scrollbar-hidden flex gap-4 overflow-x-scroll">
            {cardData.map((card: CardProps) => (
              <Card key={card.title} card={card} />
            ))}
          </div>
          </section>


          <div className="col-span-4 flex gap-5 ">
                {/* <div className="col-span-10 text-gray-800 md:col-span-5 lg:col-span-6">
                 <h1 className="mb-4 text-xl font-bold">Hours spent</h1>
                   <div className="rounded-lg border border-gray-300 p-4 text-black">
                    <Barchart />
                   </div>
                </div> */}
              <div className=" space-y-4 p-3 ">
              <h1 className=' font-bold text-[1.5rem]'> Your Top Mentor Matches</h1>
              <div className=" flex  bg-slate-50 p-4 rounded-lg justify-between">
               <p className='  font-bold text-gray-400'>Still want to explore great matches? </p>
               <p className='  font-medium text-purple-500 text-[1rem]  cursor-pointer'>Explore mentors</p>
              </div>
<div className="flex gap-4">
  
{mentors.map((mentor, index) => (
          <UserCard
            key={index}
            data={mentor}
          />
        ))}
</div>
               
                </div>             
            <div className="">
              <h1 className='mb-4 text-xl font-bold'>Performance</h1>
                <Speedometer value={value}/>
            </div>
         </div>  

         {/* <div className='col-span-4 lg:col-span-1 '>
            <h1 className='mb-4 mt-6 text-xl font-bold'>To-do List</h1>
            {todoListData.map((todos:any) => (
              <Todo key={todos.title} todos={todos}/>
            ))}
          </div>     */}
      </div>
    </section>
  );
};

export default Home;
