import { createContext, useState } from "react";
import axios from "./axios";

export const AuthContext = createContext({})

export const AuthProvider = ( { children } ) => {
    const [auth, setAuth] = useState({})
    const [current, setCurrent] = useState('Log In')
    const [tokenCookie, setTokenCookie] = useState(null)
    const [jobsites, setJobsites] = useState([])
    const [users, setUsers] = useState([])
    const [notifications, setNotifications] = useState([])
    const [equipment, setEquipment] = useState([])
    const [accessories, setAccessories] = useState([])
    const [timesheets, setTimesheets] = useState([])
    const [dailies, setDailies] = useState([])
    const [timesheetCount, setTimesheetCount] = useState(5)
    const [dailyCount, setDailyCount] = useState(5)

    const loadAll = () => {
        axios.get('/api/jobsite/all')
        .then(res => setJobsites(res.data))

        axios.get('/api/notification/all')
        .then(res => setNotifications(res.data))
        
        axios.get('/api/user/all')
        .then(res => setUsers(res.data))
        
        axios.get('/api/accessory/all')
        .then(res => setAccessories(res.data))
        
        axios.get('/api/equipment/all')
        .then(res => setEquipment(res.data))

        axios.get(`/api/timesheet/all/${timesheetCount}`)
        .then(res => setTimesheets(res.data))

        axios.get(`/api/daily/all/${dailyCount}`)
        .then(res => setDailies(res.data))
    }
    
    return(
        <AuthContext.Provider value={{ 
            auth, setAuth, 
            current, setCurrent, 
            tokenCookie, setTokenCookie, 
            timesheetCount, setTimesheetCount,
            dailyCount, setDailyCount,
            setJobsites, 
            loadAll, 
            jobsites, users, notifications, equipment, accessories, timesheets, setTimesheets, dailies, setDailies }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext