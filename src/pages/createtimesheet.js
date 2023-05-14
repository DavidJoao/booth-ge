import AuthContext from "@/custom/AuthProvider"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "@/custom/axios"
import { PuffLoader } from "react-spinners"

const CreateTimesheet = () => {

    const { auth, loadAll, jobsites } = useContext(AuthContext)
    const router = useRouter()

    const initialForm = {
        date: '',
        jobsite: '',
        foreman: '',
        startTime: '',
        finishTime: '',
        totalHrs: '',
        description: ''
    }

    const [form, setForm] = useState(initialForm)
    const [days, setDays] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState('Submitting Timesheet, Please Wait...')

    const initialTimesheet = {
        author: auth.name,
        days: days,
    }

    useEffect(() => {
        loadAll()
        if (auth.token === null || auth.token === undefined ) router.push('/login')
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleNextDay = () => {
        days.push(form)
        setForm(initialForm)
    }

    const handleSubmit = () => {
        setIsLoading(true)

        axios.post(`/api/timesheet/post`, JSON.stringify(initialTimesheet), { headers: { 'Content-Type': 'application/json '} })
        .then( res => {
            loadAll()
            setForm(initialForm)
            setDays([])
            setStatusMessage('✓ Timesheet Submitted Successfully ✓')
            setTimeout(() => {
                setIsLoading(false)
              }, "2000");
        })
        .catch(err => console.log(err))
    }

  return (
    <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center pt-[80px]">
            { isLoading ? 
                <div className='flex flex-col items-center justify-center'>
                    <PuffLoader color='#ffffff' loading={isLoading} size={120}/>
                    <p className="mt-4">{statusMessage}</p>
                </div>
            :  
                <>
                <h2>Day {days.length + 1} of 5</h2>
                <div className="daily-container">
                    <label>Date:</label>
                    <input required name="date" value={form.date} type="date" className="input" onChange={handleChange}/>
                    <label>Jobsite:</label>
                    <select name='jobsite' value={form.jobsite} onChange={handleChange} className='input' id='jobsites'>
                        <option value="" selected disabled hidden>Choose Jobsite</option>
                        { jobsites && jobsites.map(jobsite => {
                            return (
                                <option key={jobsite.address} name="name" value={jobsite.address}>{jobsite.address}</option>
                            )
                        })}
                    </select>
                    <label>Foreman:</label>
                    <input required name="foreman" value={form.foreman} className="input" placeholder="Ex. Alfredo" onChange={handleChange}/>
                    <label>Start Time:</label>
                    <input required name="startTime" value={form.startTime} type="time" className="input" placeholder="7:00" onChange={handleChange}/>
                    <label>Finish Time:</label>
                    <input required name="finishTime" value={form.finishTime} type="time" className="input" placeholder="3:30" onChange={handleChange}/>
                    <label>Total Hrs:</label>
                    <input required name="totalHrs" value={form.totalHrs} className="input" placeholder="8" onChange={handleChange}/> 
                    <label>Description:</label>
                    <textarea required name="description" value={form.description} className="input h-[100px]" placeholder="Description of work performed" onChange={handleChange}></textarea>
                </div>
                { days && days.length >= 4 ? 
                <>
                    <button className="buttons" onClick={(e) => {
                        e.preventDefault();
                        days.push(form)
                        handleSubmit()
                    }}>Submit</button>
                </>
                    :
                    <button className="buttons" onClick={handleNextDay}>Next Day</button>
                 }
                </>
            }
    </div>
  )
}

export default CreateTimesheet