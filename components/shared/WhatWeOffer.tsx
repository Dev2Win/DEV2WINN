import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

export default function WhatWeOffer() {
  return (
    <>
      <section className="pt-10 bg-white">
        <h1 className="text-[#19154E] text-4xl font-extrabold
        leading-[43.2px] tracking-[-1px] text-center">
         What We Offer you
        </h1>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10
        2xl:px-[126px]">
         <Card className="shadow-lg">
          <CardHeader>
            <div className="bg-[#F6F4FF] w-[20%] flex flex-row items-center justify-center py-2
             rounded-md">
              <div className="w-[32px] h-[32px]" dangerouslySetInnerHTML={{ __html: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" weight="fill"><rect x="24" y="72" width="176" height="144" rx="16"></rect><path d="M216,40H64a8,8,0,0,0,0,16H216V176a8,8,0,0,0,16,0V56A16,16,0,0,0,216,40Z"></path></g></svg>
              `}} />
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-[#19154E] text-2xl font-extrabold leading-[33.6px]
            tracking-[-0.5px]">Hands-On Projects</h3>
            <p className="text-[#5B5E76] text-base font-medium leading-[27.2px] mt-4
            lg:text-lg">
             Embark on Hands-On Projects to Enhance Your Skills and Boost Your Career Prospects
            </p>
          </CardContent>
          <CardFooter className="flex flex-row items-center gap-2">
            <p className="text-[#7421FC] text-lg font-bold leading-[30.6px] mt-1">Explore</p>
            <div className="w-[19px] h-[19px]" dangerouslySetInnerHTML={{ __html: `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" weight="bold"><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><polyline points="144 56 216 128 144 200" fill="none" stroke="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline></g></svg>
          ` }} />
          </CardFooter>
         </Card>

         <Card className="shadow-lg">
          <CardHeader>
            <div className="bg-[#F6F4FF] w-[20%] flex flex-row items-center justify-center py-2
             rounded-md">
              <div className="w-[32px] h-[32px]" dangerouslySetInnerHTML={{ __html: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" weight="fill"><path d="M229.9,70.8h0a.1.1,0,0,1-.1-.1,16.2,16.2,0,0,0-6-5.9l-88-49.5a16,16,0,0,0-15.6,0l-88,49.5a16.2,16.2,0,0,0-6,5.9.1.1,0,0,1-.1.1v.2A15,15,0,0,0,24,78.7v98.6a16.1,16.1,0,0,0,8.2,14l88,49.5a16.5,16.5,0,0,0,7.2,2h1.4a16.1,16.1,0,0,0,7-2l88-49.5a16.1,16.1,0,0,0,8.2-14V78.7A15.6,15.6,0,0,0,229.9,70.8Zm-101,48L48.4,74,128,29.2,207.7,74ZM216,177.3l-79.9,45,.8-89.6,79.1-45Z"></path></g></svg>
              `}} />
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-[#19154E] text-2xl font-extrabold leading-[33.6px]
            tracking-[-0.5px]">Career Guidance</h3>
            <p className="text-[#5B5E76] text-base font-medium leading-[27.2px] mt-4
            lg:text-lg">
             Empower your career journey with personalized and step by step guidance to achieving your aspirations
            </p>
          </CardContent>
         </Card>

         <Card className="shadow-lg">
          <CardHeader>
            <div className="bg-[#F6F4FF] w-[20%] flex flex-row items-center justify-center py-2
             rounded-md">
              <div className="w-[32px] h-[32px]" dangerouslySetInnerHTML={{ __html: `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(136, 0, 255))" weight="fill"><path d="M200.8,53.9A103.4,103.4,0,0,0,128,24h-1.1A104,104,0,0,0,93.4,226.1,32,32,0,0,0,136,195.9V192a16,16,0,0,1,16-16h46.2a31.7,31.7,0,0,0,31.2-24.9,101.5,101.5,0,0,0,2.6-24A102.9,102.9,0,0,0,200.8,53.9ZM89,164.4A12,12,0,1,1,93.4,148,12,12,0,0,1,89,164.4ZM93.4,108A12,12,0,1,1,89,91.6,12.1,12.1,0,0,1,93.4,108ZM128,88a12,12,0,1,1,12-12A12,12,0,0,1,128,88Zm51,24.4A12,12,0,1,1,183.4,96,12.1,12.1,0,0,1,179,112.4Z"></path></g></svg>
              `}} />
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-[#19154E] text-2xl font-extrabold leading-[33.6px]
            tracking-[-0.5px] w-[90%]">Comprehensive mentorship</h3>
            <p className="text-[#5B5E76] text-base font-medium leading-[27.2px] mt-4
            lg:text-lg">
             Unlock potential with our blend of AI and human mentorship.
            </p>
          </CardContent>
          <CardFooter className="flex flex-row items-center gap-2">
            <p className="text-[#7421FC] text-lg font-bold leading-[30.6px] mt-1">Explore</p>
            <div className="w-[19px] h-[19px]" dangerouslySetInnerHTML={{ __html: `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" weight="bold"><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><polyline points="144 56 216 128 144 200" fill="none" stroke="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline></g></svg>
          ` }} />
          </CardFooter>
         </Card>
        </div>
      </section>
    </>
  )
}