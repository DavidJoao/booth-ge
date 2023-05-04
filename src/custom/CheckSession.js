import Cookies from 'js-cookie'
import axios from "./axios"
import { redirect } from 'next/dist/server/api-utils'

const CheckSession = ( AuthContext, setAuth  ) => {

    
    const tokenCookie = Cookies.get('token')
    const emailCookie = Cookies.get('email')

    const emailItem = localStorage.getItem('email')
    const tokenItem = localStorage.getItem('token')

    if (tokenCookie && emailCookie) {
        axios.get(`/api/user/${emailCookie}`)
            .then(res => {
                const { name, email, isAdmin, isForeman } = res?.data
        
                setAuth({
                    name: name,
                    email: email,
                    isAdmin: isAdmin,
                    isForeman: isForeman,
                    token: tokenCookie
                })
            })
    } else {
        axios.get(`/api/user/${emailItem}`)
        .then(res => {
            const { name, email, isAdmin, isForeman } = res?.data
    
            setAuth({
                name: name,
                email: email,
                isAdmin: isAdmin,
                isForeman: isForeman,
                token: tokenItem
            })
        })
    }
}

export default CheckSession