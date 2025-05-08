
import Dashboard from "@/components/dashboard/Dashboard";
import { currentUser } from "@clerk/nextjs/server";

const page = async() => {
  const user= await currentUser()
  const userRole=  user?.publicMetadata?.role
  return <>
<h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-snug mt-6 mb-4">
  User Role of Current User is{' '}
  <span className="text-[#0059ff] underline  underline-offset-4">
    {userRole}
  </span>
</h1>
    <Dashboard userRole={userRole}/>
    {/* {userRole == "admin" ?   <Dashboard userRole={userRole}/> : userRole=="venueowner" ? "Venue Dashboard" : "User Dashboard"} */}

  </>;
};

export default page;
