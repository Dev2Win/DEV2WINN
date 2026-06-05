import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";


type NavigationProps = {
  setHandleMenuClick: Dispatch<SetStateAction<boolean>>;
  pathname: string;
  menuClick: boolean;
}

export default function Navigation({ setHandleMenuClick, pathname, menuClick}: NavigationProps) {
  return (
    <>
      <Link href="/"
        onClick={() => setHandleMenuClick(!menuClick)}
        className={`${pathname === "/" ? "text-[#5B5E76] text-base font-semibold": "text-[#19154E] text-base font-semibold"}`}>
        Home
      </Link>
      <Link href="/about"
        onClick={() => setHandleMenuClick(!menuClick)}
        className={`${pathname === "/about" ? "text-[#5B5E76] text-base font-semibold" : "text-[#19154E] text-base font-semibold"}`}>
        About
      </Link>
      <Link href="/sign-in" onClick={() => setHandleMenuClick(!menuClick)}>
        <Button className="bg-[#7421FC] text-white">Sign in</Button>
      </Link>
    </>
  )
}
