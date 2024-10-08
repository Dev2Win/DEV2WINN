import Simon from "@/public/images/Simon.webp"
import Kwabena from "@/public/images/Kwabena.webp"
import Asmah from "@/public/images/Asma.webp"
import Prince from "@/public/images/Prince.webp"
import Jeffery from "@/public/images/Jeffery.webp"
import Michael from "@/public/images/Michael.webp"

import {
    Img01, Img02, Img03, 
    Img04, Img05, Img06,
    Img07, Img08, Img09, Img10
  } from "@/public/images"
  

export const featureData = [
    {
        icon: (
            <div className="bg-[#F6F4FF] w-[20%] flex flex-row items-center justify-center py-2
            rounded-md">
                <div className="w-[32px] h-[32px]" dangerouslySetInnerHTML={{ __html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" weight="fill"><path d="M228.7,88A15.9,15.9,0,0,0,224,76.7L179.3,32a16.1,16.1,0,0,0-22.6,0L36.7,152a16,16,0,0,0-3.6,5.4l-.3.8a17,17,0,0,0-.8,5.1V208a16,16,0,0,0,16,16H92.7a14.4,14.4,0,0,0,5.1-.9l.8-.2a16,16,0,0,0,5.4-3.6l83.7-83.7,3.4,13.9-36.8,36.8a8.1,8.1,0,0,0,0,11.4,8.2,8.2,0,0,0,11.4,0l40-40a8.5,8.5,0,0,0,2.1-7.6l-6.9-27.6L224,99.3A15.9,15.9,0,0,0,228.7,88ZM192,108.7,147.3,64,168,43.3,212.7,88Z"></path></g></svg>
                `}} />
            </div>
        ),
        name: "Hands-on Learning",
        desc: "Engage in practical projects to develop real-world skills.",
        key: "hands-on-learning"
    },
    {
        icon: (
            <div className="bg-[#F6F4FF] w-[20%] flex flex-row items-center justify-center py-2
            rounded-md">
                <div className="w-[32px] h-[32px]" dangerouslySetInnerHTML={{ __html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" weight="fill"><path d="M176,16H80A24.1,24.1,0,0,0,56,40V216a24.1,24.1,0,0,0,24,24h96a24.1,24.1,0,0,0,24-24V40A24.1,24.1,0,0,0,176,16ZM80,32h96a8,8,0,0,1,8,8v8H72V40A8,8,0,0,1,80,32Zm96,192H80a8,8,0,0,1-8-8v-8H184v8A8,8,0,0,1,176,224Z"></path></g></svg>
                `}} />
            </div>
        ),
        name: "Personalized Mentorship",
        desc: "Receive guidance tailored to your career goals and aspirations.",
        key: "personalized-mentorship"
    },
    {
        icon: (
            <div className="bg-[#F6F4FF] w-[20%] flex flex-row items-center justify-center py-2
            rounded-md">
                <div className="w-[32px] h-[32px]" dangerouslySetInnerHTML={{ __html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" weight="fill"><path d="M104,16h48a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16Z"></path><path d="M128,32a96,96,0,1,0,96,96A96.2,96.2,0,0,0,128,32Zm45.3,62.1-39.6,39.6a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4l39.6-39.6a8.1,8.1,0,1,1,11.4,11.4Z"></path></g></svg>
                `}} />
            </div>
        ),
        name: "AI-Powered Support",
        desc: "Benefit from our innovative AI mentors to enhance your learning experience.",
        key: "ai-powered-support"
    },
    {
        icon: (
            <div className="bg-[#F6F4FF] w-[20%] flex flex-row items-center justify-center py-2
            rounded-md">
                <div className="w-[32px] h-[32px]" dangerouslySetInnerHTML={{ __html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" weight="fill"><path d="M176,116a60,60,0,1,1-60-60A60,60,0,0,1,176,116Zm53.6,113.7A8,8,0,0,1,224,232a8.3,8.3,0,0,1-5.7-2.3l-43.2-43.3a92.2,92.2,0,1,1,11.3-11.3l43.2,43.2A8,8,0,0,1,229.6,229.7ZM116,192a76,76,0,1,0-76-76A76.1,76.1,0,0,0,116,192Z"></path></g></svg>
                `}} />
            </div>
        ),
        name: "Industry Insights",
        desc: "Gain valuable insights into current trends and opportunities.",
        key: "industry-insights"
    },
    {
        icon: (
            <div className="bg-[#F6F4FF] w-[20%] flex flex-row items-center justify-center py-2
            rounded-md">
                <div className="w-[32px] h-[32px]" dangerouslySetInnerHTML={{ __html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" weight="fill"><path d="M208.9,144a15.8,15.8,0,0,1-10.5,15l-52.2,19.2L127,230.4a16,16,0,0,1-30,0L77.8,178.2,25.6,159a16,16,0,0,1,0-30l52.2-19.2L97,57.6a16,16,0,0,1,30,0l19.2,52.2L198.4,129A15.8,15.8,0,0,1,208.9,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z"></path></g></svg>
                `}} />
            </div>
        ),
        name: "Job Placement Assistance",
        desc: "Access internship and job opportunities aligned with your skills.",
        key: "job-placement-assistance"
    },
    {
        icon: (
            <div className="bg-[#F6F4FF] w-[20%] flex flex-row items-center justify-center py-2
            rounded-md">
                <div className="w-[32px] h-[32px]" dangerouslySetInnerHTML={{ __html: `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" weight="fill"><path d="M165.8,224H208a16,16,0,0,0,16-16V170.3a7.9,7.9,0,0,0-3.6-6.6,7.7,7.7,0,0,0-7.5-.7,24.3,24.3,0,0,1-8.9,1.7c-13.2,0-24-11.1-24-24.7s10.8-24.7,24-24.7a24.3,24.3,0,0,1,8.9,1.7,7.7,7.7,0,0,0,7.5-.7,7.9,7.9,0,0,0,3.6-6.6V72a16,16,0,0,0-16-16H171.8c.1-1.3.2-2.7.2-4a36,36,0,0,0-72,0c0,1.3.1,2.7.2,4H64A16,16,0,0,0,48,72v32.2l-4-.2a36,36,0,0,0,0,72l4-.2V208a16,16,0,0,0,16,16h42.2"></path></g></svg>
                `}} />
            </div>
        ),
        name: "Career Guidance",
        desc: "Receive guidance tailored to your career goals and aspirations.",
        key: "career-guidance"
    },
]


export const teamData = [
    {
        name: "Simon Adjei",
        title: "Co-Founder & Software Engineer",
        image: Simon,
        key: "simon-adjei"
    },
    {
        name: "Obeng Kwabena",
        title: "Co-Founder & Data Scientist",
        image: Kwabena,
        key: "obeng-kwabena"
    },
    {
        name: "Josephine Asmah",
        title: "Career & Research Lead",
        image: Asmah,
        key: "josephine-asmah"
    },
    {
        name: "Prince Appiah",
        title: "Backend Engineer",
        image: Prince,
        key: "prince-appiah"
    },
    {
        name: "Jeffery Baafi",
        title: "Project Manager",
        image: Jeffery,
        key: "jeffery-baafi"
    },
    {
        name: "Michael Kokonu",
        title: "Backend Engineer",
        image: Michael,
        key: "michael-kokonu"
    },
]

export const ImagesData = [
    { image: Img01, id: "1" },
    { image: Img02, id: "2" },
    { image: Img03, id: "3" },
    { image: Img04, id: "4" },
    { image: Img05, id: "5" },
    { image: Img06, id: "6" },
    { image: Img07, id: "7" },
    { image: Img08, id: "8" },
    { image: Img09, id: "9" },
    { image: Img10, id: "10" },
]

 export const barchartData = [
    { month: 'January', Study: 70, Exam: 40 },
    { month: 'February', Study: 90, Exam: 12},
    { month: 'March', Study: 40, Exam: 10 },
    { month: 'April', Study: 80, Exam: 20},
    { month: 'May', Study: 80, Exam: 14},
    { month: 'June', Study: 75, Exam: 20},
    { month: 'July', Study: 80, Exam: 30 },
    { month: 'August', Study: 60, Exam: 42},
    { month: 'September', Study: 50, Exam: 30 },
    { month: 'October', Study: 80, Exam: 20},
    { month: 'November', Study: 85, Exam: 24},
    { month: 'December', Study: 75, Exam: 26},
  ];