import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dev2Win',
  description: 'Grow your tech career with mentors, roadmaps, and a 24/7 AI mentor.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
