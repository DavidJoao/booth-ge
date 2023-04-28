import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import TimesheetCard from '@/components/TimesheetCard'
import Link from 'next/link'

const Timesheets = () => {

    const { auth, setAuth, loadAll, timesheets } = useContext(AuthContext)
    const router = useRouter()
    const [search, setSearch] = useState('')

    useEffect(() => {
      if (auth.isAdmin === false) router.push('/home')
    })

    useEffect(() => {
      loadAll()
      CheckSession(AuthContext, setAuth)
    }, [])

  return (
    <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center">
      { auth.isAdmin ? 
      <>
        <div className='flex w-[350px] items-center justify-center mb-2'>
            <h4 className='w-[300px]'>Search by name</h4>
            <input className='input' onChange={(e) => setSearch(e.target.value)}/>
        </div>
        <div className='w-full lg:w-[90%] h-auto p-3'>
            { timesheets && timesheets.filter( timesheet => 
              search === '' || timesheet.author.toLowerCase().includes(search.toLowerCase())).map(timesheet => <TimesheetCard key={timesheet._id} loadAll={loadAll} timesheet={timesheet}/>) }
        </div>
      </>
      :
      <>
        <p>User not authorized</p>
        <Link className='buttons' href="/home">Redirect Home</Link>
      </>
       }
    </div>
  )
}

export default Timesheets