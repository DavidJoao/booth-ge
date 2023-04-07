import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'
import UserCard from '@/components/UserCard'

const settings = () => {

  const { auth, setAuth } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const router = useRouter()

  useEffect(() => {
    CheckSession(AuthContext, setAuth)
    if (!auth.token) router.push('/login')
  }, [])

  useEffect(() => {
    axios.get('/api/user/all')
      .then(res => setUsers(res.data))
  }, [])


  return (
    <div className='h-[700px] flex flex-col items-center p-5 basic-container'>
        <h1 className='font-bold text-2xl border-b-[3px] border-white w-[300px] text-center'>Add people to jobsites</h1>
        <div className='w-full h-full grid grid-rows-6 grid-flow-col gap-3 justify-items-center md:justify-items-start shadow-xl'>
        { users && users.map(user => {
            return(
                <UserCard user={user}/>
            )
            })}
        </div>
    </div>
  )
}

export default settings