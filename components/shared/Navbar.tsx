"use client"

import { MdOutlineMenu, MdClose} from "react-icons/md";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
export default function Navbar() {
  const pathname = usePathname()
  const [menuClick, setHandleMenuClick] = useState(false)

  return (
    <section className="relative">
    <nav className="sticky top-0 left-0 z-[1000] w-full
    flex flex-row items-center justify-between p-5 xl:px-8 2xl:px-36 bg-white">
      <div>
      <h1 className="text-[#19154E] text-xl font-extrabold
        tracking-[-0.3px]">Dev2Win</h1>
      </div>

      <div className="hidden xl:flex">
        <ul className="flex flex-row gap-8 items-center justify-center">
         <Navigation
          menuClick={menuClick}
          pathname={pathname}
          setHandleMenuClick={setHandleMenuClick}
         />
        </ul>
      </div>

      <div className="xl:hidden">
        {menuClick
        ? <MdClose className="text-black" fontSize={25} onClick={() => setHandleMenuClick(!menuClick)}/>
        : <MdOutlineMenu className="text-black" fontSize={25} onClick={() => setHandleMenuClick(!menuClick)}/>}
      </div>
    </nav>
    {
      menuClick && (
        <div className="bg-white absolute top-[100%] left-0 z-[50] w-full xl:hidden
      pb-20">
          <ul className="flex flex-col gap-8 items-center justify-center">
            <Navigation
              menuClick={menuClick}
              pathname={pathname}
              setHandleMenuClick={setHandleMenuClick}
            />
          </ul>
        </div>
      )
    }
    </section>
  )
}