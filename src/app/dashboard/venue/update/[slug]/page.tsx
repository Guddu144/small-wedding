import React from 'react';
import UpdateForm from '@/components/Dashboard/Venues/Form/UpdateForm/UpdateForm';

type Params = Promise<{ slug: string }>

export default async function Page(props: {
  params: Params

}) {
  const params = await props.params

  const slug = params.slug

  return (
    <div>
      <UpdateForm slug={slug} />
    </div>
  );
};


