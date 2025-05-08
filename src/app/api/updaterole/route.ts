import { NextRequest } from 'next/server';
// import { users } from '@clerk/nextjs';
import { createClerkClient } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
export async function POST(request: NextRequest) {
    const requestBody = await request.json();
    const id= requestBody.data.id
    const unsafe_metadata = requestBody.data.unsafe_metadata
    const client= await clerkClient()
    try {
        // await users.updateUser(id, { role: unsafe_metadata.userRole });
        client.users.updateUserMetadata(id, {
            publicMetadata: { role: unsafe_metadata.userRole },
          });
      
        console.log(`User role updated successfully for userId: ${id}`);
    } catch (error) {
        console.error(`Failed to update user role for userId: ${id}`, error);
    }
}