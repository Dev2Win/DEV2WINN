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