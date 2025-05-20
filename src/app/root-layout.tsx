"use client";
import Navbar from "@/components/Index/Navbar";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');
  return (
    <>
    <Toaster position="top-right" />
    {!isDashboard && <Navbar />}
      {children}
    </>
  )
};

export default DashboardLayout;