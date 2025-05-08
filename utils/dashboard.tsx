export const fetchOfficeData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/office`,{
        headers: {
          'Content-Type': 'application/json'
        }, next:{revalidate:5}
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

export const fetchGetVenueData = async (page = 1, limit = 9) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/venues/get?page=${page}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 5 },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};



  export const fetchGetSingleVenueData = async (venue_id:string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/venues/getone?venue_id=${venue_id}`,{
        headers: {
          'Content-Type': 'application/json'
        }, next:{revalidate:5}
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };