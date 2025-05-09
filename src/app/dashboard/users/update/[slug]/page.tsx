import React from "react";
import UpdateUserForm from "@/components/Dashboard/Users/CRUD/UpdateUser/UpdateForm";

type Params = Promise<{ slug: string }>

export default async function Page(props: {
  params: Params

}) {
  const params = await props.params

  const slug = params.slug
  return (
    <div>
      <UpdateUserForm slug={slug} />
    </div>
  );
};


