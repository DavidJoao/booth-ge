import AuthContext from '@/custom/AuthProvider'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'
import JobsiteCard from '@/components/JobsiteCard'
import axios from '@/custom/axios'

const Home = () => {

    const { auth, setAuth, jobsites, loadAll } = useContext(AuthContext)
    const router = useRouter()
    const [singleJobsite, setSingleJobsite] = useState([])
    const [notifications, setNotifications] = useState([])

    const handleSingleJobsite = (e) => {
        jobsites.map(jobsite => {
            if (jobsite.employees.includes(auth.name) == true ) setSingleJobsite([jobsite])
        })
    }
    
    useEffect(() => {
        loadAll()
        handleSingleJobsite()
    }, [router])

    useEffect(() => {
        axios.get('/api/notification/all')
            .then(res => {
                setNotifications(res.data)
            })
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
                { notifications && notifications.map(notification => {
                    return ( <h1>Hello</h1> )
                }) }
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