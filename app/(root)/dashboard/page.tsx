// dashboard must be two , one for mentors and one for mentee
//  when a user signs in it should know the usertype and navigate to its respective dashboard
// ensure authorization to requests

'use client'
import Header from '@/components/lms/Header';
import React, { useState } from 'react';
import Card from '@/components/lms/Card';
import { todoListData } from '@/lib/utils';
import { courses } from '@/lib/lmscontent';
import Barchart from '@/components/lms/BarChart';
import Todo from '@/components/lms/Todo';
import Speedometer from '@/components/lms/Speedometer';
import { StaticImageData } from 'next/image';



export type Submodule = {
  id: number;
  title: string;
  content: string;
}

export type Module = {
  id: number;
  title: string;
  submodules: Submodule[];
}

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
}


const Home = () => {
  const [value] = useState<number>(8.966);

  return (
    <section className="flex size-full flex-col gap-5 2xl:w-[1500px] 2xl:mx-auto">
      <Header />

      <div className="grid grid-cols-4 gap-8 text-black/80">

        <section className="col-span-4">
          <div className="scrollbar-hidden flex gap-4 overflow-x-scroll">
            {courses.map((card: Course) => (
              <Card key={card.id} card={card} />
            ))}
          </div>
          </section>

          <div className="col-span-4 lg:col-span-3 grid grid-cols-10 gap-6">
                <div className="col-span-10 text-gray-800 md:col-span-5 lg:col-span-6">
                 <h1 className="mb-4 text-xl font-bold">Hours spent</h1>
                   <div className="rounded-lg border border-gray-300 p-4 text-black">
                    <Barchart />
                   </div>
                </div>
                            
            <div className="col-span-10  md:col-span-5 lg:col-span-4">
              <h1 className='mb-4 text-xl font-bold'>Performance</h1>
                <Speedometer value={value}/>
            </div>
         </div>  

         <div className='col-span-4 lg:col-span-1 '>
            <h1 className='mb-4 mt-6 text-xl font-bold'>To-do List</h1>
            {todoListData.map((todos:any) => (
              <Todo key={todos.title} todos={todos}/>
            ))}
          </div>    
      </div>
    </section>
  );
};

export default Home;
