import AuthContext from '@/custom/AuthProvider'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Home = () => {

    const { auth } = useContext(AuthContext)
    const router = useRouter()

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