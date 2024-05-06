import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

type ContactLayoutProps = {
    children: React.ReactNode;
}

export default function ContactLayout({ children }: ContactLayoutProps) {
  return (
    <>
     <Navbar />
     {children}
     <Footer />
    </>
  )
}
