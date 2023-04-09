
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
    
    const [jobPost, setJobPost] = useState(initialPost)
    const { auth, setAuth } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        CheckSession(AuthContext, setAuth)
        if (!auth.isAdmin) router.push('/home')
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobPost({
            ...jobPost,
            [name]: value
        })
        console.log(jobPost)
    }

    const handleSubmit = (e) => {
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
    <div className='flex flex-col items-center h-[600px] p-2'>
        <h1>Post Job</h1>
        <form onSubmit={handleSubmit} className='form'>
            <label>Jobsite Name:</label>
            <input name='name' value={jobPost.name} className='input' onChange={handleChange}/>
            <label>Address:</label>
            <input name='address' value={jobPost.address} className='input' onChange={handleChange}/>
            <label>Super Intendent:</label>
            <input name='superintendent' value={jobPost.superintendent} className='input' onChange={handleChange}/>
            <label>Start Time:</label>
            <input name='startTime' type='time' className='input' onChange={handleChange}/>
            <button type='submit' className='buttons mx-auto mt-2'>Post</button>
        </form>
    </div>
  )
}

export default post