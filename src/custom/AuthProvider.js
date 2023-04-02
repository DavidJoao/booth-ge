import { createContext, useState } from "react";

export const AuthContext = createContext({})

export const AuthProvider = ( { children } ) => {
    const [auth, setAuth] = useState({})
    const [current, setCurrent] = useState('Log In')
    const [tokenCookie, setTokenCookie] = useState(null)

    return(
        <AuthContext.Provider value={{ auth, setAuth, current, setCurrent, tokenCookie, setTokenCookie }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext