import { footerLinks } from "@/lib/utils"
import Link from "next/link"
export default function Footer() {

  return (
    <footer className="bg-[#451297] text-white px-5 2xl:px-36 py-[50px]">
      <h1 className="text-xl text-white font-extrabold tracking-[-0.3px]
      cursor-pointer leading-6">Dev2Win</h1>
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="">
          <p className="text-sm font-bold leading-[19.6px]">Overview</p>
          <ul className="flex flex-col gap-4 mt-4">
            {footerLinks.Overview.map(item => (
              <Link href={item.path}
               className="text-[#F6F4FF] text-sm cursor-pointer"
               key={item.key}>{item.name}
              </Link>
            ))}
          </ul>
        </div>

        <div className="mt-10 md:mt-0">
          <p className="text-sm font-bold leading-[19.6px]">Careers</p>
          <ul className="flex flex-col gap-4 mt-4">
            {footerLinks.Careers.map(item => (
              <Link href={item.path}
               className="text-[#F6F4FF] text-sm cursor-pointer"
               key={item.key}>{item.name}
              </Link>
            ))}
          </ul>
        </div>

        <div className="mt-10 lg:mt-0">
          <p className="text-sm font-bold leading-[19.6px]">Contact</p>
          <p className="text-[#F6F4FF] text-sm cursor-pointer mt-4">Email: dev2winn@gmail.com</p>
          <p className="text-[#F6F4FF] text-sm cursor-pointer mt-4">Call: +233593178619  /  +233554674801</p>
        </div>
        
      </section>
      <p className="text-[#F6F4FF] text-sm cursor-pointer mt-10">&copy; {" "}Dev2Win</p>
    </footer>
  )
}
