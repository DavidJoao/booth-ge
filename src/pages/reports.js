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
    const [startDate, setStartDate] = useState('')
    const [finishDate, setFinishDate] = useState('')
    
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
        <div className='flex flex-row items-center justify-center pl-2 pr-2'>
            <h4 className='w-[300px] text-lg my-0'>Search by Foreman</h4>
            <input className='input my-0' onChange={(e) => setSearch(e.target.value)}/>
        </div>
        <div className='flex items-center justify-center pl-3 pr-3 mt-1'>
            <p className='my-0'>From</p>
            <input className='input m-1' type='date' onChange={(e) => setStartDate(e.target.value)}/>
            <p className='my-0'>to</p>
            <input className='input m-1' type='date' onChange={(e) => setFinishDate(e.target.value)}/>
        </div>
        <button className='buttons w-[150px] mt-2 mb-2' onClick={(e) => {
            e.preventDefault()
            setStartDate('')
            setFinishDate('')
            setSearch('')
        }}>Clear Filters</button>
        <div id='dropdown' className='rounded w-full lg:w-full min-h-[500px] h-auto lg:p-4 flex flex-col items-center justify-start'>
        {dailies
            .filter(daily => search === '' || daily.foreman.toLowerCase().includes(search.toLowerCase()))
            .filter(daily => startDate === '' && finishDate === '' || startDate <= daily.date && daily.date <= finishDate)
            .reverse()
            .map(daily => (
                <DailyCard key={daily._id} daily={daily} loadAll={loadAll} auth={auth} />
        ))}
        </div>
    </div>
  )
}

export default Reports