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
      if (!auth.token) router.push('/login')
      CheckSession(AuthContext, setAuth)
    }, [])

    useEffect(() => {
      axios.get('/api/jobsite/all')
        .then(res => setJobsites(res.data))
    }, [])

  return (
    <div>
        <h1>Welcome {auth && auth.name}</h1>
        <p>Jobsites:</p>
        { jobsites && jobsites.map(jobsite => {
          return(
            <JobsiteCard jobsite={jobsite}/>
          )
        }) }
    </div>
  )
}

export default Home