import Image from "next/image"
import AboutImage from "@/public/images/aboutImage.webp"
import gallImage01 from "@/public/images/gallImage01.webp"
import gallImage02 from "@/public/images/gallImage02.webp"
import gallImage03 from "@/public/images/gallImage03.webp"
import { teamData } from "@/lib/data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import JoinUs from "@/components/shared/JoinUs"


export default function AboutPage() {

  return (
    <>
    <section className="mt-10 px-5">
      <div className="2xl:px-32">
        <p className="text-base text-[#7421FC] font-extrabold leading-6 text-center">ABOUT US</p>
        <h1 className="text-[#19154E] text-4xl lg:text-[48px] leading-[43.2px]
        font-extrabold tracking-[-1px] mt-5 text-center">
          Raising Industry Experts.
        </h1>
        <Image
         src={AboutImage}
         alt="about image"
         width={300}
         height={300}
         className="w-full rounded-lg mt-12"
        />
      </div>

      <div className="mt-20 2xl:px-32">
        <p className="text-base text-[#7421FC] font-extrabold leading-6 text-center">OUR TEAM</p>
        <h2 className="text-[#19154E] text-4xl lg:text-[48px] leading-[43.2px] lg:leading-[62.4px]
        font-extrabold tracking-[-1px] mt-5 text-center md:w-[90%] lg:w-[70%] mx-auto">
         Empowering  Tomorrow&apos;s Leaders Today.
        </h2>
        <p className="text-base text-[#19154E] font-medium
        leading-[27.2px] text-center mt-5">Empowering Success Together. Meet Our Dedicated Team</p>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 mt-10">
          {teamData.map(item => (
            <Card key={item.key} className="bg-[#F6F4FF] flex flex-col items-center justify-center
            py-4 shadow-md">
              <CardHeader className="flex items-center justify-center">
               <Image
                src={item.image}
                alt="team member"
                width={130}
                height={130}
               />
              </CardHeader>
              <CardContent>
               <h3 className="text-black text-base font-extrabold leaading-[19.2px] text-center lg:text-lg">{item.name}</h3>
               <p className="text-base text-[#5B5E76] font-medium leading-[27.2px] text-center lg:text-lg">{item.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <section className="mt-28 2xl:px-32 w-full flex flex-col xl:flex-row
          mb-24">
          <div className="xl:w-[60%]">
            <p className="text-base text-[#7421FC] font-extrabold
            leading-6 tracking-[1px]">OUR MISSION</p>
            <h2 className="text-4xl text-[#19154E] font-extrabold
            leading-[43.2px] tracking-[-1px] mt-6 lg:text-[48px] lg:w-[55%] xl:w-[75%]
            lg:leading-[62.4px]">Your Path to Career Success Starts Here.</h2>
            <p className="text-base text-[#5B5E76] font-medium leading-[27.2px] mt-6
            md:w-[75%] lg:text-lg lg:w-[50%] xl:w-[70%]">
              Our mission is to empower individuals through education, bridging the gap between learning and industry to foster career success and drive positive social change.
            </p>
          </div>
          <div className="mt-16 xl:mt-0 flex flex-col gap-5 xl:w-[40%]">
            <Image
            src={gallImage01}
            alt="gallery image"
            width={300}
            height={300}
            className="w-full rounded-lg"
            />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Image
                src={gallImage02}
                alt="gallery image"
                width={300}
                height={300}
                className="w-full rounded-lg md:h-[300px] object-cover"
              />
              <Image
                src={gallImage03}
                alt="gallery image"
                width={300}
                height={300}
                className="w-full rounded-lg md:h-[300px] object-cover"
              />
            </div>
          </div>
      </section>
    </section>

    <section className="bg-[#F6F4FF] px-5 2xl:px-36 py-10">
      <h2 className="text-[#19154E] text-4xl lg:text-[48px] leading-[43.2px]
      font-extrabold tracking-[-1px] mt-5 w-[95%] mx-auto text-center">
        Meet Our partners and investors
      </h2>
      <div className="w-[40px] h-[40px]">
        {/* Logo here */}
        Logo here
      </div>
    </section>
    <JoinUs />  
    </>
  )
}