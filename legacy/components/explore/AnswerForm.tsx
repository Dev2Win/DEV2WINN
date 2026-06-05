import React, { useState } from 'react';

const AnswerForm = () => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Handle answer submission logic here
    console.log('Submitted answer:', answer);
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        className="w-full rounded-md border border-gray-300 p-2"
       
        placeholder="Write your answer..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      ></textarea>
      <button
        type="submit"
        className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Post answer
      </button>
    </form>
  );
};

export default AnswerForm;
