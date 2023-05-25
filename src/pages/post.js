
import { useState, useContext, useEffect } from 'react'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'


const Post = () => {
    
    const { auth, setAuth, loadAll } = useContext(AuthContext)
    const date = new Date()
    
    const initialPost = {
        address: '',
        name: '',
        superintendent: '',
        employees: [],
        startTime: '',
        contractor: ''
    }

    const initialNotification = {
        author: auth.name,
        date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
        message: '',
        title: '',
    }

    const initialEquipment = {
        number: '',
        name: ''
    }

    const intiialAccessory = {
        name: ''
    }
    
    const router = useRouter()
    const [jobPost, setJobPost] = useState(initialPost)
    const [notification, setNotification] = useState(initialNotification)
    const [equipment, setEquipment] = useState(initialEquipment)
    const [accessory, setAccessory] = useState(intiialAccessory)

    useEffect(() => {
        CheckSession(AuthContext, setAuth)
        if (!auth.isModerator) router.push('/home')
    }, [])

    const handleChange = (e, setX, model) => {
        const { name, value } = e.target;
        setX({
            ...model,
            [name]: value
        })
    }

    const handleSubmit = (route, model, setX, initialX) => {
        try {
            axios.post(`/api/${route}/post`, JSON.stringify(model), { headers: { 'Content-Type': 'application/json '} })
            .then( res => console.log(res))
            .catch(err => console.log(err))

        setX(initialX)
        loadAll()
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='grid grid-cols-1 gap-4 items-center justify-center h-auto md:h-[680px] xl:h-[820px] bg-[#242526] pt-[80px]'>
        <div className='form-container'>
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit('jobsite', jobPost, setJobPost, initialPost)
            }} className='form'>
                <h3>Post Jobsite</h3>
                <label>Jobsite Name:</label>
                <input required name='name' value={jobPost.name} className='input' onChange={(e) => handleChange(e, setJobPost, jobPost)}/>
                <label>Address:</label>
                <input required name='address' value={jobPost.address} className='input' onChange={(e) => handleChange(e, setJobPost, jobPost)}/>
                <label>Super Intendent:</label>
                <input required name='superintendent' value={jobPost.superintendent} className='input' onChange={(e) => handleChange(e, setJobPost, jobPost)}/>
                <label>Contractor:</label>
                <input required name='contractor' value={jobPost.contractor} className='input' onChange={(e) => handleChange(e, setJobPost, jobPost)}/>
                <label>Start Time:</label>
                <input required name='startTime' type='time' className='input' onChange={(e) => handleChange(e, setJobPost, jobPost)}/>
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
                <input required name='title' className='input' value={notification.title} onChange={(e) => handleChange(e, setNotification, notification)}/>
                <label>Message:</label>
                <textarea required name='message' className='input' value={notification.message} onChange={(e) => handleChange(e, setNotification, notification)}/>
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
                <input value={equipment.number} placeholder='315' name='number' className='input' onChange={(e) => handleChange(e, setEquipment, equipment)}/>
                <label>Name:</label>
                <input value={equipment.name} placeholder='Excavator' name='name' className='input' onChange={(e) => handleChange(e, setEquipment, equipment)}/>
                <button type='submit' className='buttons mx-auto mt-2'>Add</button>
            </form>
        </div>
        <div className='form-container'>
            <form className='form' onSubmit={(e) => {
                e.preventDefault()
                handleSubmit('accessory', accessory, setAccessory, intiialAccessory)
            }}>
                <h3>Add Accessory</h3>
                <label>Name:</label>
                <input name='name' value={accessory.name} className='input' placeholder="Ex. 3' bucket" onChange={(e) => handleChange(e, setAccessory, accessory)}/>
                <button className='buttons mx-auto mt-2' type='submit'>Add</button>
            </form>

        </div>
    </div>
  )
}

export default Post