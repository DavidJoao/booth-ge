import React, { useState, useContext, useEffect } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import EditUserCard from '@/components/EditUserCard'
import CCSection from '@/components/CCSection'

const Employeesettings = () => {

    const { users, auth, loadAll, setAuth } = useContext(AuthContext)
    const router = useRouter()
    const [search, setSearch] = useState('')

    useEffect(() => {
		if (auth.isAdmin == false && auth.isModerator === false) router.push('/login')
        if ( auth.token === undefined) {
            router.push('/login')
        } else {
            loadAll()
            CheckSession(AuthContext, setAuth)
        }
    }, [])

	useEffect(() => {
		loadAll()
	}, [])

  return (
    <div className='h-auto min-h-screen flex flex-col items-center justify-center bg-[#242526] p-3 pt-[80px]'>
        <input className='input mt-[80px] w-[300px] mb-3' placeholder='Filter By Name' onChange={(e) => setSearch(e.target.value)}/>
        <div className='w-full h-[600px] p-2 overflow-auto rounded bg-[#3A3B3C] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        { users && users.filter(user => search === '' || user.name.toLowerCase().includes(search.toLowerCase())).sort(function (a, b) {
						if (a.name < b.name) {
							return -1;
						}
						if (a.name > b.name) {
							return 1;
						}
						return 0
					}).map(user => 
						<div key={user._id}>
							    <EditUserCard user={user} auth={auth} loadAll={loadAll} />
						</div>
					)}
        </div>
        <CCSection />
    </div>
  )
}

export default Employeesettings