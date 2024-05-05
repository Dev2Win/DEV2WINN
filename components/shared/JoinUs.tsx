"use client"

import { Button } from "../ui/button"
import { Input } from "../ui/input"


export default function JoinUs() {

  const handleClick = () => {
    console.log("join waitlist")
  }

  const checkIcon = (
    <div className="w-[25px] md:w-[32px] h-[25px] md:h-[32px]" dangerouslySetInnerHTML={{ __html: `
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-0cdf47b3-ce1f-4341-98ec-f094608541cb, rgb(246, 244, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-0cdf47b3-ce1f-4341-98ec-f094608541cb, rgb(246, 244, 255)); flex-shrink: 0;"><g color="var(--token-0cdf47b3-ce1f-4341-98ec-f094608541cb, rgb(246, 244, 255))" weight="fill"><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></g></svg>
    `}} />
  )

  return (
    <section className="bg-[#7421FC] px-5 pt-7 pb-10 flex flex-col items-center justify-center
       md:px-20 lg:px-60">
      <p className="text-white/65 text-base font-extrabold
        leading-6 text-center">JOIN US</p>
      <h2 className="text-white text-4xl font-extrabold leading-[43.2px] tracking-[-1px]
       text-center mt-6 lg:text-[48px] lg:leading-[62.4px]">
        Join our mission and become part of the community today!
      </h2>
     <div className="flex flex-row gap-2 mt-7">
      <Input
        className="bg-[#ffffff33] text-base font-normal
        border-none focus-visible:ring-transparent placeholder:text-white/75"
        type="email"
        placeholder="Email address"
      />
      <Button
        className="bg-white text-[#19154E] text-base font-semibold active:bg-white
         leading-[22.4px] focus:bg-white"
        type="submit"
        onClick={handleClick}>Join Waitlist</Button>
      </div>
      <div className="text-white flex flex-row items-center gap-4
      mt-14 mb-14">
        <div className="flex flex-row items-center">
         <span>{checkIcon}</span>
         <p className="text-xs md:text-sm font-bold">Jobs</p>
        </div>
        <div className="flex flex-row items-center">
         <span>{checkIcon}</span>
         <p className="text-xs md:text-sm font-bold">100+Courses</p>
        </div>
        <div className="flex flex-row items-center">
         <span>{checkIcon}</span>
         <p className="text-xs md:text-sm font-bold">100+Practical Session</p>
        </div>
      </div>
   </section>
  )
}
