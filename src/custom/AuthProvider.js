import { createContext, useState } from "react";
import axios from "./axios";

export const AuthContext = createContext({})

export const AuthProvider = ( { children } ) => {
    const [auth, setAuth] = useState({})
    const [current, setCurrent] = useState('Log In')
    const [tokenCookie, setTokenCookie] = useState(null)
    const [jobsites, setJobsites] = useState([])
    const [users, setUsers] = useState([])
    const loadAll = () => {
        axios.get('/api/jobsite/all')
        .then(res => setJobsites(res.data))
    }
    const loadUsers = () => {
        axios.get('/api/user/all')
        .then(res => setUsers(res.data))
    }

    return(
        <AuthContext.Provider value={{ auth, setAuth, current, setCurrent, tokenCookie, setTokenCookie, loadAll, setJobsites, jobsites, loadUsers, users }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext