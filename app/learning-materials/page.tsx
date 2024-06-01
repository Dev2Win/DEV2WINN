'use client';

import React, { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { roadmap } from '@/lib/lmscontent';
import { MdOutlineMenu, MdClose } from "react-icons/md";
import Roadmap from '@/components/lms/Roadmap';

const Page = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(roadmap[0].id);
  const [selectedSubmoduleId, setSelectedSubmoduleId] = useState(roadmap[0].submodules[0].id);

  const handleModuleClick = (moduleId: string) => {
    const foundModule = roadmap.find(module => module.id === moduleId);
    const firstSubmodule = foundModule?.submodules && foundModule.submodules[0];
    setSelectedModuleId(moduleId);
    setSelectedSubmoduleId(firstSubmodule?.id || '');
  };

  const handleSubmoduleClick = (submoduleId: string) => {
    setSelectedSubmoduleId(submoduleId);
    setShowMenu(false);
  };

  const selectedModule = roadmap.find(module => module.id === selectedModuleId);
  const selectedSubmodule = selectedModule?.submodules.find(submodule => submodule.id === selectedSubmoduleId);

  return (
    <main className="w-full">
      <div className="fixed top-0 left-0 right-0 h-[80px] shadow-md">
        <Navbar />
      </div>

      <section className="flex gap-6 mt-[80px]">
        <div className="fixed left-0 top-[80px] w-[300px] overflow-y-scroll hidden lg:block bg-purple-100 pt-6 h-[100vh]">
          {roadmap.map((module) => (
            <div key={module.id}>
              <Roadmap
                module={module}
                selectedModuleId={selectedModuleId}
                selectedSubmoduleId={selectedSubmoduleId}
                handleModuleClick={handleModuleClick}
                handleSubmoduleClick={handleSubmoduleClick}
              />
            </div>
          ))}
        </div>

        <div className="w-full flex items-start gap-3 h-screen overflow-y-scroll fixed left-0 lg:left-[300px] right-6 p-4 ">
          <MdOutlineMenu 
            className="text-gray-700 lg:hidden" 
            size={34} 
            onClick={() => setShowMenu(true)} 
          />

          <div className='pr-6'>
            <h1 className="text-xl font-bold mb-2">
              {selectedSubmodule?.title}
            </h1>
            <h1>{selectedSubmodule?.content}</h1>
          </div>

        </div>
      </section>

      {showMenu && (
        <div className='flex bg-purple-100 items-start justify-center gap-6 fixed left-0 top-0 w-[80%] sm:w-[400px] overflow-y-scroll'>
          <div className="pt-6 h-[100vh] z-50">
            {roadmap.map((module) => (
              <div key={module.id}>
              <Roadmap
                module={module}
                selectedModuleId={selectedModuleId}
                selectedSubmoduleId={selectedSubmoduleId}
                handleModuleClick={handleModuleClick}
                handleSubmoduleClick={handleSubmoduleClick}
              />
            </div>
            ))}
          </div>
          <MdClose 
            className="text-black m-4" 
            size={34} onClick={() => setShowMenu(false)} 
          />
        </div>
      )}
    </main>
  );
};

export default Page;
