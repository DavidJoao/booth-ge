import AuthContext from '@/custom/AuthProvider'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'

const Home = () => {

    const { auth, setAuth } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
      if (!auth.token) router.push('/login')
      CheckSession(AuthContext, setAuth)
    }, [])

  return (
    <div>
        <h1>Welcome {auth && auth.name}</h1>
    </div>
  )
}

export default Home