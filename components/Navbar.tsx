import Link from 'next/link';
import logo from '@/public/images/logo.jpg';
import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-white    px-6 py-4 lg:px-10  shadow-sm">
      <Link href="/dashboard" className="flex items-center gap-1">
        <Image
          src={logo}
          width={32}
          height={32}
          alt="yoom logo"
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold text-black">DEV2WIN</p>
      </Link>
      <div className="flex-between gap-5">
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
