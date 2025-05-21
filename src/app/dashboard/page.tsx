
import { currentUser } from "@clerk/nextjs/server";
import RegisterUser from "../../components/Dashboard/Users/CRUD/RegisterUser";
import Venues from "@/components/Dashboard/Venues/Venues";
import UserManagement from "@/components/Dashboard/Users/UserManagement";
import UserDashboard from "@/components/Dashboard/Users/UserDashboard";
import SuperAdminDashboard from "@/components/Dashboard/SuperAdmin/Dashboard";


const page = async() => {
  const user= await currentUser()
console.log(user,'user')
    const userRole= user?.unsafeMetadata?.userRole as string;
    const userEmail=user?.emailAddresses[0]?.emailAddress as string;
    const userId=user?.id as string;
  return <>
{/* <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-snug mt-6 mb-4">
  User Role of Current User is{' '}
  <span className="text-[#0059ff] underline  underline-offset-4">
    {userRole}
  </span>
</h1> */}
{/* <RegisterUser/> */}
      {userRole === "venueowner" ? (
        <Venues userRole={userRole} userEmail={userEmail} />
      ) : userRole === "superadmin" ? (
        <SuperAdminDashboard userRole={userRole} />
      ) : (
        <UserDashboard
          userEmail={userEmail}
          userRole={userRole}
          userId={userId}
        />
      )}
    </>
};

export default page;
