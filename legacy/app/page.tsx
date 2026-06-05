

import Image from "next/image"
import Link from "next/link"
import Herosection from "@/components/shared/Herosection";
import WhatWeOffer from "@/components/shared/WhatWeOffer";
import gallImage01 from "@/public/images/gallImage01.webp"
import gallImage02 from "@/public/images/gallImage02.webp"
import gallImage03 from "@/public/images/gallImage03.webp"
import Features from "@/components/shared/Features";
import { Button } from "@/components/ui/button";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";


export default function Home() {
  return (
    <>
      <main className="px-5">
        <Navbar/>
        <Herosection />
        <WhatWeOffer />
        <section className="mt-28 2xl:px-32 w-full flex flex-col xl:flex-row
          mb-24">
          <div className="xl:w-[60%]">
            <p className="text-base text-[#7421FC] font-extrabold
            leading-6 tracking-[1px]">ACCELERATE YOUR CAREER</p>
            <h2 className="text-4xl text-[#19154E] font-extrabold
            leading-[43.2px] tracking-[-1px] mt-6 lg:text-[48px] lg:w-[55%] xl:w-[75%]
            lg:leading-[62.4px]">Grow your career with us</h2>
            <p className="text-base text-[#5B5E76] font-medium leading-[27.2px] mt-6
            md:w-[75%] lg:text-lg lg:w-[50%] xl:w-[70%]">
              Embark on a transformative journey of career growth and development with our unparalleled support and resources tailored to your success.
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
      </main>
      <Features />
      <section className="bg-[#7421FC] px-5 pt-7 pb-10 flex flex-col items-center justify-center
       md:px-20 lg:px-60">
       <p className="text-white/65 text-base font-extrabold
       leading-6 text-center">STRATEGIC PLAN FOR SUCCESS</p>
       <h2 className="text-white text-4xl font-extrabold leading-[43.2px] tracking-[-1px]
       text-center mt-6 lg:text-[48px] lg:leading-[62.4px]">
        Uncover the optimal approach to empower your journey towards success.
       </h2>
       <Button className="bg-[#451297] text-white text-lg font-bold leading-[18px] mt-5
       w-full lg:w-[30%] py-7">
        <Link href="/contact">Contact Us</Link>
       </Button>
       
      </section>
      <Footer/>
    </>
  )
}