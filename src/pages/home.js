import AuthContext from '@/custom/AuthProvider'
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/router'
import settings from './settings'

const Home = () => {

    const { auth } = useContext(AuthContext)
    const router = useRouter()

    const handleNavigate = (path) => {
        router.push(path)
    }

  return (
    <div>
        <Navbar />
        home
    </div>
  )
}

export default Home