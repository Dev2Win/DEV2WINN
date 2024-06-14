'use client';

import { courses } from '@/lib/lmscontent';
import { useParams, useRouter } from 'next/navigation';
import { Submodule, Course, Module } from '../../../page';
import { BsArrowRightShort, BsArrowLeftShort } from 'react-icons/bs';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const courseDetailId = parseFloat(params.courseDetail as string);

  let foundSubmodule: Submodule | undefined;
  let currentModule: Module | undefined;
  let currentCourse: Course | undefined;

  for (const course of courses) {
    for (const module of course.courseroadmap) {
      const submodule = module.submodules.find(
        (sub) => sub.id === courseDetailId,
      );
      if (submodule) {
        foundSubmodule = submodule;
        currentModule = module;
        currentCourse = course;
        break;
      }
    }
    if (foundSubmodule) break;
  }

  const getNextSubmoduleId = () => {
    if (!currentModule) return null;
    const currentIndex = currentModule.submodules.findIndex(
      (sub) => sub.id === courseDetailId
    );
    if (currentIndex < currentModule.submodules.length - 1) {
      return currentModule.submodules[currentIndex + 1].id;
    }
    return null;
  };

  const getPreviousSubmoduleId = () => {
    if (!currentModule) return null;
    const currentIndex = currentModule.submodules.findIndex(
      (sub) => sub.id === courseDetailId
    );
    if (currentIndex > 0) {
      return currentModule.submodules[currentIndex - 1].id;
    }
    return null;
  };

  const nextSubmoduleId = getNextSubmoduleId();
  const previousSubmoduleId = getPreviousSubmoduleId();

  const handleNavigation = (submoduleId: number | null) => {
    if (submoduleId !== null) {
      router.push(`${submoduleId}`);
    }
  };

  return (
    <section>
      {foundSubmodule ? (
        <div>
          <div>
            <h1 className="mb-3 text-3xl font-bold">{foundSubmodule.title}</h1>
            <p>{foundSubmodule.content}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            {previousSubmoduleId !== null && (
              <div
                className="cursor-pointer rounded-sm border border-gray-400 px-4 py-1"
                onClick={() => handleNavigation(previousSubmoduleId)}
              >
                <p>Previous Lesson</p>
              </div>
            )}

            {nextSubmoduleId !== null && (
              <div
                className="cursor-pointer rounded-sm border border-gray-400 px-4 py-1"
                onClick={() => handleNavigation(nextSubmoduleId)}
              >
                <p>Next Lesson</p>
              </div>
            )}
          </div>
          
        </div>
      ) : (
        <h1 className="text-center text-3xl font-bold">Submodule not found</h1>
      )}
    </section>
  );
};

export default Page;
