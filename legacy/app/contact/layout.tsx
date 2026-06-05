import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import React from "react";

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
