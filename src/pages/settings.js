import Navbar from '@/components/Navbar'
import { useContext, useEffect } from 'react'
import AuthContext from '@/custom/AuthProvider'
import Link from 'next/link'
import CheckSession from '@/custom/CheckSession'

const settings = () => {

  const { auth, setAuth } = useContext(AuthContext)

  useEffect(() => {
    CheckSession(AuthContext, setAuth)
  })


  return (
    <div>
        {auth.token ? 
        <>
        <h1>Settings</h1>
        </>
        :
        <Link href={'/login'}>Please, log in</Link>}
    </div>
  )
}

export default settings