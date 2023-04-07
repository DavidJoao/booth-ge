import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import AuthContext from '@/custom/AuthProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'

const Navbar = () => {

  const { auth, setAuth, setTokenCookie, tokenCookie } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
	setTokenCookie(Cookies.get('token'))
	CheckSession(AuthContext, setAuth)
  }, [])

  const handleLogout = (e) => {
	Cookies.remove('token')
	Cookies.remove('email')
	router.push('/')
	setTokenCookie(null)
  }
  
  return (
    <>
    { tokenCookie ? 
      	<div className='border-[3px] border-black flex flex-row items-center justify-between w-full h-[70px] p-5 bg-gradient-to-tr from-[#3b2c19] to-[#6e4f27] shadow-lg mb-3'>
          	<Link className='buttons' href={'/home'}>Home</Link>
			{ auth && auth.isAdmin ? 
			<>
				<Link className='buttons' href={'/settings'}>Settings</Link>
				<Link className='buttons' href={'/post'}>Post</Link>
			</>
			:
			<></>}
          	<button className='buttons' onClick={handleLogout}>Log Out</button>
      	</div>
      	:
      	<></>
     	}
   		</>
  )
}

export default Navbar