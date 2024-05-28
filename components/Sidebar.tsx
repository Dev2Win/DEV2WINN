'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useStore from '@/lib/store';
import { menteeSidebar, mentorSidebar } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const { name } = useStore();
  const sidebarLinks = name === 'mentee' ? menteeSidebar : mentorSidebar;

  return (
    <section className="sticky left-0 h-[42.5rem] max-md:h-[28rem] top-0 flex flex-col justify-between bg-white shadow-xl p-6 pt-28 text-[#17171d] max-sm:hidden lg:w-[8rem]">
      <div className="flex flex-col ">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route;
          return (
            <div
              key={item.label}
              className="flex flex-col gap-2 items-center  p-4 rounded-lg justify-start"
            >
              <Link
                href={item.route}
                className={cn({
                  'bg-purple-1/40 rounded-md  p-2 text-white': isActive,
                })}
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
                className="text-xs font-semibold max-lg:hidden hover:text-purple-1"
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
