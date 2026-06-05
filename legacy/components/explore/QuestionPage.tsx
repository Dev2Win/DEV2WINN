import React from 'react';
import AnswerList from './AnswerList';
import AnswerForm from './AnswerForm';

const QuestionPage = ({ question }: any) => {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">{question.title}</h1>
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <p className="text-gray-700">{question.content}</p>
      </div>
      <AnswerForm />
      <AnswerList answers={question.answers} />
    </div>
  );
};

export default QuestionPage;
