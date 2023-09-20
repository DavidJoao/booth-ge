import React from 'react'
import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/custom/AuthProvider'
import DailyCard from '@/components/DailyCard'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import CCSection from '@/components/CCSection'

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

  return (
    <div className='bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-start pt-[80px] lg:p-4 lg:pt-[80px]'>
        <h3 className='mt-2'>Daily Reports</h3>
        { auth.isAdmin || auth.isModerator ? (
            <>
                <div className='flex items-center justify-center w-[350px] pl-2 pr-2'>
                    <h4 className='mr-3 text-lg my-0'>Filter</h4>
                    <input className='input my-0' placeholder='Jobsite, Foreman, Equipment, Employee' onChange={(e) => setSearch(e.target.value)}/>
                </div>
                <div className='flex flex-row items-center justify-center w-[350px] pl-2 pr-2 mt-1'>
                    <p className='my-0 text-lg mr-4'>From</p>
                    <input className='input m-1' type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                    <p className='my-0'>to</p>
                    <input className='input m-1' type='date' value={finishDate} onChange={(e) => setFinishDate(e.target.value)}/>
                </div>
                <button className='buttons w-[150px] mt-2 mb-2' onClick={(e) => {
                    e.preventDefault()
                    setStartDate('')
                    setFinishDate('')
                    setSearch('')
                }}>Clear Filters</button>
            </>
        ) : ( 
            <></>
        )}
        <div id='dropdown' className='rounded w-full lg:w-full min-h-[500px] h-auto lg:p-4 flex flex-col items-center justify-start'>
        {auth.isAdmin || auth.isModerator ? 
        dailies
            .filter(
                daily =>
                (startDate === '' && finishDate === '') ||
                (startDate <= daily.date && daily.date <= finishDate)
            )
            .filter(
                daily => search === '' 
                || daily.foreman.toLowerCase().includes(search.toLowerCase()) 
                || daily.equipment.some(items => (`${items.name}`).toLowerCase().includes(search.toLowerCase()))
                || daily.employees.some(employees => (`${employees.name}`).toLocaleLowerCase().includes(search.toLowerCase()))
                || daily.name.toLowerCase().includes(search.toLowerCase())
            )
            .reverse()
            .map(daily => (
                <DailyCard key={daily._id} daily={daily} loadAll={loadAll} auth={auth} />
        )) : auth.isAdmin === false && auth.isModerator === false ?
        dailies
            .filter(
                daily => auth.name.toLowerCase().includes(daily.foreman.toLowerCase()))
            .reverse()
            .map(daily => (
                <DailyCard key={daily._id} daily={daily} loadAll={loadAll} auth={auth} />
        )) : (
            <></>
        )}
        </div>
        <CCSection />
    </div>
  )
}

export default Reports