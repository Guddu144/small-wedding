import Wishlist from "@/components/Dashboard/Venues/Wishlist/Wishlist";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const user = await currentUser();

  const userEmail = user?.emailAddresses[0]?.emailAddress as string;
  return (
    <div>
      <Wishlist userEmail={userEmail} />
    </div>
  );
};

export default page;
