"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { FaTwitter,FaLinkedin } from "react-icons/fa";

import { AiFillInstagram } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa6";


 
const contactFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().min(2).max(50),
  message: z.string().min(2).max(500),
})

export default function ContactForm() {

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
        name: "",
        email: "",
        message: "",
    },
  })

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(values)
  }

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:mb-10">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="w-full flex flex-row items-center gap-4">
         <FormField
           control={form.control}
           name="name"
           render={({ field }) => (
            <FormItem className="md:w-[50%]">
             <FormControl>
                <Input
                 placeholder="Name" {...field}
                 className="border-none focus-visible:ring-transparent bg-[#F6F4FF]"
                />
              </FormControl>
            </FormItem>
           )}
         />

         <FormField
           control={form.control}
           name="email"
           render={({ field }) => (
            <FormItem className="w-[50%]">
             <FormControl>
                <Input
                 placeholder="Email" {...field}
                 className="border-none focus-visible:ring-transparent bg-[#F6F4FF]"
                />
              </FormControl>
            </FormItem>
           )}
         />
        </div>

        <FormField
           control={form.control}
           name="message"
           render={({ field }) => (
            <FormItem>
             <FormControl>
                <Textarea
                 placeholder="message" {...field}
                 className="border-none focus-visible:ring-transparent bg-[#F6F4FF]"
                 rows={13}
                />
              </FormControl>
            </FormItem>
           )}
         />
        <Button
         type="submit"
         className="bg-[#7421FC] text-white w-full py-7 font-bold
         active:bg-[#7421FC] focus:bg-[#7421FC]"
        >
          Send Message
        </Button>
      </form>
    </Form>
    <section className="mt-14 xl:mt-0">
     <div>
      <h3 className="text-[#19154E] text-2xl font-extrabold leading-[33.6px]">Get early access</h3>
      <p className="text-[#5B5E76] text-base xl:text-lg font-medium leading-[27.2px] mt-2 md:w-[60%]">
        Be the first to know! Reach out to find out from us anything you want to know regarding Dev2Win
      </p>
     </div>
     <div className="mt-10">
      <h3 className="text-[#19154E] text-2xl font-extrabold leading-[33.6px]">Address</h3>
      <p className="text-[#5B5E76] text-base xl:text-lg font-medium leading-[27.2px] mt-2">
       <p>AS 327947</p>
       <p>KNUST CAMPUS  -  KUMASI</p>
       <p>GHANA</p>
      </p>
     </div>
     <div>
      <Link href="" className="flex flex-row items-center gap-3">
        <p className="text-[#5B5E76] text-base font-medium leading-[27.2px] mt-2">dev2winn@gmail.com</p>
        <div className="w-[19px] h-[19px]" dangerouslySetInnerHTML={{ __html: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" weight="bold"><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><polyline points="144 56 216 128 144 200" fill="none" stroke="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline></g></svg>
        `}} />
      </Link>
      <Link href="" className="flex flex-row items-center gap-3">
        <p className="text-[#7421FC] text-base font-bold leading-[27.2px] mt-2">tel: +233554674801</p>
        <div className="w-[19px] h-[19px]" dangerouslySetInnerHTML={{ __html: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" style="user-select: none; width: 100%; height: 100%; display: inline-block; fill: var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252)); flex-shrink: 0;"><g color="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" weight="bold"><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><polyline points="144 56 216 128 144 200" fill="none" stroke="var(--token-2e606580-c5cb-45c2-a66e-07cb8dbe5a38, rgb(116, 33, 252))" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></polyline></g></svg>
        `}} />
      </Link>
     </div>
     <div className="mt-10 flex flex-row items-center gap-4 mb-10">
      <div className="bg-[#7421FC] w-[40px] h-[40px] rounded-full flex justify-center items-center">
        <FaTwitter fontSize={20} color="white" />
      </div>
      <div className="bg-[#7421FC] w-[40px] h-[40px] rounded-full flex justify-center items-center">
        <FaLinkedin fontSize={20} color="white" />
      </div>
      <div className="bg-[#7421FC] w-[40px] h-[40px] rounded-full flex justify-center items-center">
        <AiFillInstagram fontSize={20} color="white" />
      </div>
      <div className="bg-[#7421FC] w-[40px] h-[40px] rounded-full flex justify-center items-center">
        <FaYoutube fontSize={20} color="white" />
      </div>
     </div>
    </section>
    </section>
  )
}
