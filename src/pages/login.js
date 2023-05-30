import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import { AuthContext } from '@/custom/AuthProvider'
import { PuffLoader } from 'react-spinners'

const Login = () => {

    const initialUser = {
        email: '',
        password: ''
    }

    const { setAuth, setTokenCookie } = useContext(AuthContext)
    const router = useRouter()
    const tokenCookie = Cookies.get('token')
    const [user, setUser] = useState(initialUser)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // CHANGE HANDLER FOR INPUT BOXES
    const handleChange = (e) => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    //CHECKS FOR TOKEN, IF TOKEN EXITS REDIRECTS TO HOME
    useEffect(() => {
        if (tokenCookie ) router.push('/home')
        if (localStorage.getItem('token')) router.push('/home')
    }, [])

    //LOGS USER IN
    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage('')
        await axios.post('/api/login', JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            const { email, token, isAdmin, isModerator, isForeman, name } = res?.data
            if (token) {
                setAuth({ email, token, name, isAdmin, isModerator, isForeman })
                setTokenCookie(token)
                Cookies.set('email', email)
                localStorage.setItem('email', email)
                localStorage.setItem('token', token)
                router.push('/home')
                setIsLoading(false)
            }
        })
        .catch(err => {
            if (err.response.status == 400) {
                setErrorMessage('Wrong password or email')
                setIsLoading(false)
            }
        })
        setUser(initialUser)
    }

  return (
    <div className='h-screen w-full flex flex-col items-center justify-start bg-[#242526] pt-[80px]'>
        { isLoading ? 
            <>
                <PuffLoader color='#ffffff' loading={isLoading} size={120}/>
                <p className="mt-4">Logging In, Please Wait...</p>
            </>
        :
        <>
            <form className='form' onSubmit={handleLogin}>
                <img src="https://i.ibb.co/XJKs479/boothimg.jpg"  className='m-2 rounded-xl w-[200px]'/>
                <label>Email:</label>
                <input name='email' value={user.email.toLowerCase()} className="input lg:w-[50%]" autoComplete='email' onChange={handleChange}/>
                <label>Password:</label>
                <input name='password' value={user.password} type={'password'} className="input lg:w-[50%]" autoComplete='current-password' onChange={handleChange}/>
                <button className='buttons mx-auto mt-3 w-[80%] lg:w-[50%]'>Login</button>
            </form>
                <p className='text-red-600'>{errorMessage}</p>
                <Link href={'/register'} className="buttons mx-auto mt-3 w-[300px] lg:w-[400px] no-underline">Do not have an account? Register here</Link>
        </> }
    </div>
  )
}

export default Login