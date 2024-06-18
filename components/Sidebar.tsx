'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useStore from '@/lib/store';
import { menteeSidebar, mentorSidebar } from '@/constants';


const Sidebar = () => {
  const pathname = usePathname();
  const { name } = useStore();
  const sidebarLinks = name === 'mentee' ? menteeSidebar : mentorSidebar;

  return (
    <section className="sticky left-0 top-0 flex h-[42.5rem] flex-col justify-between bg-white p-6 pt-28 text-[#17171d] shadow-xl max-md:h-[42.5rem] max-sm:hidden lg:w-[8rem]">
      <div className="flex  flex-col max-md:gap-y-8 ">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route;
          return (
            <div
              key={item.label}
              className="flex flex-col items-center justify-start gap-2  rounded-lg p-4 "
            >
              <Link
                href={item.route}
                className={` ${ isActive ? 'bg-purple-1/40 rounded-md  p-2 text-white' : "" }
                  
                `}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={24}
                  height={24}
                  className=""
                />
              </Link>
              <Link
                href={item.route}
                className="text-xs font-semibold hover:text-purple-1 max-lg:hidden"
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
