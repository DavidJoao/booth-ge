import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import AuthContext from '@/custom/AuthProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'
import { Dropdown, NavDropdown } from 'react-bootstrap'

const Navbar = () => {

	const menuIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
	<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
  	</svg>
  
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
    <div className='p-2 border-[1px] border-black flex flex-row items-center justify-between bg-[#3a3b3c] text-white'>
	<Link href='/' className='w-1/2 block lg:hidden text-white text-3xl no-underline'>Booth Grading</Link>
	<Link href='/' className='w-1/2 hidden lg:block text-white text-3xl no-underline'>Booth Grading and Excavating</Link>
    { tokenCookie ? 
		<Dropdown>
			<Dropdown.Toggle id='dropdown'><p className='pr-5 pl-5 h-[5px] text-white'>{menuIcon}</p></Dropdown.Toggle>
			<Dropdown.Menu id='menu'>
				<div className='flex flex-col w-[350px] p-4 bg-[#3a3b3c]'>
					<Link className='nav-buttons' href={'/home'}>Home</Link>
					<Link className='nav-buttons' href={'/createtimesheet'}>Create Timesheet</Link>
					{ auth && auth.isAdmin ? 
					<>
						<Link className='nav-buttons' href={'/timesheets'}>Timesheets</Link>
						<Link className='nav-buttons' href={'/settings'}>Settings</Link>
						<Link className='nav-buttons' href={'/post'}>Post</Link>
						<Link className='nav-buttons' href={'/reports'}>Daily Reports</Link>
					</>
					:
					<></>}
					{ auth && auth.isAdmin || auth.isForeman ?
					<>
						<Link className='nav-buttons' href={'/createdaily'}>Create Daily Report</Link>
					</>
					:
					<></>}
					<button className='nav-buttons' onClick={handleLogout}>Log Out</button>
				</div>
			</Dropdown.Menu>
		</Dropdown>
      	:
      	<></>
     	}
   	</div>
  )
}

export default Navbar