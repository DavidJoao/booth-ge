import AuthContext from '@/custom/AuthProvider'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'
import JobsiteCard from '@/components/JobsiteCard'
import axios from '@/custom/axios'
import NotificationCard from '@/components/NotificationCard'
import { PuffLoader } from 'react-spinners'

const Home = () => {

    const { auth, setAuth, jobsites, loadAll, notifications } = useContext(AuthContext)
    const router = useRouter()
    const [singleJobsite, setSingleJobsite] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function fetchData () {
            if (auth.isAdmin === true || auth.isModerator === true) {
                axios.get('/api/jobsite/all') 
            } else {
                axios.get(`/api/jobsite/findOne/${auth.email}`)
                .then(res => setSingleJobsite([res.data]))
            }
        }
        fetchData();
    }, [router])
    
    useEffect(() => {
        loadAll()
        CheckSession(AuthContext, setAuth).then(() => setIsLoading(false));
    }, [])

    useEffect(() => {
        if (!isLoading && !auth.token) router.push('/login');
      }, [isLoading, auth.token]);

      if (isLoading) {
        return (
        <div className='h-screen bg-[#242526] flex flex-col items-center justify-center'>
            <PuffLoader color='#ffffff' loading={isLoading} size={120}/>
            <p mt-4>Loading, Please Wait...</p>
        </div>
        )
      }
    
  return (
    <div className='flex flex-col items-start bg-[#242526] min-h-screen h-auto pt-[80px]'>
        <h1 className='font-bold text-2xl m-2 text-white rounded p-1'>Welcome {auth && auth.name}</h1>
        <div className='home-container'>
            <div className='notifications-container bg-[#3a3b3c]  min-h-[300px] '>
                <h1 className='text-[25px] border-[1px] border-black w-full h-[15%] lg:h-[7%] flex items-center justify-center rounded-lg bg-[#494A4C]'>Administration Notifications</h1>
                { notifications && notifications.map(notification => {
                    return ( <NotificationCard key={notification._id} notification={notification} auth={auth} loadAll={loadAll} /> )
                }) }
                { notifications && notifications.length === 0 ? <p>No notifications</p> : <></>}
            </div>
            <div className='jobsite-container scroll min-h-[300px]'>
                { auth.isAdmin || auth.isModerator ? 
                    jobsites && jobsites.sort(function (a, b) {
						if (a.name < b.name) {
							return -1;
						}
						if (a.name > b.name) {
							return 1;
						}
						return 0
					}).map(jobsite => {
                        return( <JobsiteCard key={jobsite._id} jobsite={jobsite} auth={auth}/> )})
                :
                    singleJobsite && singleJobsite.map(jobsite => {
                        return( <JobsiteCard key={jobsite._id} jobsite={jobsite} auth={auth}/> )})
            }
            </div>
        </div>
    </div>
  )
}

export default Home