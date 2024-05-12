import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Logo from '@/public/images/logo.jpg';

import MobileNav from './MobileNav';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-white    px-6 py-4 lg:px-10  shadow-sm">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src={Logo}
          width={32}
          height={32}
          alt="yoom logo"
          className="max-sm:size-10"
        />
        <p
          className="text-[#19154E] text-xl font-extrabold
          tracking-[-0.3px] max-sm:hidden"
        >
          Dev2Win
        </p>
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
