'use client';

import Navbar from '@/components/shared/Navbar';
import { course } from '@/lib/lmscontent';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const Page = () => {
  const { coursedetail } = useParams();

  const courseDetailId = parseFloat(coursedetail);


  let submoduleDetail = null;
  let moduleDetail = null;

  for (const module of course.courseroadmap) {
    for (const submodule of module.submodules) {
      if (submodule.id === courseDetailId) {
        submoduleDetail = submodule;
        moduleDetail = module;
        break;
      }
    }
    if (submoduleDetail) break;
  }

  if (!submoduleDetail) {
    return (
      <div className="flex h-screen items-center justify-center text-3xl font-bold">
        Module not found
      </div>
    );
  }

  return (
    <main className="w-full">
      <div className="fixed left-0 right-0 top-0 h-[80px] shadow-md">
        <Navbar />
      </div>

      <section className="mt-[80px] flex h-screen flex-col gap-6 overflow-y-scroll bg-black/5">
        <div className="mx-auto mt-10 w-[90%]">
          <div className="flex items-center gap-4">
            <Image
              src={course.courseLogo}
              alt="course logo"
              width={80}
              height={80}
            />
            <div className="text-gray-700">
              <h1 className="text-xl font-bold">{moduleDetail?.title}</h1>
              <h1 className="">{course.courseTitle}</h1>
            </div>
          </div>

          <div className="mt-6">
            <div key={submoduleDetail.id} className="mb-4">
              <h2 className="text-lg font-semibold">{submoduleDetail.title}</h2>
              <p>{submoduleDetail.content}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
