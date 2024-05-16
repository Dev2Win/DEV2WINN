'use client';
import logo from "../public/images/logo.jpg"
import menu from "../public/icons/hamburger.svg"
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { menteeSidebar,mentorSidebar } from '@/constants';
import { cn } from '@/lib/utils';
import useStore from "@/lib/store";

const MobileNav = () => {
  const pathname = usePathname();
  const { name} = useStore();
  const sidebarLinks = name === 'mentee' ? menteeSidebar : mentorSidebar;
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src={menu}
            width={36}
            height={36}
            alt="hamburger icon"
            className="cursor-pointer sm:hidden"
          />
          
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Link href="/dashboard" className="flex items-center gap-1">
            <Image
              src={logo}
              width={32}
              height={32}
              alt="dev2win logo"
            />
            
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className=" flex h-full flex-col gap-6 pt-16 text-black">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route;

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        key={item.label}
                        className={cn(
                          'flex gap-4 items-center p-4 rounded-lg w-full max-w-60',
                          {
                            'bg-purple-1': isActive,
                          },
                        )}
                      >
                        <Image
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                        />
                        <p className="font-semibold">{item.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;