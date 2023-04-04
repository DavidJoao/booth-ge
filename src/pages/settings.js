import { useContext, useEffect } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'

const settings = () => {

  const { auth, setAuth } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    CheckSession(AuthContext, setAuth)
    if (!auth.token) router.push('/login')
  }, [])


  return (
    <div>
        <h1>Settings</h1>
    </div>
  )
}

export default settings