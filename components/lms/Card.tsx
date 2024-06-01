import React from 'react';
import { GoBook } from 'react-icons/go';
import { LuUsers2 } from "react-icons/lu";
import { BiNotepad } from "react-icons/bi";
import Link from 'next/link';

// kindly resolve typescript properly  

// type CardProps = {
//   icon: any;
//   title: string;
//   booksCount: number;
//   studentsCount: number;
//   assignmentCounts: number;
// };

const Card = ({ card }:any) => {
  return (
    <Link href={`/learning-materials`} className="min-w-fit rounded-xl p-6 text-gray-700" style={{ backgroundColor: card.bgColor }}>
      <div className="w-fit rounded-full bg-white p-2">
        <card.icon size={30} style={{ color: card.bgColor }}/>
      </div>
      <h1 className="my-4 text-xl font-bold">{card.title}</h1>
      <div className="flex w-fit items-center gap-4 rounded-lg bg-white px-6 py-3 font-semibold text-gray-700">
        <article className="flex items-center gap-2">
          <GoBook size={20}/>
          <small>{card.booksCount}</small>
        </article>

        <div className='h-[16px] w-[2px] bg-gray-300'></div>

        <article className="flex items-center gap-2">
          <BiNotepad size={20}/>
          <small>{card.assignmentCounts}</small>
        </article>

        <div className='h-[16px] w-[2px] bg-gray-300'></div>

        <article className="flex items-center gap-2">
          <LuUsers2 size={18}/>
          <small>{card.studentsCount}</small>
        </article>
      </div>
    </Link>
  );
};

export default Card;
