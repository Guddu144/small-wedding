"use client"
import React, { useEffect, useState } from 'react'
import { fetchGetVenueData } from '../../../../utils/dashboard'

const ViewVenue = () => {
    const [venue,setVenue]=useState()

    const fetchVenueGet=async()=>{
        try{
            const fetchData=await fetchGetVenueData()
            console.log(fetchData.result.venues)
            setVenue(fetchData.result.venues)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchVenueGet()
    },[])
  return (
    <div>
      {venue.length}
    </div>
  )
}

export default ViewVenue
