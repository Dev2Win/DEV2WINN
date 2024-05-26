import React from 'react';
import { GoBook } from 'react-icons/go';
import { LuUsers2 } from "react-icons/lu";
import { BiNotepad } from "react-icons/bi";

type CardProps = {
  icon: any;
  title: string;
  booksCount: number;
  studentsCount: number;
  assignmentCounts: number;
};

const Card = ({ card }: CardProps) => {
  return (
    <div className="text-gray-700 p-6 rounded-xl min-w-fit" style={{ backgroundColor: card.bgColor }}>
      <div className="bg-white p-2 rounded-full w-fit">
        <card.icon size={30} style={{ color: card.bgColor }}/>
      </div>
      <h1 className="font-bold text-xl my-4">{card.title}</h1>
      <div className="bg-white px-6 py-3 rounded-lg items-center flex w-fit gap-4 text-gray-700 font-semibold">
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
    </div>
  );
};

export default Card;
