import Link from 'next/link'
import React, { useState } from 'react'
import axios from '@/custom/axios'
import { useRouter } from 'next/router'

const register = () => {

    const initialUser = {
        email: '',
        password: '',
        name: '',
        isAdmin: false,
        isForeman: false,
    }

    const [user, setUser] = useState(initialUser)
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setErrorMessage('')

        await axios.post('/api/register', JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            router.push('/login')
            setUser(initialUser)
        })
        .catch(error => {
            if (error.response.status) setErrorMessage('Email already exists')
        })

    }

  return (
    <div className='h-screen w-full flex flex-col items-center justify-center bg-[#242526]'>
        <p className='text-5xl font-extrabold mb-2'>Sign Up Form</p>
        <form className='form' onSubmit={handleRegister}>
            <label>Email:</label>
            <input name='email' value={user.email} className="input" onChange={handleChange}/>
            <label>Name:</label>
            <input name='name' value={user.name} className="input" onChange={handleChange}/>
            <label>Password:</label>
            <input name='password' value={user.password} type={'password'} className="input" onChange={handleChange}/>
            <button className='buttons mx-auto mt-3'>Register</button>
        </form>
            <p className='text-red-600 font-bold'>{errorMessage}</p>
            <Link href={'/login'} className="buttons mx-auto mt-3 w-[300px] lg:w-[400px]">Already have an account? Click Here </Link>
    </div>
  )
}

export default register