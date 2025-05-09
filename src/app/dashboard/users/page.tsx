import UserManagement from "@/components/Dashboard/Users/UserManagement";
import RegisterUser from "../../../components/Dashboard/Users/CRUD/RegisterUser";
import { currentUser } from "@clerk/nextjs/server";

const page = async() => {
    const user= await currentUser()
    const userRole=  user?.publicMetadata?.role as string;
  return <div className="mt-20">
   <UserManagement userRole={userRole}/>
  </div>;
};

export default page;
