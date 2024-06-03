'use client'

import Navbar from '@/components/shared/Navbar';
import { course } from '@/lib/lmscontent';
import { IoBookOutline } from 'react-icons/io5';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const page = () => {

  const { courseName } = useParams();

  return (
    <main className="w-full bg-black/5">
      <div className="fixed left-0 right-0 top-0 h-[80px] shadow-md">
        <Navbar />
      </div>

      <section className="mx-[5%] mt-[80px] flex w-[90%] flex-col items-center justify-center gap-6 pt-10">
        <Image
          src={course.courseLogo}
          alt="course logo"
          width={150}
          height={150}
        />
        <h1 className="text-2xl font-bold text-gray-700 sm:text-3xl">
          {course.courseTitle}
        </h1>

        <div>
          {course.courseroadmap.map((module) => (
            <div
              key={module.id}
              className="my-6 flex w-[300px] flex-col gap-4 rounded-lg bg-white shadow-sm sm:w-[32rem]"
            >
              <h1 className="border-b border-gray-300 p-4 pb-6  text-xl font-bold">
                {module.title}
              </h1>
              <div className="">
                {module.submodules.map((submodule) => (
                  <Link
                    href={`${module.title}/${submodule.id}`}
                    className="my-4  flex items-start gap-2 rounded-md px-4 py-2 text-gray-700 hover:bg-black/10 sm:items-center"
                  >
                    <IoBookOutline size={20} />
                    <h2>{submodule.title}</h2>
                  </Link>
                ))}
              </div>
            </div>
          ))}{' '}
        </div>
      </section>
    </main>
  );
};

export default page;
