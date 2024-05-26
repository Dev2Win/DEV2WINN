import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export const metadata: Metadata = {
  title: 'Dev2Win',
  description:
    'A career building platform enriched with AI and Human Mentorship',
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="relative">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <section className="flex bg-black/5 min-h-screen flex-1 flex-col px-4 pb-6 pt-[6rem] max-md:pb-14 sm:px-14">
          <div className="w-full">
            <MantineProvider>{children}</MantineProvider>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
