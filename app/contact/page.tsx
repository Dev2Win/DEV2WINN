import ContactForm from "@/components/shared/ContactForm";


export default function ContactPage() {
  return (
    <section className="px-5 2xl:px-36 mt-16">
      <p className="text-base text-[#7421FC] font-extrabold leading-6">CONTACT US</p>
      <h1 className="text-[#19154E] text-4xl md:text-[40px] lg:text-[60px] xl:text-[68px] xl:leading-[74.8px]
      leading-[43.2px] lg:leading-[66px] font-extrabold tracking-[-1px] mt-5 mb-8 w-[70%] lg:w-[55%] xl:w-[50%]">
         We are here to help.
      </h1>
      <ContactForm />
    </section>
  )
}