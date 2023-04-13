import AuthContext from '@/custom/AuthProvider'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'
import JobsiteCard from '@/components/JobsiteCard'

const Home = () => {

    const { auth, setAuth, jobsites, loadAll } = useContext(AuthContext)
    const router = useRouter()
    const [singleJobsite, setSingleJobsite] = useState([])
    
    useEffect(() => {
      loadAll()
      setSingleJobsite(jobsites.filter(jobsite => jobsite.employees == auth.name))
    }, [router])
    
    useEffect(() => {
      if (!auth.token) router.push('/login')
      CheckSession(AuthContext, setAuth)
    }, [])
    
  return (
    <div className='flex flex-col items-start bg-slate-200'>
        <h1 className='font-bold text-2xl m-2 text-white rounded p-1 bg-[#3b2c19]'>Welcome {auth && auth.name}</h1>
        <div className='home-container'>
            <div className='notifications-container'>
                <h1 className='text-[25px] border-[1px] border-black w-full h-[15%] lg:h-[7%] flex items-center justify-center rounded-lg'>Administration Notifications</h1>
            </div>
            <div className='jobsite-container'>
                { auth.isAdmin ? 
                    jobsites && jobsites.map(jobsite => {
                        return( <JobsiteCard jobsite={jobsite} auth={auth}/> )})
                :
                    singleJobsite && singleJobsite.map(jobsite => {
                        return( <JobsiteCard jobsite={jobsite} auth={auth}/> )})
            }
            </div>
        </div>
    </div>
  )
}

export default Home