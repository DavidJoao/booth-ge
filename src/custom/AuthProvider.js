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
    const loadAll = () => {
        axios.get('/api/jobsite/all')
        .then(res => setJobsites(res.data))

        axios.get('/api/notification/all')
        .then(res => setNotifications(res.data))
        
        axios.get('/api/user/all')
        .then(res => setUsers(res.data))

        axios.get('/api/equipment/all')
        .then(res => setEquipment(res.data))
    }

    return(
        <AuthContext.Provider value={{ auth, setAuth, current, setCurrent, tokenCookie, setTokenCookie, loadAll, setJobsites, jobsites, users, notifications, equipment }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext