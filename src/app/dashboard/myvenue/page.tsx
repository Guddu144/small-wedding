import MyVenue from "@/components/Index/VenuesList/MyVenue";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const user = await currentUser();

  const userEmail = user?.emailAddresses[0].emailAddress as string;
  console.log(user);
  const userRole = user?.publicMetadata?.role as string;

  return <div>
    <MyVenue userEmail={userEmail} userRole={userRole}/>
  </div>;
};

export default page;
