import CreateForm from '@/components/Dashboard/Venues/Form/CreateForm/CreateForm'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const page = async() => {
    const user= await currentUser()
  
    const userEmail= user?.emailAddresses[0].emailAddress as string;
    console.log(user)
  return (
    <div>
      <CreateForm userEmail={userEmail}/>
    </div>
  )
}

export default page
