import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
     <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Page Not Found</p>
      <Link href="/" className="text-blue-500 hover:underline">Go back to Home</Link>

    </div>
  )
}

export default NotFound
