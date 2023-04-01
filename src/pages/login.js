import Link from 'next/link'
import React, { useState } from 'react'

const login = () => {

    const initialUser = {
        email: '',
        password: ''
    }

    const [user, setUser] = useState(initialUser)

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleLogin = (e) => {
        e.preventDefault()
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
            <Link href={'/register'} className="buttons mx-auto mt-3 w-[300px] lg:w-[400px]">Don't have an account? Register here</Link>
    </div>
  )
}

export default login