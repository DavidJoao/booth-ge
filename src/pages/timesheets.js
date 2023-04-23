import React, { useEffect } from 'react'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import TimesheetCard from '@/components/TimesheetCard'

const timesheets = () => {

    const { auth, setAuth, loadAll, timesheets } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
      loadAll()
      // if (auth.isAdmin == false) router.push('/home')
      CheckSession(AuthContext, setAuth)
    }, [])

  return (
    <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center">
        <div className='flex w-[350px] items-center justify-center mb-2'>
            <h4 className='w-[300px]'>Search by name</h4>
            <input className='input'/>
        </div>
        <div className='w-full lg:w-[90%] h-auto p-3'>
            { timesheets && timesheets.map(timesheet => {
              return (
                <TimesheetCard key={timesheet._id} timesheet={timesheet}/>
              )
            }) }
        </div>
    </div>
  )
}

export default timesheets