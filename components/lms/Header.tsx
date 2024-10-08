'use client';

import { Input, Paper } from '@mantine/core';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';
import NotificationPopup from '../notication/NotificationPopup';
import { useState } from 'react';

import Popup from '../reusables/Popup';

export default function Header() {
const  [isOpen,setOpen] = useState(false)
  return (
    <header className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-gray-800 w-full mx-auto">
      <div className="flex flex-col">
        <h1 className="font-bold text-xl">Hello Dev 👋</h1>
        <p className="text-[14px] text-gray-600">
          Lets learn something new today!
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          size="sm"
          placeholder="Search for courses..."
          className="bg-white border-none shadow-md outline-purple-1 text-black"
          rightSection={<FiSearch size={18} />}
          name="search"
        />
        <div className="shadow-md cursor-pointer">
          <Paper shadow="xs" className="relative p-[9px] border border-gray-300">
            <IoNotificationsOutline onClick={()=> setOpen(!isOpen)} className="text-[#818891]" />
            <div className="w-1 h-1 bg-red-500 rounded-full absolute top-[12px] right-[12px]" />
          </Paper>
        </div>
        <Popup
          isOpen={isOpen}
          onClose={() => setOpen(!isOpen)}
          title="notification"
          
        >
          <NotificationPopup/>

          </Popup>
        <button type="submit" hidden>
          Submit
        </button>
      </div>
    </header>
  );
}
