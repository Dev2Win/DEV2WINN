import React, { useState, useEffect } from 'react';

type Props = {
  handleModuleClick: (moduleId: string) => void;
  handleSubmoduleClick: (submoduleId: string) => void;
  selectedModuleId: string;
  selectedSubmoduleId: string;
  module: {
    id: string;
    title: string;
    submodules: {
      id: string;
      title: string;
    }[];
  };
};

const Roadmap = ({
  module,
  selectedModuleId,
  selectedSubmoduleId,
  handleModuleClick,
  handleSubmoduleClick,
}: Props) => {
  
  const isModuleSelected = selectedModuleId === module.id;
  const [maxHeight, setMaxHeight] = useState(isModuleSelected ? '1000px' : '0px');

  useEffect(() => {
    setMaxHeight(isModuleSelected ? '1000px' : '0px');
  }, [isModuleSelected]);

  return (
    <div key={module.id} className="flex flex-col gap-4 my-6">
      <h1
        className={`pl-4 cursor-pointer font-bold text-purple-900 ${
          isModuleSelected ? 'bg-purple-1/10 border-l-4 border-purple-900' : ''
        }`}
        onClick={() => handleModuleClick(module.id)}
      >
        {module.title}
      </h1>
      <div
        className={`ml-4 transition-all duration-1000 ease-in-out`}
        style={{
          maxHeight: maxHeight,
          opacity: isModuleSelected ? 1 : 0,
          overflow: 'hidden',
        }}
      >
        {module.submodules.map((submodule) => (
          <h2
            key={submodule.id}
            className={`cursor-pointer ml-4 text-sm ${
              selectedSubmoduleId === submodule.id
                ? 'text-purple-900 font-bold'
                : 'font-semibold text-gray-700'
            }`}
            onClick={() => handleSubmoduleClick(submodule.id)}
          >
            {submodule.title}
          </h2>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
