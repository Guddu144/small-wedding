import VenuesPage from '@/components/Index/VenuesList/VenuesList'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const page = async() => {
    const user= await currentUser()
    const userRole= user?.unsafeMetadata?.userRole as string;
    const userEmail=user?.emailAddresses[0]?.emailAddress as string;
  return (
    <div>
      <VenuesPage userEmail={userEmail} userRole={userRole}/>
    </div>
  )
}

export default page
