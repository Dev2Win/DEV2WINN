import React from 'react';
import AnswerCard from './AnswerCard';

const AnswerList = ({ answers }:any) => {
  return (
    <div className="space-y-4">
      {answers.map((answer:any) => (
        <AnswerCard key={answer.id} answer={answer} />
      ))}
    </div>
  );
};

export default AnswerList;
