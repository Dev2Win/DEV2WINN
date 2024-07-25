'use client';
import QuestionCard from '@/components/explore/QuestionCard';
import { posts } from '@/lib/lmscontent';
import React from 'react';

const page = () => {
  return (
    <>
      <h1 className=" p-3  text-3xl font-bold">Career Topics</h1>
      <div className=" grid grid-cols-3 gap-4">
        {posts.map((card: any) => (
          <QuestionCard key={card.id} card={card} />
        ))}
      </div>
    </>
  );
};

export default page;
