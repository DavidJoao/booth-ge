import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'
import Cookies from 'js-cookie'
import { AuthContext } from '@/custom/AuthProvider'

const login = () => {

    const initialUser = {
        email: '',
        password: ''
    }

    const { setAuth, setTokenCookie } = useContext(AuthContext)
    const router = useRouter()
    const tokenCookie = Cookies.get('token')
    const [user, setUser] = useState(initialUser)
    const [errorMessage, setErrorMessage] = useState('')

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
        if (tokenCookie) router.push('/home')
    }, [])

    //LOGS USER IN
    const handleLogin = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        await axios.post('/api/login', JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            const { email, token, isAdmin, name } = res?.data
            if (token) {
                setAuth({ email, token, name, isAdmin })
                setTokenCookie(token)
                Cookies.set('email', email)
                router.push('/home')
            }
        })
        .catch(err => {
            if (err.response.status == 400) {
                setErrorMessage('Wrong password or email')
            }
        })
        setUser(initialUser)
    }

  return (
    <div className='h-screen w-full flex flex-col items-center justify-center'>
        <p className='text-5xl font-extrabold mb-2'>Log In</p>
        <form className='form' onSubmit={handleLogin}>
            <label>Email:</label>
            <input name='email' value={user.email} className="input" onChange={handleChange}/>
            <label>Password:</label>
            <input name='password' value={user.password} type={'password'} className="input" onChange={handleChange}/>
            <button className='buttons mx-auto mt-3'>Login</button>
        </form>
            <p className='text-red-600'>{errorMessage}</p>
            <Link href={'/register'} className="buttons mx-auto mt-3 w-[300px] lg:w-[400px]">Don't have an account? Register here</Link>
    </div>
  )
}

export default login