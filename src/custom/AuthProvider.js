import { createContext, useState } from "react";
import axios from "./axios";

export const AuthContext = createContext({})

export const AuthProvider = ( { children } ) => {
    const [auth, setAuth] = useState({})
    const [current, setCurrent] = useState('Log In')
    const [tokenCookie, setTokenCookie] = useState(null)
    const [jobsites, setJobsites] = useState([])
    const loadAll = () => {
        axios.get('/api/jobsite/all')
        .then(res => setJobsites(res.data))
    }

    return(
        <AuthContext.Provider value={{ auth, setAuth, current, setCurrent, tokenCookie, setTokenCookie, loadAll, setJobsites, jobsites }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext