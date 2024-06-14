// src/components/NotificationPopup.jsx
import React, { useState } from 'react';

const notifications = [
  {
    id: 1,
    title: 'Don Norman’s exclusive interview video is available today',
    type: 'red',
    url: '#'
  },
  {
    id: 2,
    title: 'We just Winter 2023 Release!',
    type: 'rocket',
    url: '#'
  },
  {
    id: 3,
    title: 'Introducing  Longer-Term Mentorship',
    type: 'rocket',
    url: '#'
  }
];

const NotificationPopup = () => {


  return (
    <div className="">
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gray-200 p-2 rounded-full"
      >
        <span className="material-icons">notifications</span>
        {isOpen && <span className="ml-2">3</span>}
      </button> */}

      
        <div className="">
          <div className="p-4">
           
            {notifications.map((notification) => (
              <div key={notification.id} className="mb-2">
                <a href={notification.url} className="flex items-start">
                  {/* <span className={`material-icons mr-2 ${notification.type === 'red' ? 'text-red-500' : 'text-blue-500'}`}>
                    {notification.type === 'red' ? 'circle' : 'rocket'}
                  </span> */}
                  <span>{notification.title}</span>
                </a>
              </div>
            ))}
          </div>
          {/* <div className="px-4 py-2 bg-gray-100 text-right">
            <button onClick={() => alert('All notifications marked as read')} className="text-blue-500">Mark all as read</button>
          </div> */}
        </div>
     
    </div>
  );
};

export default NotificationPopup;
