import Image, { StaticImageData } from 'next/image';
import React from 'react';
import star from '@/public/images/Simon.webp';

interface Review {
  date: string;
  review: string;
  attributes: string[];
  author: string;
  role: string;
  company: string;
  image: StaticImageData; // Add image field
}

const reviews: Review[] = [
  {
    date: 'February 28, 2024',
    review:
      'My first time speaking with Joshua and his problem-solving approach gave me the assurance that he is indeed a good mentor.',
    attributes: [
      'Technically competent',
      'Amazing problem solver',
      'Very motivational',
      //   'Great communicator',
    ],
    author: 'Peculiar Okoro',
    role: 'Product Design Intern',
    company: 'Devs and Designs',
    image: star, // Replace with actual image URL
  },
  {
    date: 'February 17, 2024',
    review:
      'The group session we had with Joshua was insightful as members of my group who are totally new to tech/UI & UX had their doubts resolved and were able to define a path for themselves after the session. Thanks to Joshua’s resourceful insight.',
    attributes: [],
    author: 'Samson Ejiro',
    role: 'UI/UX Designer & Data Analyst',
    company: 'Code Nation',
    image: star, // Replace with actual image URL
  },
];

const Reviews: React.FC = () => {
  return (
    <div className=" rounded-md bg-gray-100">
      {reviews.map((review, index) => (
        <div key={index} className="bg-white p-6  ">
          <p className="text-sm text-gray-500">{review.date}</p>
          <p className="mt-2 text-gray-900">{review.review}</p>
          <div className="flex space-x-2 mt-2">
            {review.attributes.map((attr, idx) => (
              <span
                key={idx}
                className=" rounded-md bg-purple-1/40 p-2 max-md:w-full max-md:text-xs text-sm text-white"
              >
                😊{attr}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center">
            <Image
              src={review.image}
              width={48}
              height={48}
              alt={review.author}
              className="mr-4 h-12 w-12 rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{review.author}</p>
              <p className="text-gray-500">
                {review.role}, {review.company}
              </p>
            </div>
          </div>
          <hr className="mt-8"></hr>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
