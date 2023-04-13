
import { useState, useContext, useEffect } from 'react'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'


const post = () => {
    
    const initialPost = {
        address: '',
        name: '',
        superintendent: '',
        employees: [],
        startTime: ''
    }

    const initialNotification = {
        author: '',
        date: '',
        message: '',
        title: '',
    }
    
    const { auth, setAuth } = useContext(AuthContext)
    const router = useRouter()
    const [jobPost, setJobPost] = useState(initialPost)
    const [notification, setNotification] = useState(initialNotification)

    useEffect(() => {
        CheckSession(AuthContext, setAuth)
        if (!auth.isAdmin) router.push('/home')
    }, [])

    const handlePostChange = (e) => {
        const { name, value } = e.target;
        setJobPost({
            ...jobPost,
            [name]: value
        })
        console.log(jobPost)
    }

    const handlePostSubmit = (e) => {
        e.preventDefault()

        try {
            axios.post('/api/jobsite/post', JSON.stringify(jobPost), { headers: { 'Content-Type': 'application/json' } })
                .then(res => console.log(res))
                .catch(err => console.log(err))

            setJobPost(initialPost)
            router.push('/home')
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='w-full flex flex-col items-center justify-center h-[680px] xl:h-[820px] bg-slate-200'>
        <div className='w-full flex flex-col items-center'>
            <h1>Post Job</h1>
            <form onSubmit={handlePostSubmit} className='form'>
                <label>Jobsite Name:</label>
                <input name='name' value={jobPost.name} className='input' onChange={handlePostChange}/>
                <label>Address:</label>
                <input name='address' value={jobPost.address} className='input' onChange={handlePostChange}/>
                <label>Super Intendent:</label>
                <input name='superintendent' value={jobPost.superintendent} className='input' onChange={handlePostChange}/>
                <label>Start Time:</label>
                <input name='startTime' type='time' className='input' onChange={handlePostChange}/>
                <button type='submit' className='buttons mx-auto mt-2'>Post</button>
            </form>
        </div>
        <div className='w-full flex flex-col items-center mt-3'>
            <h1>Post Notification</h1>
            <form className='form'>
                <label>Title:</label>
                <input name='title' className='input' value={notification.title}/>
                <label>Message:</label>
                <textarea name='message' className='input' value={notification.message}/>
                <button type='submit' className='buttons mx-auto mt-2'>Post</button>
            </form>
        </div>
    </div>
  )
}

export default post