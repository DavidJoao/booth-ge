import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import AuthContext from '@/custom/AuthProvider'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'
import { Dropdown, Modal } from 'react-bootstrap'

const Navbar = () => {

	const menuIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
	<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
  	</svg>
  
	const { auth, setAuth, setTokenCookie, tokenCookie } = useContext(AuthContext)
	const router = useRouter()
	const [logoutModal, setLogoutModal] = useState(false)

  useEffect(() => {
	setTokenCookie(Cookies.get('token'))
	CheckSession(AuthContext, setAuth)
  }, [])

  const handleLogout = (e) => {
	Cookies.remove('token')
	Cookies.remove('email')
	localStorage.removeItem('email')
	localStorage.removeItem('token')
	setTokenCookie(null)
	setAuth({})
	router.push('/login')
  }
  
  return (
    <div className='p-2 border-[1px] border-black flex flex-row items-center justify-between bg-[#3a3b3c] text-white fixed w-full z-50'>
		<div className='w-[300px] lg:w-[800px] flex items-center'>
			<Link href='/home' className='w-full block lg:hidden text-white text-3xl no-underline'>Booth Grading</Link>
			<Link href='/home' className='w-1/2 hidden lg:block text-white text-3xl no-underline'>Booth Grading and Excavating</Link>
			{ auth.token ? <img src="https://i.ibb.co/XJKs479/boothimg.jpg"  className='m-2 rounded-xl w-[50px]'/> : <></>}
		</div>
    { auth.token ? 
		<Dropdown>
			<Dropdown.Toggle id='dropdown'><p className='pr-5 pl-5 h-[5px] text-white'>{menuIcon}</p></Dropdown.Toggle>
			<Dropdown.Menu id='menu'>
				<div className='flex flex-col items-center w-[350px] p-4 bg-[#3a3b3c]'>
					<Dropdown.Item onClick={() => router.push('/home')}><button className='nav-buttons' >Home</button></Dropdown.Item>
					<Dropdown.Item onClick={() => router.push('/absence')}><button className='nav-buttons'>Absence Request</button></Dropdown.Item>
					<Dropdown.Item onClick={() => router.push('/createtimesheet')}><button className='nav-buttons'>Create Timesheet</button></Dropdown.Item>
					
					{ auth && auth.isModerator ? 
					<>
						<Dropdown.Item onClick={() => router.push('/timesheets')}><button className='nav-buttons'>Timesheets</button></Dropdown.Item>
						<Dropdown.Item onClick={() => router.push('/employeesettings')}><button className='nav-buttons'>Employees Settings</button></Dropdown.Item>

						{/* ONLY ALLOW SETTINGS TO ADMINS */}
						{ auth.isAdmin ? 
							<Dropdown.Item onClick={() => router.push('/settings')}><button className='nav-buttons'>Settings</button></Dropdown.Item>
							:
							<></>
						}
						<Dropdown.Item onClick={() => router.push('/post')}><button className='nav-buttons'>Post</button></Dropdown.Item>
						
					</>
					:
					<></>}
					<Dropdown.Item onClick={() => router.push('/reports')}><button className='nav-buttons'>Daily Reports</button></Dropdown.Item>
					<Dropdown.Item onClick={() => router.push('/createdaily')}><button className='nav-buttons'>Create Daily Report</button></Dropdown.Item>
					{/* WAITING FOR TESTERS */}
					{/* <Dropdown.Item onClick={() => router.push('/equipmentstatus')}><button className='nav-buttons'>Report Equipment</button></Dropdown.Item> */}
					<Dropdown.Item onClick={() => router.push('/upload')}><button className='nav-buttons'>Upload Docs/Images</button></Dropdown.Item>
					<Dropdown.Item className='hover:bg-none' onClick={() => setLogoutModal(true)}><button className='nav-buttons'>Log Out</button></Dropdown.Item>
					<Modal show={logoutModal} onHide={() => setLogoutModal(false)}>
						<Modal.Header id="dropdown" closeButton> Are you sure you want to log out? </Modal.Header>
						<Modal.Body className="flex flex-row items-center justify-evenly p-3" id="modal">
						<button className="buttons" onClick={() => setLogoutModal(false)}>
							Cancel
						</button>
						<button
							className="red-buttons"
							onClick={e => {
								e.preventDefault()
								handleLogout()
								setLogoutModal(false)
							}}>{" "} Log Out
						</button>
						</Modal.Body>
					</Modal>
					
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