import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const page = async() => {
    const user=await currentUser()
    console.log(user)
  return (
    <div>
      <h1>Profile</h1>
      Username:{user?.firstName}
    </div>
  )
}

export default page
