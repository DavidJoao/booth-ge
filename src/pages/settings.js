import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'
import UserCard from '@/components/UserCard'
import { Modal } from 'react-bootstrap'
import JobsiteMiniCard from '@/components/JobsiteMiniCard'

const settings = () => {

	const { auth, setAuth, users, loadAll, equipment, accessories } = useContext(AuthContext)
	const router = useRouter()
	const [userConfiguration, setUserConfiguration] = useState(false)
	const [equipmentConfiguration, setEquipmentConfiguration] = useState(false)
	const [jobsites, setJobsites] = useState([])
	const [selectedUser, setSelectedUser] = useState({})
	const [selectedEquipment, setSelectedEquipment] = useState({})
	const [errorMessage, setErrorMessage] = useState('')
	const [showDelete, setShowDelete] = useState(false)


	useEffect(() => {
		CheckSession(AuthContext, setAuth)
		if (!auth.token) router.push('/login')
	}, [])

	useEffect(() => {
		loadAll()
	}, [])

	useEffect(() => {
		axios.get('/api/jobsite/all')
			.then(res => setJobsites(res.data))
	}, [])

	const removeAdmin = () => {
		axios.patch(`/api/user/admin/remove/${selectedUser._id}`)
			.then(res => {
				setUserConfiguration(false)
				loadAll()
			})
	}
	
	const addAdmin = () => {
		axios.patch(`/api/user/admin/add/${selectedUser._id}`)
			.then(res => {
				setUserConfiguration(false)
				loadAll()
			})
	}


	return (
		<div className='h-screen flex flex-col md:flex-row items-center bg-[#242526]'>
			<div className='w-[350px] md:w-1/2 h-[400px] flex flex-col items-center m-2'>
				<h3>Manage Employees</h3>
				<div className='w-full h-full overflow-auto rounded bg-[#3A3B3C]'>
					{ users && users.map(user => 
							<div key={user._id} onClick={() => {
								setUserConfiguration(true)
								setSelectedUser(user)
								}}>
								<UserCard user={user}/>
							</div>
							)}
				</div>
			</div>
			<div className='w-[350px] md:w-1/2 h-[400px] flex flex-col items-center m-2'>
				<h3>Manage Equipment</h3>
				<div className='w-full h-full overflow-auto rounded bg-[#3A3B3C]'>

					{/* LIST OF EQUIPMENT IN SETTINGS "MANAGE EQUIPMENT" CONTAINER */}
					
					{ equipment && equipment.map(equipment => 
						<div key={equipment._id} onClick={() => {
							setEquipmentConfiguration(true)
							setSelectedEquipment(equipment)
						}}>
							<UserCard user={equipment} />
						</div>) }
				</div>
			</div>
			


				<Modal show={userConfiguration} onHide={() => {
					setUserConfiguration(false)
					setErrorMessage('')
					}}>
					<Modal.Header className='bg-[#242526]'>Choose Jobsite for {selectedUser.name}</Modal.Header>
					<Modal.Body className='bg-[#242526]'>
						{ jobsites.map(jobsite => 
							<div key={jobsite._id}>
								<JobsiteMiniCard jobsite={jobsite} setErrorMessage={setErrorMessage} route={`user/add/${selectedUser._id}/${jobsite._id}`}/>
							</div>
							) }
							<p className='font-bold text-red-600'>{errorMessage}</p>
					</Modal.Body>

					{/* DOES NOT SHOW THIS PART OF MODAL FOR LOGGED IN USERS */}
					{ selectedUser.name === auth.name ? <></> :
						<>
						<Modal.Header className='bg-[#242526]'>Or</Modal.Header>
						<Modal.Body className='bg-[#242526]'>
							{ selectedUser.isAdmin ? 
							<button className='w-full mx-auto bg-red-600 text-white rounded p-1 font-bold' onClick={removeAdmin}>Remove Admin</button>
							:
							<button className='w-full mx-auto bg-blue-600 text-white rounded p-1 font-bold' onClick={addAdmin}>Make Admin</button> 
							}
						</Modal.Body>
						</>
					}
				</Modal>

				<Modal className='overflow-auto' show={equipmentConfiguration} onHide={() => {
					setEquipmentConfiguration(false)
					setErrorMessage('')
					setShowDelete(false)
				}}>
					<Modal.Header className='bg-[#242526]'>Choose Jobsite for {selectedEquipment.number} {selectedEquipment.name}</Modal.Header>
					<Modal.Body className='bg-[#242526] flex flex-col items-start h-[680px] overflow-auto'>

						{/* LIST OF JOBSITES IN EQUIPMENT CONFIGURATION MODAL */}

						{ jobsites.map(jobsite => 
							<div key={jobsite._id} onClick={() => setShowDelete(true)}>
								<JobsiteMiniCard jobsite={jobsite} setErrorMessage={setErrorMessage} route={`equipment/add/${selectedEquipment._id}/${jobsite._id}`}/>
							</div>
							) 
							}
						{ showDelete == false ? 
						<div className='w-full p-2 flex flex-col'>
							<button className='bg-red-600 p-2 rounded' onClick={(e) => {
								e.preventDefault()
								axios.delete(`/api/equipment/delete/${selectedEquipment._id}`)
								setEquipmentConfiguration(false)
								loadAll()
								router.push('/home')
							}}>Delete Equipment</button>
							<div className='m-2 flex flex-col items-center'>

								{/* LIST OF ACCESSORIES IN EQUIPMENT CONFIGURATION MODAL */}

								{ accessories && accessories.map(accessory => {
									return(
										<button className='buttons p-2 m-2 w-[300px]' onClick={(e) => {
											e.preventDefault()
											axios.patch(`/api/accessory/add/${accessory._id}/${selectedEquipment._id}`)
											.then(res => {
												loadAll()
												router.push('/home')
												setEquipmentConfiguration(false)
											})
											.catch(error => setErrorMessage(error.response.data.message))
										}}>{accessory.name}</button>
									)
								}) }
							</div>
						</div>
						:
						<></>}
						<p className='font-bold text-red-600'>{errorMessage}</p>
					</Modal.Body>
				</Modal>
		</div>
	)
}

export default settings