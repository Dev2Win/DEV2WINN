// dashboard must be two , one for mentors and one for mentee
//  when a user signs in it should know the usertype and navigate to its respective dashboard
// ensure authorization to requests

'use client'
import Header from '@/components/lms/Header';
import React, { useState } from 'react';
import Card from '@/components/lms/Card';
import { cardData, todoListData } from '@/lib/utils';
import Barchart from '@/components/lms/BarChart';
import Profile from '@/components/lms/Profile';
import Todo from '@/components/lms/Todo';
import Speedometer from '@/components/lms/Speedometer';
import { TodosProps } from '@/components/lms/Todo';

type CardProps = {
  icon: any;
  title: string;
  booksCount: number;
  studentsCount: number;
  assignmentCounts: number;
};




const Home = () => {
  const [value, setValue] = useState<number>(8.966);

  return (
    <section className="flex size-full flex-col gap-5">
      <Header />
      <div className="text-black grid grid-cols-4 gap-12">

        <section className="col-span-4 lg:col-span-3 flex flex-col gap-8">
          <div className="flex gap-4 overflow-x-scroll scrollbar-hidden">
            {cardData.map((card: CardProps) => (
              <Card key={card.title} card={card} />
            ))}
          </div>

          <div className="col-span-2 grid grid-cols-5 gap-6">

            <div className="col-span-5 lg:col-span-3 text-gray-800">
              <h1 className="font-bold text-xl mb-4">Hours spent</h1>
              <div className="border border-gray-300 rounded-lg text-black p-4">
                <Barchart />
              </div>
            </div>

            <div className="col-span-5 lg:col-span-2 ">
              <h1 className='font-bold text-xl mb-4'>Performance</h1>
                <Speedometer value={value}/>
            </div>
          </div>
        </section>

        <section className="col-span-4 lg:col-span-1 flex flex-col sm:flex-row lg:flex-col gap-6">
          <div >
            <Profile/>
          </div>
          <div className='w-full h-[2px] hidden lg:block bg-gray-300 my-4'></div>

          <div>
            <h1 className='font-bold text-xl mb-4 mt-6'>To-do List</h1>
            {todoListData.map((todos) => (
              <Todo key={todos.title} todos={todos}/>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Home;
