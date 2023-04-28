import React from 'react'
import { useState, useContext, useEffect } from 'react'
import AuthContext from '@/custom/AuthProvider'
import DailyCard from '@/components/DailyCard'

const reports = () => {

    const { auth, users, loadAll, dailies } = useContext(AuthContext)

    useEffect(() => {
        loadAll()
    }, [])

    console.log(users)
  return (
    <div className='bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-start p-4'>
        <h3 className='mt-2'>Daily Reports</h3>
        <div id='dropdown' className='rounded w-full lg:w-full min-h-[500px] h-auto p-4 flex flex-col items-center justify-start'>
            { dailies && dailies.map((daily) => {
                return (
                    <DailyCard daily={daily} loadAll={loadAll}/>
                )
            }) }
        </div>
    </div>
  )
}

export default reports