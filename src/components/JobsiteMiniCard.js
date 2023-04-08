import React from 'react'

const JobsiteMiniCard = ( { jobsite } ) => {
  return (
    <>
        <button className='form m-2 w-[200px] border border-white hover:scale-110 duration-200'>{jobsite.address}</button>
    </>
  )
}

export default JobsiteMiniCard