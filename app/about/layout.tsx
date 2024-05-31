import React from "react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

type AboutLayoutProps = {
    children: React.ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <>
     <Navbar />
     {children}
     <Footer />
    </>
  )
}
