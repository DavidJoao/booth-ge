import Cookies from 'js-cookie'
import axios from "./axios"
import { redirect } from 'next/dist/server/api-utils'

const CheckSession = async ( AuthContext, setAuth  ) => {

    
    const tokenCookie = Cookies.get('token')
    const emailCookie = Cookies.get('email')

    const emailItem = localStorage.getItem('email')
    const tokenItem = localStorage.getItem('token')

    try {
        if (tokenCookie && emailCookie) {
            await axios.get(`/api/user/${emailCookie}`)
                .then(res => {
                    const { name, email, isAdmin, isForeman, isModerator } = res?.data
            
                    setAuth({
                        name: name,
                        email: email,
                        isAdmin: isAdmin,
                        isModerator: isModerator,
                        isForeman: isForeman,
                        token: tokenCookie
                    })
                })
            } else {
                await axios.get(`/api/user/${emailItem}`)
                .then(res => {
                    const { name, email, isAdmin, isForeman, isModerator } = res?.data
            
                    setAuth({
                        name: name,
                        email: email,
                        isAdmin: isAdmin,
                        isModerator: isModerator,
                        isForeman: isForeman,
                        token: tokenItem
                    })
                })
            }
    } catch (error) {
        console.error("Error fetching user data", error);
    }

}

export default CheckSession