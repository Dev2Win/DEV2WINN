import { featureData } from "@/lib/data"
import { Card, CardContent, CardHeader } from "../ui/card"
export default function Features() {
  return (
    <section className="bg-[#F6F4FF] px-5 2xl:px-36 py-14">
     <p className="text-base text-[#7421FC] font-extrabold leading-6 text-center">FEATURES</p>
     <h2 className="text-[#19154E] text-4xl lg:text-[48px] leading-[43.2px]
     font-extrabold tracking-[-1px] mt-5 text-center">
      Essential Features to Enjoy
     </h2>
     <section className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {featureData.map((item) => (
          <Card key={item.key} className="shadow-lg">
            <CardHeader className="flex felx-row items-center justify-center">
             {item.icon}
            </CardHeader>
            <CardContent>
             <h3 className="text-[#19154E] text-2xl font-extrabold leading-[33.6px] tracking-[-0.5px]
             text-center">{item.name}</h3>
             <p className="text-[#5B5E76] text-base font-medium leading-[27.2px] mt-4 lg:text-lg
             text-center">{item.desc}</p>
            </CardContent>
          </Card>
      ))}
     </section>
    </section>
  )
}
