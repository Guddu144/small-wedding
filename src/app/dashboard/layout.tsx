import Sidebar from "@/components/Sidebar/Sidebar";
import { currentUser } from "@clerk/nextjs/server";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const userRole = user?.publicMetadata?.role as string;

  return <div>{children}</div>;
};

export default ProtectedLayout;
