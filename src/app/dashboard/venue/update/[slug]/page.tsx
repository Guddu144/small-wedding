import UpdateForm from '@/components/dashboard/Form/UpdateForm/UpdateForm'
import React from 'react'

interface ParamsProps {
  params: {
    slug: string;
  };
}
const page = ({params}: ParamsProps) => {
  const {slug}=params
  console.log(slug)
  return (
    <div>
  
      <UpdateForm slug={slug}/>
    </div>
  )
}

export default page
