"use client"

import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ImagesData } from "@/lib/data"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
 
const joinWaitListFormSchema = z.object({
  email: z.string().email().min(2).max(50)
})

export default function Herosection() {

  const form = useForm<z.infer<typeof joinWaitListFormSchema>>({
    resolver: zodResolver(joinWaitListFormSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof joinWaitListFormSchema>) {
    console.log(values)
  }

  return (
    <section className="relative mt-24 lg:mt-2 w-full lg:flex xl:px-3">
     <div className="flex flex-col items-center lg:items-start
     justify-center lg:justify-start xl:mt-20 2xl:px-28 2xl:mt-20 lg:w-[60%]">
      <p className="text-[#7421FC] text-base font-extrabold
       leading-6 lg:hidden xl:flex">EMPOWER. TRANSFORM. SUCCEED</p>
      <h1 className="text-[#19154E] text-[40px] font-extrabold
       leading-[44px] lg:leading-[66px] tracking-[-0.5px] text-center lg:text-left mt-5
       lg:text-6xl xl:text-[68px] lg:w-[90%] xl:w-[85%] xl:leading-[74.8px]">Develop a Career with Ease</h1>
      <p className="text-[#5B5E76] text-lg lg:text-xl font-medium tracking-[0.2px] leading-[25.2px]
      text-center lg:text-left mt-4 w-[80%] 2xl:w-[85%] xl:text-2xl xl:leading-[33.6px]">
        Simplify your career journey with our comprehensive platform, guiding you with ease and confidence.
      </p>
      <div>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-2 mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                <Input
                  className="bg-[#EBEBEB] text-base font-normal
                  border-none focus-visible:ring-transparent"
                  type="email"
                  placeholder="email@dev2win.com" { ...field}
                />                
              </FormControl>
              </FormItem>
            )}
          />
          <Button
           className="bg-[#7421FC] text-white text-base font-semibold active:bg-[#7421FC]
           leading-[22.4px] focus:bg-[#7421FC]"
           type="submit"
          >
           Join Waitlist
          </Button>
          </form>
         </Form> 
      </div>
     </div>

     <div className="absolute top-0 right-0
      w-[10px] z-[-1] lg:z-[-2] bg-[#7421FC]/5 blur-3xl h-[400px]" />
      <div className="absolute top-20 right-0
      w-[300px] md:w-[400px] z-[-1] lg:z-[-2] bg-[#7421FC]/30 blur-3xl h-[400px]" />
      <div className="absolute top-30 right-0 
      w-[400px] md:w-[600px] z-[-1] lg:z-[-2] bg-[#7421FC]/30 blur-2xl h-[200px]" />

     <div className="mt-1 lg:mt-0 relative w-full h-[300px] xl:h-[500px] lg:w-[40%]">
      <div className="absolute z-[-2] lg:z-[-1] overflow-hidden
      grid grid-cols-2 w-full h-full gap-3 md:gap-1 lg:gap-2">
       {ImagesData.map((img) => (
        <Image
         key={img.id}
         src={img.image}
         width={200}
         height={300}
         alt="image"
         className="animate-scrolling-top md:w-[300px] md:object-cover"
        />
       ))}
      </div>
     </div>
    </section>
  )
}
