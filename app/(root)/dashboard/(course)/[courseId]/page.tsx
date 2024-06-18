'use client';

import { courses } from '@/lib/lmscontent';
import { IoBookOutline } from 'react-icons/io5';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Submodule, Course, Module } from '../../page';



const Page = () => {
  const params= useParams();
  const courseId = params.courseId as string

  const course = courses.find((course: Course) => course.id === parseInt(courseId));

  return (
    <main className="flex flex-col items-center justify-center gap-6">
      {course && (
        <>
          <Image
            src={course.courseLogo}
            alt="course logo"
            width={150}
            height={150}
          />
          <h1 className="text-2xl font-bold text-gray-700 sm:text-3xl">
            {course.title}
          </h1>

          <div>
            {course.courseroadmap.map((module: Module) => (
              <div
                key={module.id}
                className="my-6 flex w-[300px] flex-col gap-4 rounded-lg bg-white shadow-sm sm:w-[32rem]"
              >
                <h1 className="border-b border-gray-300 p-4 pb-6 text-xl font-bold">
                  {module.title}
                </h1>
                <div>
                  {module.submodules.map((submodule: Submodule) => (
                    <Link
                      key={submodule.id}
                      href={`/dashboard/${courseId}/${submodule.id}`}
                      className="my-4 flex items-start gap-2 rounded-md px-4 py-2 text-gray-700 hover:bg-black/10 sm:items-center"
                    >
                      <IoBookOutline size={20} />
                      <h2>{submodule.title}</h2>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Page;
