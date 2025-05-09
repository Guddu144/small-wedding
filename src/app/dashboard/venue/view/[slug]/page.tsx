import React from "react";
import { fetchGetSingleVenueData } from "../../../../../../utils/dashboard";

type Params = Promise<{ slug: string }>

export default async function Page(props: {
  params: Params

}) {
  const params = await props.params

  const slug = params.slug
  const fetchData = await fetchGetSingleVenueData(slug);
  const venue = fetchData?.result;

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Venue Details</h1>

      {venue ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
          {Object.entries(venue).map(([key, value]) => (
            <div key={key} className="flex flex-col border p-4 rounded bg-gray-50">
              <span className="text-gray-500 font-medium">{key}</span>
              <span className="text-black break-all">{String(value)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500 text-center">No data found for this venue.</p>
      )}
    </div>
  );
};


