import AuthContext from '@/custom/AuthProvider'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Cookies from 'js-cookie'
import CheckSession from '@/custom/CheckSession'

const Home = () => {

    const { auth, setAuth } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
      CheckSession(AuthContext, setAuth)
    }, [])

  return (
    <div>
        {auth.token ? 
        <>
        <h1>Welcome {auth.name}</h1>
        </>
        :
        <Link href={'/login'}>Please, log in</Link>}
    </div>
  )
}

export default Home