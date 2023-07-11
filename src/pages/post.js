
import { useState, useContext, useEffect } from 'react'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import CCSection from '@/components/CCSection'


const Post = () => {
    
    const { auth, setAuth, loadAll, equipment } = useContext(AuthContext)
    const date = new Date()
    
    const initialPost = {
        address: '',
        name: '',
        superintendent: '',
        employees: [],
        startTime: '',
        contractor: '',
        status: 'active'
    }

    const initialNotification = {
        author: auth.name,
        date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
        message: '',
        title: '',
        link: '',
    }

    const initialEquipment = {
        number: '',
        name: ''
    }

    const intiialAccessory = {
        name: ''
    }

    const initialRepair = { 
        name: "",
        reason: "",
        date: Date().split(' ').splice(0, 5).join(' ')
    }
    
    const router = useRouter()
    const [jobPost, setJobPost] = useState(initialPost)
    const [notification, setNotification] = useState(initialNotification)
    const [postEquipment, setEquipment] = useState(initialEquipment)
    const [accessory, setAccessory] = useState(intiialAccessory)
    const [repair, setRepair] = useState(initialRepair)

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
        console.log(model)
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
                <textarea name='message' className='input' value={notification.message} onChange={(e) => handleChange(e, setNotification, notification)}/>
                <label>Link (Google Drive Link For Safety Meetings):</label>
                <input name='link' value={notification.link} className='input' onChange={(e) => handleChange(e, setNotification, notification)} />
                <button type='submit' className='buttons mx-auto mt-2'>Post</button>
            </form>
        </div>
        <div className='form-container'>
            <form className='form' onSubmit={(e) => {
                e.preventDefault()
                handleSubmit('equipment', postEquipment, setEquipment, initialEquipment)
            }}>
                <h3>Add postEquipment</h3>
                <label>Number:</label>
                <input value={postEquipment.number} placeholder='315' name='number' className='input' onChange={(e) => handleChange(e, setEquipment, postEquipment)}/>
                <label>Name:</label>
                <input value={postEquipment.name} placeholder='Excavator' name='name' className='input' onChange={(e) => handleChange(e, setEquipment, postEquipment)}/>
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
        <div className='form-container'>
            <form className='form' onSubmit={(e) => {
                e.preventDefault()
                handleSubmit('repair', repair, setRepair, initialRepair)
            }}>
                <h3>Add Equipment Under Repair </h3>
                <label>Equipment:</label>
                <select className='input' name='name' value={repair.name} placeholder="" onChange={(e) => handleChange(e, setRepair, repair)}>
                    <option>Select an equipment</option>
                    { equipment && equipment.map((equipment => {
                        return (
                            <option>{equipment.number} {equipment.name}</option>
                        )
                    })) }
                </select>
                <label>Reason of repair: </label>
                <input className='input' onChange={(e) => handleChange(e, setRepair, repair)}/> 
                <button className='buttons w-[200px] mt-2'>Post Report</button>
            </form>

        </div>
        <CCSection />
    </div>
  )
}

export default Post