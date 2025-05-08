
import { SignedIn, SignedOut } from "@clerk/nextjs";

import Link from "next/link";


export default  function Home() {
 
  return (
 <>
  {/* <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Your role is: {role}</p>
    </div> */}
 <div className="abolute top-0 bg_image_main flex flex-col justify-center h-full ">
      <div className="main_container inside_sidespace    ">
        <div className="flex justify-between gap-6 items-end">
          <div className="max-w-[532px] flex flex-col">
            <h1 className="text-[32px]  md:text-[42px] text-[#fff] font-semibold tracking-[0.5px] leading-[42px]">
              Find the best small wedding or elopement in your location and
              beyond
            </h1>
            <p className="text-[16px] mt-[8px] mb-[16px] text-[#d0d0d0] leading-[24px]">
              Find the best small wedding or elopement in your location and
              beyond
            </p>

            <SignedIn>
            <Link
              style={{
                background:
                  "#000",
              }}
              className="text-[16px] w-fit font-semibold leading-[24px] text-[#fff] rounded-[46px] px-[16px] py-[14px] flex gap-2 items-center"
              href="/dashboard"
              title="wedding"
            >
              Go to Dashboard
            </Link>
              </SignedIn>
         
         <SignedOut>
     <div className="flex gap-3">
     <Link className="text-[16px] w-fit font-semibold leading-[24px] text-[#fff] rounded-[46px] px-[16px] py-[14px] flex gap-2 items-center bg-[#000]" href={`/sign-up?role=admin`}>Signup as Admin</Link>
              <Link className="text-[16px] w-fit font-semibold leading-[24px] text-[#fff] rounded-[46px] px-[16px] py-[14px] flex gap-2 items-center bg-[#000]" href={`/sign-up?role=venueowner`}>Signup as Venue Owner</Link>
              <Link className="text-[16px] w-fit font-semibold leading-[24px] text-[#fff] rounded-[46px] px-[16px] py-[14px] flex gap-2 items-center bg-[#000]" href={`/sign-up?role=user`}>Signup as User</Link>

     </div>
         </SignedOut>
          </div>

      
         
        </div>
      </div>
    </div>
    </>
  );
}
