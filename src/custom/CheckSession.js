import Cookies from 'js-cookie'
import axios from "./axios"

const CheckSession = ( setAuth  ) => {

    
    const tokenCookie = Cookies.get('token')
    const emailCookie = Cookies.get('email')

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
    }
    

}

export default CheckSession