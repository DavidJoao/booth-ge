import React, { useContext } from 'react'
import Link from 'next/link'
import AuthContext from '@/custom/AuthProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const Navbar = () => {

  const { auth } = useContext(AuthContext)
  const router = useRouter()
  const tokenCookie = Cookies.get('token')

  const handleLogout = (e) => {
	Cookies.remove('token')
	Cookies.remove('email')
	router.push('/')
  }
  
  return (
    <>
    { tokenCookie ? 
      	<div className='border-[3px] border-black flex flex-row items-center justify-between w-full h-[70px] p-5 bg-gradient-to-tr from-[#3b2c19] to-[#6e4f27] shadow-lg mb-3'>
          	<Link className='buttons' href={'/home'}>Home</Link>
          	<Link className='buttons' href={'/settings'}>Settings</Link>
          	<button className='buttons' onClick={handleLogout}>Log Out</button>
      	</div>
      	:
      	<></>
     	}
   		</>
  )
}

export default Navbar