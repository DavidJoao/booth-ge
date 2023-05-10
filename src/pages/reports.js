import React from 'react'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/custom/AuthProvider'
import DailyCard from '@/components/DailyCard'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'

const Reports = () => {

    const { auth, setAuth, loadAll, dailies } = useContext(AuthContext)
    const [search, setSearch] = useState('')
    const router = useRouter()

    useEffect(() => {
        if ( auth.token === undefined) {
            router.push('/login')
        } else {
            loadAll()
            CheckSession(AuthContext, setAuth)
        }
    }, [])

    useEffect(() => {
        if ( auth.isModerator === false) router.push('/home')
      })


  return (
    <div className='bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-start pt-[80px] lg:p-4 lg:pt-[80px]'>
        <h3 className='mt-2'>Daily Reports</h3>
        <div className='flex items-center justify-center'>
            <h4 className='w-[300px]'>Search by Foreman</h4>
            <input className='input' onChange={(e) => setSearch(e.target.value)}/>
        </div>
        <div id='dropdown' className='rounded w-full lg:w-full min-h-[500px] h-auto lg:p-4 flex flex-col items-center justify-start'>
            { dailies && dailies.filter( daily => 
                search === '' || daily.foreman.toLowerCase().includes(search.toLowerCase())).reverse().map(daily => {
                    return(
                        <>
                            <DailyCard key={daily._id} daily={daily} loadAll={loadAll} auth={auth}/>
                        </>   
                    )
                }) }
        </div>
    </div>
  )
}

export default Reports