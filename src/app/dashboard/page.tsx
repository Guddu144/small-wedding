
import { currentUser } from "@clerk/nextjs/server";
import RegisterUser from "../../components/Dashboard/Users/CRUD/RegisterUser";
import Venues from "@/components/Dashboard/Venues/Venues";
import UserManagement from "@/components/Dashboard/Users/UserManagement";
import UserDashboard from "@/components/Dashboard/Users/UserDashboard";


const page = async() => {
  const user= await currentUser()

  const userRole= user?.unsafeMetadata?.userRole as string;
    const userEmail=user?.emailAddresses[0]?.emailAddress as string;
  console.log(user,'user')
  return <>
{/* <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-snug mt-6 mb-4">
  User Role of Current User is{' '}
  <span className="text-[#0059ff] underline  underline-offset-4">
    {userRole}
  </span>
</h1> */}
{/* <RegisterUser/> */}
  {
    userRole==="venueowner"? 
    <Venues userRole={userRole} userEmail={userEmail}/>:
    <UserDashboard userEmail={userEmail} userRole={userRole}/>
  }
  </>;
};

export default page;
