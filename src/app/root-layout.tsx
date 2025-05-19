"use client";
import Navbar from "@/components/Index/Navbar";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');
  return (
    <>
    {!isDashboard && <Navbar />}
      {children}
    </>
  )
};

export default DashboardLayout;