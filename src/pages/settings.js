import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'

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
    <div className='border-[1px] border-black h-[700px] flex flex-col'>
        <div className='h-1/2 flex flex-row items-center p-4 overflow-auto'>
          { users && users.map(user => {
            return(
              <p className='form m-2 w-[200px]'>{user.name}</p>
            )
          })}
        </div>
        <div className='h-1/2 flex flex-row items-center p-4 overflow-auto'>
          <p>one</p>
          <p>one</p>
          <p>one</p>
        </div>
    </div>
  )
}

export default settings