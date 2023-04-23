import AuthContext from "@/custom/AuthProvider"
import { useContext, useEffect, useState } from "react"
import CheckSession from "@/custom/CheckSession"
import { useRouter } from "next/router"
import axios from "@/custom/axios"

const createtimesheet = () => {

    const { auth, setAuth, loadAll } = useContext(AuthContext)
    const router = useRouter()

    const initialForm = {
        jobsite: '',
        foreman: '',
        startTime: '',
        finishTime: '',
        totalHrs: '',
        description: ''
    }

    const [form, setForm] = useState(initialForm)
    const [days, setDays] = useState([])

    const initialTimesheet = {
        author: auth.name,
        days: days,
    }

    useEffect(() => {
        loadAll()
      if (!auth.token) router.push('/login')
      CheckSession(AuthContext, setAuth)
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleNextDay = (e) => {
        e.preventDefault();

        setDays([...days, form])
        setForm(initialForm)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // axios
    }

  return (
    <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center">
            <div className="daily-container">
                <label>Jobsite:</label>
                <input name="jobsite" value={form.jobsite} className="input" placeholder="Ex. Perugia 123" onChange={handleChange}/>
                <label>Foreman:</label>
                <input name="foreman" value={form.foreman} className="input" onChange={handleChange}/>
                <label>Start Time:</label>
                <input name="startTime" value={form.startTime} type="time" className="input" placeholder="7:00" onChange={handleChange}/>
                <label>Finish Time:</label>
                <input name="finishTime" value={form.finishTime} type="time" className="input" placeholder="3:30" onChange={handleChange}/>
                <label>Total Hrs:</label>
                <input name="totalHrs" value={form.totalHrs} className="input" placeholder="8" onChange={handleChange}/> 
                <label>Description:</label>
                <textarea name="description" value={form.description} className="input w-[90%] h-[100px]" onChange={handleChange}></textarea>
            </div>
            { days && days.length === 5 ? 
                <button className="buttons" onClick={handleSubmit}>Submit</button>
                :
                <button className="buttons" onClick={handleNextDay}>Next Day</button>
             }
    </div>
  )
}

export default createtimesheet