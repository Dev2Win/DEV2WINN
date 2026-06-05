import React, { useState } from 'react';

const AnswerCard = ({ answer }: any) => {
  const [votes, setVotes] = useState(answer.votes);

  const handleUpvote = () => {
    setVotes(votes + 1);
    // Here you would typically call an API to update the vote count
  };

  const handleDownvote = () => {
    setVotes(votes - 1);
    // Here you would typically call an API to update the vote count
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center">
        <img
          src={answer.user.avatar}
          alt={answer.user.name}
          className="mr-4 h-10 w-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{answer.user.name}</h3>
          <p className="text-sm text-gray-500">{answer.createdAt}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-700">{answer.content}</p>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleUpvote}
          className="text-gray-500 hover:text-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <span className="font-semibold">{votes}</span>
        <button
          onClick={handleDownvote}
          className="text-gray-500 hover:text-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AnswerCard;
