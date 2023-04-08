import AuthContext from '@/custom/AuthProvider'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'
import axios from '@/custom/axios'
import JobsiteCard from '@/components/JobsiteCard'

const Home = () => {

    const { auth, setAuth } = useContext(AuthContext)
    const [jobsites, setJobsites] = useState([])
    const router = useRouter()

    useEffect(() => {
      axios.get('/api/jobsite/all')
        .then(res => setJobsites(res.data))
    }, [])

    useEffect(() => {
      if (!auth.token) router.push('/login')
      CheckSession(AuthContext, setAuth)
    }, [])

  return (
    <div className='flex flex-col items-center'>
        <h1 className='font-bold text-2xl'>Welcome {auth && auth.name}</h1>
        <p className='font-bold text-2xl'>Current Jobsites:</p>
        <div className='border-[4px] border-[#3b2c19] w-[350px] md:w-full p-4 flex flex-col items-center md:flex-row overflow-auto rounded mx-auto mt-2'>
          { jobsites && jobsites.map(jobsite => {
            return(
              <JobsiteCard jobsite={jobsite}/>
            )
          }) }
        </div>
    </div>
  )
}

export default Home