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
      	<div className='flex bg-slate-200'>
          	<Link className='nav-buttons' href={'/home'}>Home</Link>
			{ auth && auth.isAdmin ? 
			<>
				<Link className='nav-buttons' href={'/settings'}>Settings</Link>
				<Link className='nav-buttons' href={'/post'}>Post</Link>
			</>
			:
			<></>}
          	<button className='nav-buttons' onClick={handleLogout}>Log Out</button>
      	</div>
      	:
      	<></>
     	}
   		</>
  )
}

export default Navbar