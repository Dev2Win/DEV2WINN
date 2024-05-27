'use client';
import { useState, ReactNode } from 'react';

// Define types for tab and tabs
type TabType = {
  title: string;
  content: ReactNode;
  value: number | string;
};

type TabsType = TabType[];

// Tabs component that handles rendering different tabs
const Tabs = ({ tabs }: { tabs: TabsType }) => {
  // State to track the currently selected tab
  const [currentTab, setCurrentTab] = useState(0);

  // Function to handle tab click and update the selected tab
  const handleTabClick = (tabId: number) => {
    setCurrentTab(tabId);
  };

  return (
    <div className="">
      {/* Render tab buttons */}
      <div className="flex justify-start gap-3 border-b-2 border-gray-100">
        {tabs.map((tab: TabType, index: number) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`py-10 px-1 lg:px-4 pt-[20px] w-max lg:w-[max]  h-[50px] text-[16px]  lg:text-[18px] ${
              currentTab === index
                ? '  border-b-4 border-purple-1 font-manrope  text-purple-1 '
                : 'text-gray-700 '
            }`}
          >
            <div className=" flex items-center gap-2">
              <p>{tab.title}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Render the content of the selected tab */}
      <div className=" mt-[10px] ">{tabs[currentTab].content}</div>
    </div>
  );
};

export default Tabs;
