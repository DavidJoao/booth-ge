
import { useState, useContext, useEffect } from 'react'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'


const post = () => {
    
    const { auth, setAuth } = useContext(AuthContext)
    const date = new Date()
    
    const initialPost = {
        address: '',
        name: '',
        superintendent: '',
        employees: [],
        startTime: ''
    }

    const initialNotification = {
        author: auth.name,
        date: `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`,
        message: '',
        title: '',
    }

    const initialEquipment = {
        number: '',
        name: ''
    }
    
    const router = useRouter()
    const [jobPost, setJobPost] = useState(initialPost)
    const [notification, setNotification] = useState(initialNotification)
    const [equipment, setEquipment] = useState(initialEquipment)

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
    }

    const handleNotificationChange = (e) => {
        const { name, value } = e.target;
        setNotification({
            ...notification,
            [name]: value
        })
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

    const handleNotificationSubmit = (e) => {
        e.preventDefault()

        try {
            axios.post('/api/notification/post', JSON.stringify(notification), { headers: { 'Content-Type': 'application/json' } })
            .then(res => console.log(res))
            .catch(err => console.log(err))

        setNotification(initialNotification)
        router.push('/home')
        } catch (error) {
            console.log(error)
        }
    }

    const handleEquipmentSubmit = (e) => {
        e.preventDefault()

        try {
        
        } catch {

        }
    }

    const handleSubmit = (route, model, setX, initialX) => {
        try {
            axios.post(`/api/${route}/post`, JSON.stringify(model), { headers: { 'Content-Type': 'application/json '} })
            .then( res => console.log(res))
            .catch(err => console.log(err))

        setX(initialX)
        router.push('/home')
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 items-center justify-center h-auto md:h-[680px] xl:h-[820px] bg-slate-200'>
        <div className='form-container'>
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit('jobsite', jobPost, setJobPost, initialPost)
            }} className='form'>
                <h3>Post Job</h3>
                <label>Jobsite Name:</label>
                <input required name='name' value={jobPost.name} className='input' onChange={handlePostChange}/>
                <label>Address:</label>
                <input required name='address' value={jobPost.address} className='input' onChange={handlePostChange}/>
                <label>Super Intendent:</label>
                <input required name='superintendent' value={jobPost.superintendent} className='input' onChange={handlePostChange}/>
                <label>Start Time:</label>
                <input required name='startTime' type='time' className='input' onChange={handlePostChange}/>
                <button type='submit' className='buttons mx-auto mt-2'>Post</button>
            </form>
        </div>
        <div className='form-container'>
            <form className='form' onSubmit={(e) => {
                e.preventDefault()
                handleSubmit('notification', notification, setNotification, initialNotification)
            }}>
                <h3>Post Notification</h3>
                <label>Title:</label>
                <input required name='title' className='input' value={notification.title} onChange={handleNotificationChange}/>
                <label>Message:</label>
                <textarea required name='message' className='input' value={notification.message} onChange={handleNotificationChange}/>
                <button type='submit' className='buttons mx-auto mt-2'>Post</button>
            </form>
        </div>
        <div className='form-container'>
            <form className='form' onSubmit={(e) => {
                e.preventDefault()
                handleSubmit('equipment', equipment, setEquipment, initialEquipment)
            }}>
                <h3>Add equipment</h3>
                <label>Number:</label>
                <input value={equipment.number} name='number' className='input'/>
                <label>Name:</label>
                <input value={equipment.name} name='name' className='input'/>
                <button type='submit' className='buttons mx-auto mt-2'>Add</button>
            </form>
        </div>
    </div>
  )
}

export default post