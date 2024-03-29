import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import TimesheetCard from '@/components/TimesheetCard'
import Link from 'next/link'
import CCSection from '@/components/CCSection'
import axios from '@/custom/axios'

const Timesheets = () => {

    const { auth, setAuth, loadAll, timesheets, setTimesheetCount, timesheetCount, setTimesheets } = useContext(AuthContext)
    const router = useRouter()
    const [search, setSearch] = useState('')

    useEffect(() => {
      if (auth.isModerator === false) router.push('/home')
    })

    useEffect(() => {
      loadAll()
      CheckSession(AuthContext, setAuth)
    }, [])

    const handleMoreResults = async (e) => {
      e.preventDefault();

      setTimesheetCount(prevCount => {
        const newCount = prevCount + 5;
        axios.get(`/api/timesheet/all/${newCount}`)
          .then(res => setTimesheets(res.data));
        return newCount;
      });
    }

  return (
    <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center pt-[80px]">
      { auth.isModerator ? 
      <>
        <div className='flex w-[350px] items-center justify-center p-1'>
            <h4 className='w-[300px] my-0'>Search by name</h4>
            <input className='input' onChange={(e) => setSearch(e.target.value)}/>
        </div>
        <div className='w-full lg:w-[90%] h-auto p-3 pt-0'>
            { timesheets && timesheets.filter( timesheet => 
              search === '' || timesheet.author.toLowerCase().includes(search.toLowerCase())).map(timesheet => <TimesheetCard key={`${timesheet._id}${timesheet.author}${timesheet.dateCreated}`} loadAll={loadAll} timesheet={timesheet} auth={auth}/>) }
        </div>
        <button className='buttons w-[300px]' onClick={handleMoreResults}> Load 5 more results | Currently {timesheetCount} </button>
      </>
      :
      <>
        <p>User not authorized</p>
        <Link className='buttons' href="/home">Redirect Home</Link>
      </>
       }
    <CCSection />
    </div>
  )
}

export default Timesheets