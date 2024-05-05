"use client"

import { Button } from "../ui/button";
import { Input } from "../ui/input";


export default function Herosection() {
  const handleClick = () => {
    console.log("join waitlist")
  }
  return (
    <section className="mt-24 lg:mt-2 w-full lg:flex xl:px-3">
     <div className="flex flex-col items-center lg:items-start justify-center lg:justify-start
     lg:w-[50%] xl:mt-20 2xl:px-28 2xl:mt-32">
      <p className="text-[#7421FC] text-base font-extrabold
       leading-6 lg:hidden xl:flex">EMPOWER. TRANSFORM. SUCCEED</p>
      <h1 className="text-[#19154E] text-[40px] font-extrabold
       leading-[44px] lg:leading-[66px] tracking-[-0.5px] text-center lg:text-left mt-5
       lg:text-6xl xl:text-[68px] lg:w-[90%] xl:w-[85%] xl:leading-[74.8px]">Develop a Career with Ease</h1>
      <p className="text-[#5B5E76] text-lg lg:text-xl font-medium tracking-[0.2px] leading-[25.2px]
      text-center lg:text-left mt-4 w-[80%] 2xl:w-[85%] xl:text-2xl xl:leading-[33.6px]">
        Simplify your career journey with our comprehensive platform, guiding you with ease and confidence.
      </p>
      <div className="flex flex-row gap-2 mt-4">
        <Input
         className="bg-[#EBEBEB] text-base font-normal
         border-none focus-visible:ring-transparent"
         type="email"
         placeholder="email@dev2win.com"
        />
        <Button
         className="bg-[#7421FC] text-white text-base font-semibold active:bg-[#7421FC]
         leading-[22.4px]"
         type="submit"
         onClick={handleClick}>Join Waitlist</Button>
      </div>
     </div>

     <div>
        image scrolling here
     </div>
    </section>
  )
}
