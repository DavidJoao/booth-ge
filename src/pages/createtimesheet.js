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
        additional: '',
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

    const timesheet = {
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

        axios.post('/api/timesheet/send', { timesheet })

        axios.post(`/api/timesheet/post`, JSON.stringify(timesheet), { headers: { 'Content-Type': 'application/json '} })
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

    const handleEditChange = (e, index) => {
        const { name, value } = e.target;
      
        const updatedDays = [...days];
        const updatedDay = { ...updatedDays[index], [name]: value }; 
        updatedDays[index] = updatedDay; 
        setDays(updatedDays);
      };

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
                    <input required name="date" value={form.date} type="date" className="input p-2" onChange={handleChange}/>
                    <label>Jobsite:</label>
                    <select name='jobsite' value={form.jobsite} onChange={handleChange} className='input' id='jobsites'>
                        <option value="" selected disabled hidden>Choose Jobsite</option>
                        { jobsites && jobsites.map(jobsite => {
                            return (
                                <option key={jobsite.address} name="name" value={jobsite.address}>{jobsite.address}</option>
                            )
                        })}
                    </select>
                    <label>Additional Jobsite (if any) </label>
                    <input required name="additional" value={form.additional} className="input" onChange={handleChange}/>
                    <label>Foreman:</label>
                    <input required name="foreman" value={form.foreman} className="input" placeholder="Ex. Alfredo" onChange={handleChange}/>
                    <label>Start Time:</label>
                    <input required name="startTime" value={form.startTime} type="time" className="input p-2" placeholder="7:00" onChange={handleChange}/>
                    <label>Finish Time:</label>
                    <input required name="finishTime" value={form.finishTime} type="time" className="input p-2" placeholder="3:30" onChange={handleChange}/>
                    <label>Total Hrs:</label>
                    <input required name="totalHrs" value={form.totalHrs} className="input" placeholder="8" onChange={handleChange}/> 
                    <label>Description:</label>
                    <textarea required name="description" value={form.description} className="input h-[100px]" placeholder="Description of work performed" onChange={handleChange}></textarea>
                </div>
                <div className="w-full flex items-center justify-evenly p-2">
                   { days && days.length >= 4 ? (
                        <button className="buttons" onClick={(e) => {
                            e.preventDefault();
                            days.push(form)
                            handleSubmit()
                        }}>Submit</button>
                        ) : (
                        <button className="buttons w-[150px]" onClick={handleNextDay}>Next Day</button> )
                    }
                </div>
                </>
            }
            <div className="w-full p-2 mt-2 flex flex-col items-center">
                { days && days.length > 0 ? <p className="text-center">Preview and edit timesheet</p> : <></>}
                { days && days.length > 0 ? (
                    days.map((day, index) => {
                        return (
                            <form className="form mb-3" key={index}>
                                <p>Day {index + 1} of 5</p>
                                <label>Date:</label>
                                <input required name="date" value={days[index].date} className="input" type="date" onChange={(e) => handleEditChange(e, index)}/>
                                <label>Jobsite:</label>
                                <select name='jobsite' value={days[index].jobsite} onChange={handleChange} className='input' id='jobsites'>
                                    <option value="" selected disabled hidden>Choose Jobsite</option>
                                    { jobsites && jobsites.map(jobsite => {
                                        return (
                                            <option key={jobsite.address} name="name" value={jobsite.address}>{jobsite.address}</option>
                                        )
                                    })}
                                </select>
                                <label>Additional Jobsite (if any) </label>
                                <input required name="additional" value={days[index].additional} className="input" onChange={handleEditChange}/>
                                <label>Foreman:</label>
                                <input required name="foreman" value={days[index].foreman} className="input" placeholder="Ex. Alfredo" onChange={(e) => handleEditChange(e, index)}/>
                                <label>Start Time:</label>
                                <input required name="startTime" value={days[index].startTime} type="time" className="input" placeholder="7:00" onChange={(e) => handleEditChange(e, index)}/>
                                <label>Finish Time:</label>
                                <input required name="finishTime" value={days[index].finishTime} type="time" className="input" placeholder="3:30" onChange={(e) => handleEditChange(e, index)}/>
                                <label>Total Hrs:</label>
                                <input required name="totalHrs" value={days[index].totalHrs} className="input" placeholder="8" onChange={(e) => handleEditChange(e, index)}/> 
                                <label>Description:</label>
                                <textarea required name="description" value={days[index].description} className="input h-[100px]" placeholder="Description of work performed" onChange={(e) => handleEditChange(e, index)}></textarea>
                            </form>
                        )
                    })
                ) : (
                    <></>
                ) }
            </div>
    </div>
  )
}

export default CreateTimesheet