import Link from 'next/link'
import React, { useState } from 'react'
import axios from '@/custom/axios'
import { useRouter } from 'next/router'

const Register = () => {

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
            setErrorMessage(error.response.data.error)
        })

    }

  return (
    <div className='h-screen w-full flex flex-col items-center justify-start bg-[#242526]'>
        <p className='text-3xl font-extrabold mb-2'>Sign Up</p>
        <img src="https://i.ibb.co/XJKs479/boothimg.jpg"  className='m-2 rounded-xl w-[200px]'/>
        <form className='form' onSubmit={handleRegister}>
            <label>Email:</label>
            <input placeholder='example@gmail.com' name='email' value={user.email} className="input" onChange={handleChange}/>
            <label>Name:</label>
            <input placeholder='Jose Sandoval' name='name' value={user.name} className="input" onChange={handleChange}/>
            <label>Password:</label>
            <input placeholder='*******' name='password' value={user.password} type={'password'} className="input" onChange={handleChange}/>
            <button className='buttons mx-auto mt-3'>Register</button>
        </form>
            <p className='text-red-600 font-bold'>{errorMessage}</p>
            <Link href={'/login'} className="buttons mx-auto mt-3 w-[300px] lg:w-[400px] no-underline">Already have an account? Click Here </Link>
    </div>
  )
}

export default Register