import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'
import UserCard from '@/components/UserCard'
import { Modal } from 'react-bootstrap'
import JobsiteMiniCard from '@/components/JobsiteMiniCard'

const settings = () => {

	const { auth, setAuth } = useContext(AuthContext)
	const [users, setUsers] = useState([])
	const [showJobsList, setShowJobsList] = useState(false)
	const [jobsites, setJobsites] = useState([])
	const [selectedUser, setSelectedUser] = useState({})
	const [errorMessage, setErrorMessage] = useState('')
	const router = useRouter()

	useEffect(() => {
		CheckSession(AuthContext, setAuth)
		if (!auth.token) router.push('/login')
	}, [])

	useEffect(() => {
		axios.get('/api/user/all')
			.then(res => setUsers(res.data))
	}, [])

	useEffect(() => {
		axios.get('/api/jobsite/all')
			.then(res => setJobsites(res.data))
	}, [])


	return (
		<div className='h-[700px] flex flex-col items-center p-5 basic-container'>
				<h1 className='font-bold text-2xl border-b-[3px] border-white w-[300px] text-center'>Add people to jobsites</h1>
				<div className='w-full h-full grid grid-rows-6 grid-flow-col gap-3 justify-items-center md:justify-items-start shadow-xl'>
				{ users && users.map(user => 
						<div key={user._id} onClick={() => {
							setShowJobsList(true)
							setSelectedUser(user)
							}}>
							<UserCard user={user} setShowJobsList={setShowJobsList} showJobsList={showJobsList}/>
						</div>
						)}
				</div>
				<Modal show={showJobsList} onHide={() => {
					setShowJobsList(false)
					setErrorMessage('')
					}}>
					<Modal.Header>Choose Jobsite for {selectedUser.name}</Modal.Header>
					<Modal.Body>
						{ jobsites.map(jobsite => 
							<div key={jobsite._id}>
								<JobsiteMiniCard selectedUser={selectedUser} jobsite={jobsite} setErrorMessage={setErrorMessage}/>
							</div>
							) }
							<p className='font-bold text-red-600'>{errorMessage}</p>
					</Modal.Body>

					{/* DOES NOT SHOW THIS PART OF MODAL FOR LOGGED IN USERS */}
					{ selectedUser.name === auth.name ? 
						<></>
						:
						<>
						<Modal.Header>Or</Modal.Header>
						<Modal.Body>
							{ selectedUser.isAdmin ? 
							<button className='w-full mx-auto bg-red-600 text-white rounded p-1 font-bold'>Remove Admin</button>
							:
							<button className='w-full mx-auto bg-blue-600 text-white rounded p-1 font-bold'>Make Admin</button> 
							}
						</Modal.Body>
						</>
					}
				</Modal>
		</div>
	)
}

export default settings