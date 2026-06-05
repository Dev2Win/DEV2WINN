import { IoMdAnalytics } from "react-icons/io";
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export const footerLinks = {
  Overview: [
    {
      name: "Home",
      path: "/",
      key: "home",
    },
    {
      name: "About Us",
      path: "/about",
      key: "about",
    },
    {
      name: "Contact",
      path: "/contact",
      key: "contact",
    }
  ],
  Careers: [
    {
      name: "Software Engineering",
      path: "/software-engineering",
      key: "software-engineering",
    },
    {
      name: "Business Intelligence",
      path: "/business-intelligence",
      key: "business-intelligence",
    },
    {
      name: "UI/UX",
      path: "/ui-ux",
      key: "ui-ux",
    },
    {
      name: "AI/ML",
      path: "/ai-ml",
      key: "ai-ml",
    },
    {
      name: "Data Analysis",
      path: "/data-analysis",
      key: "data-analysis",
    },
  ]
  
}


export const cardData = [
  { 
    icon: IoMdAnalytics,
    title: "Software Engineering",
    booksCount: 120,
    studentsCount: 45,
    assignmentCounts: 30,
    bgColor: 'rgba(131, 14, 249, 0.2)', 
  },
  {
    icon: IoMdAnalytics,
    title: "UI/UX Design",
    booksCount: 150,
    studentsCount: 50,
    assignmentCounts: 25,
    bgColor: 'rgba(80, 168, 50, 0.2)', 
  },
  {
    icon: IoMdAnalytics,
    title: "Business Intelligence",
    booksCount: 100,
    studentsCount: 40,
    assignmentCounts: 20,
    bgColor: 'rgba(28, 31, 46, 0.2)', 
  },
  {
    icon: IoMdAnalytics,
    title: "Data Analysis",
    booksCount: 80,
    studentsCount: 60,
    assignmentCounts: 15,
    bgColor: 'rgba(201, 22, 2, 0.2)', 
  },
  {
    icon: IoMdAnalytics,
    title: "AI/ML",
    booksCount: 60,
    studentsCount: 30,
    assignmentCounts: 10,
    bgColor: 'rgba(14, 120, 249, 0.2)', 
  }
];

export const todoListData = [
  {
    title: "Developing Restaurant Apps",
    time: "8:00 AM",
    tasks: [
      { task: "Integrate API", completed: false },
      { task: "Slicing Home Screen", completed: true },
    ],
    category: 'Programming',
    completed: false
  },
   {
    title: "Research Objective User",
    time: "10:00 AM",
    category: "Product Design",
    completed: false
  },
   {
    title: "Report Analysis P2P Business",
    time: "12:00 AM",
    tasks: [
      { task: "Integrate API", completed: false },

    ],
    category: 'Programming',
    completed: true
  },
];





