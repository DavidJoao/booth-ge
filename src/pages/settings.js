import { useContext, useEffect, useState } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'
import UserCard from '@/components/UserCard'
import { Modal } from 'react-bootstrap'
import JobsiteMiniCard from '@/components/JobsiteMiniCard'
import ErrorModal from '@/components/ErrorModal'
import EquipmentMiniCard from '@/components/EquipmentMiniCard'
import CCSection from '@/components/CCSection'

const Settings = () => {

	const checkIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[100px] h-[100px] mx-auto">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
	
	const editLogo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
	<path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
	</svg>

	const { auth, setAuth, users, loadAll, equipment, accessories } = useContext(AuthContext)
	const router = useRouter()

	
	// MODAL STATES
	const [userConfiguration, setUserConfiguration] = useState(false)
	const [equipmentConfiguration, setEquipmentConfiguration] = useState(false)
	const [accessoryConfiguration, setAccessoryConfiguration] = useState(false)
	const [showDelete, setShowDelete] = useState(false)
	const [userDeletion, showUserDeletion] = useState(false)
	const [accessoryDeletion, showAccessoryDeletion] = useState(false)
	const [errorModal, setErrorModal] = useState(false)
	const [successModal, setSuccessModal] = useState(false)
	const [editEquipmentModal, setEditEquipmentModal] = useState(false)
	const [editAccessoryModal, setEditAccessoryModal] = useState(false)
	
	// GENERAL STATES
	const [jobsites, setJobsites] = useState([])
	const [selectedUser, setSelectedUser] = useState({})
	const [selectedEquipment, setSelectedEquipment] = useState({})
	const [selectedAccessory, setSelectedAccessory] = useState({})
	const [errorMessage, setErrorMessage] = useState('')


	//  INITIAL EDIT OBJECTS

	const initialEquipmentEdit = {
		number: selectedEquipment?.number || '',
		name: selectedEquipment?.name || ''
	}

	const initialAccessoryEdit = {
		name: selectedAccessory.name || ''
	}	


	const [editEquipment, setEditEquipment] = useState(initialEquipmentEdit)
	const [editAccessory, setEditAccessory] = useState(initialAccessoryEdit)

	// CHECK AUTHENTICATION USE EFFECT

	useEffect(() => {
		if (auth.isAdmin == false && auth.isModerator === false) router.push('/login')
        if ( auth.token === undefined) {
            router.push('/login')
        } else {
            loadAll()
            CheckSession(AuthContext, setAuth)
        }
    }, [])

	// TRACK CURRENT SELECTION OF EQUIPMENT/ACCESSORY
	
	useEffect(() => {
		setEditEquipment({
		  number: selectedEquipment?.number || '',
		  name: selectedEquipment?.name || ''
		});

		setEditAccessory({
			name: selectedAccessory?.name || ''
		});

	  }, [selectedEquipment, selectedAccessory]);

	// LOAD ALL ON LOAD USE EFFECT

	useEffect(() => {
		loadAll()
	}, [])

	useEffect(() => {
		axios.get('/api/jobsite/all')
			.then(res => setJobsites(res.data))
	}, [])

	//  UPDATE ROLES FUNCTION (ADMINISTRATORS, MODERATORS, FOREMANS)

	const handleRoles = (role, action) => {
		axios.patch(`/api/user/${role}/${action}/${selectedUser._id}`)
			.then(res => {
				setUserConfiguration(false);
				loadAll();
			})
			.catch(err => {
				setErrorModal(true)
				setErrorMessage(err.response.data.message)
			})
	}

	// DELETE USERS FUNCTION

	const handleDelete = (e) => {
		e.preventDefault();

		axios.delete(`/api/user/delete/${selectedUser._id}`)
			.then(res => {
				showUserDeletion(false)
				setUserConfiguration(false)
				loadAll()
			})
	}

	// CHANGE HANDLER FOR EDITS

	const handleEditChange = (e, setEditX, editX) => {
		const { value, name } = e.target;
		
		setEditX({
			...editX,
			[name]: value
		})
	}

	return (
		// CONTAINER FOR EMPLOYEES
		<div className='h-auto min-h-screen flex flex-col md:flex-row items-center bg-[#242526] pt-[80px]'>
			<div className='w-[350px] md:w-1/2 h-[500px] lg:h-[700px] flex flex-col items-center m-2'>
				<h3>Manage Employees</h3>
				<div className='w-full h-full overflow-auto rounded bg-[#3A3B3C]'>
					{ users && users.sort(function (a, b) {
						if (a.name < b.name) {
							return -1;
						}
						if (a.name > b.name) {
							return 1;
						}
						return 0
					}).map(user => 
						<div key={user._id} onClick={() => {
							setUserConfiguration(true)
							setSelectedUser(user)
						}}>
							<UserCard user={user}/>
						</div>
					)}
				</div>
			</div>


			{/* CONTAINER FOR EQUIPMENT */}
			<div className='w-[350px] md:w-1/2 h-[500px] lg:h-[700px] flex flex-col items-center m-2'>
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

					{ equipment && equipment.length === 0 ? <p className='text-center'>No equipment yet</p> : <></> }
				</div>
			</div>


			{/* CONTAINER FOR ACCESSORIES */}
			<div className='w-[350px] md:w-1/2 h-[500px] lg:h-[700px] flex flex-col items-center m-2'>
				<h3>Manage Accessories</h3>
				<div className='w-full h-full overflow-auto rounded bg-[#3A3B3C]'>

					{/* LIST OF EQUIPMENT IN SETTINGS "MANAGE EQUIPMENT" CONTAINER */}
					
					{ accessories && accessories.map(accessory => 
						<div key={accessory._id} onClick={() => {
							setAccessoryConfiguration(true)
							setSelectedAccessory(accessory)
						}}>
							<UserCard user={accessory} />
						</div>) }

					{ accessories && accessories.length === 0 ? <p className='text-center'>No accessories yet</p> : <></> }
				</div>
			</div>
				

				{/* ACCESSORIES CONFIGURATION MODAL */}
				<Modal show={accessoryConfiguration} onHide={() => {
					setAccessoryConfiguration(false)
					setErrorMessage('')
				}}>
					<Modal.Header closeButton className='bg-slate-600'>Choose Equipment for {selectedAccessory.name}</Modal.Header>
					<Modal.Body className='bg-[#242526] h-[650px] overflow-auto flex flex-col items-center'>
						{ jobsites.map(jobsite => 
							<div key={jobsite._id}>
								<JobsiteMiniCard 
								setAccessoryConfiguration={setAccessoryConfiguration} 
								setEquipmentConfiguration={setEquipmentConfiguration} 
								setUserConfiguration={setUserConfiguration} 
								jobsite={jobsite} 
								setErrorMessage={setErrorMessage} 
								setSuccessModal={setSuccessModal} 
								setErrorModal={setErrorModal} 
								route={`accessory/add/${selectedAccessory._id}/${jobsite._id}`}/>
							</div>
							) }
						<ErrorModal errorMessage={errorMessage} setErrorMessage={setErrorMessage} errorModal={errorModal} setErrorModal={setErrorModal}/>
					</Modal.Body>
					<Modal.Footer id='modal' className='flex flex-col p-2'>
						<button className='red-buttons w-[200px] mt-4' onClick={(e) => {
							e.preventDefault()
							showAccessoryDeletion(true)
						}}> DELETE ACCESORY </button>
						<button className='buttons mt-4' onClick={() => setEditAccessoryModal(true)}>Edit</button>

						{/* ////////////////////////////////////// ACCESSORY EDIT MODAL /////////////////////////////////// */}
						<Modal show={editAccessoryModal} onHide={() => {
							setEditAccessoryModal(false)
							setAccessoryConfiguration(false)
							setErrorMessage('')
							setSelectedAccessory({})
							}}>
							<Modal.Header className='bg-[#414345]' closeButton> Edit {selectedAccessory.name} </Modal.Header>
							<Modal.Body className='bg-[#414345]'>
								<form className='p-3 flex flex-col items-center'>
									<label>Name:</label>
									<input name='name' value={editAccessory?.name} className='input' onChange={(e) => {
										handleEditChange(e, setEditAccessory, editAccessory)
									}}></input>
									<button className='buttons mt-4' onClick={(e) => {
										e.preventDefault();

										axios.patch(`/api/accessory/edit/${selectedAccessory._id}`, JSON.stringify(editAccessory), { headers: { 'Content-Type': 'application/json' }})
											.then(() => {
												loadAll();
												setEditAccessoryModal(false)
												setAccessoryConfiguration(false)
											})
											.catch((err) => {
												setErrorModal(true)
												setErrorMessage(err.response.data.message)
											})
										}}>EDIT</button>
								</form>
							</Modal.Body>
						</Modal>
						
					</Modal.Footer>



					{/* ACCESSORY DELETION */}
					<Modal show={accessoryDeletion} onHide={() => showAccessoryDeletion(false)}>
						<Modal.Header closeButton id="dropdown">Are you sure you want to delete {selectedAccessory.name}</Modal.Header>
						<Modal.Body id="dropdown" className='w-full flex mx-auto flex-row items-center justify-between'>
							<button className='buttons' onClick={() => showAccessoryDeletion(false)}>Cancel</button>
							<button className='red-buttons' onClick={(e) => {
								e.preventDefault()
									
								axios.delete(`/api/accessory/delete/${selectedAccessory._id}`)
								showAccessoryDeletion(false)
								router.push('/home')
								loadAll()
							}}>DELETE</button>
						</Modal.Body>
					</Modal>
				</Modal>



				{/* USER CONFIGURATION MODAL */}
				<Modal show={userConfiguration} onHide={() => {
					setUserConfiguration(false)
					setErrorMessage('')
					}}>
					<Modal.Header closeButton className='bg-slate-600'>Choose Jobsite for {selectedUser.name} ({selectedUser.email})</Modal.Header>
					<Modal.Body className='bg-[#242526] max-h-[450px] overflow-auto'>
						{ jobsites.map(jobsite => 
							<div key={jobsite._id}>
								<JobsiteMiniCard 
								setUserConfiguration={setUserConfiguration} 
								setEquipmentConfiguration={setEquipmentConfiguration} 
								setAccessoryConfiguration={setAccessoryConfiguration}
								jobsite={jobsite} 
								setErrorMessage={setErrorMessage} 
								setErrorModal={setErrorModal} 
								setSuccessModal={setSuccessModal}
								route={`user/add/${selectedUser._id}/${jobsite._id}`}/>
							</div> )}
						<ErrorModal errorMessage={errorMessage} setErrorMessage={setErrorMessage} errorModal={errorModal} setErrorModal={setErrorModal}/>
					</Modal.Body>



					{/* DOES NOT SHOW THIS PART OF MODAL FOR LOGGED IN USERS */}
					{ selectedUser.name === auth.name ? <></> :
						<>
						<Modal.Body className='bg-[#242526] overflow-auto'>
							<div>
								{ selectedUser.isAdmin ? 
									<button className='w-full mx-auto bg-red-600 text-white rounded p-1 font-bold' onClick={(e) => {
										e.preventDefault();
										handleRoles('admin','remove');
									}}>Remove Admin</button>
								:
									<button className='w-full mx-auto bg-blue-600 text-white rounded p-1 font-bold' onClick={(e) => {
										e.preventDefault();
										handleRoles('admin','add');
									}}>Make Admin</button> 
								}
		
								{ selectedUser.isForeman? 
									<button className='w-full mx-auto bg-red-600 text-white rounded p-1 font-bold mt-2' onClick={(e) => {
										e.preventDefault();
										handleRoles('foreman', 'remove');
									}}>Remove Foreman</button>
								:
									<button className='w-full mx-auto bg-blue-600 text-white rounded p-1 font-bold mt-2' onClick={(e) => {
										e.preventDefault();
										handleRoles('foreman', 'add')
									}}>Make Foreman</button> 
								}
		
								{ selectedUser.isModerator ? 
									<button className='w-full mx-auto bg-red-600 text-white rounded p-1 font-bold mt-2' onClick={(e) => {
										e.preventDefault();
										handleRoles('moderator', 'remove');
									}}>Remove Moderator</button>
								:
									<button className='w-full mx-auto bg-blue-600 text-white rounded p-1 font-bold mt-2' onClick={(e) => {
										e.preventDefault();
										handleRoles('moderator', 'add');
									}}>Make Moderator</button> 
								}
							</div>
							<button className='w-full mx-auto bg-red-600 text-white rounded p-1 font-bold mt-2' onClick={() =>{
									showUserDeletion(true)
							}}>Delete User</button>
							{/* MODAL FOR USER DELETION CONFIRMATION */}
							<Modal show={userDeletion} onHide={() => showUserDeletion(false)}>
								<Modal.Header closeButton id="dropdown">Are you sure you want to delete {selectedUser.name}</Modal.Header>
								<Modal.Body id="dropdown" className='w-full flex mx-auto flex-row items-center justify-between'>
									<button className='buttons' onClick={() => showUserDeletion(false)}>Cancel</button>
									<button className='red-buttons' onClick={handleDelete}>DELETE</button>
								</Modal.Body>
							</Modal>

						</Modal.Body>
						</>
					}
				</Modal>



				{/* EQUIPMENT CONFIGURATION MODAL */}
				<Modal className='overflow-auto' show={equipmentConfiguration} onHide={() => {
					setEquipmentConfiguration(false)
					setErrorMessage('')
					setShowDelete(false)
				}}>
					<Modal.Header closeButton className='bg-slate-600'>Choose Jobsite for {selectedEquipment.number} {selectedEquipment.name}</Modal.Header>
					<Modal.Body className='bg-[#242526] flex flex-col items-start h-[450px] overflow-auto'>

						{/* LIST OF JOBSITES IN EQUIPMENT CONFIGURATION MODAL */}

						{ jobsites.map(jobsite => 
							<div key={jobsite._id} onClick={() => setShowDelete(true)} className='w-full'>
								<JobsiteMiniCard 
								setUserConfiguration={setUserConfiguration} 
								setAccessoryConfiguration={setAccessoryConfiguration} 
								setEquipmentConfiguration={setEquipmentConfiguration} 
								setSuccessModal={setSuccessModal} 
								jobsite={jobsite} 
								setErrorMessage={setErrorMessage}
								setErrorModal={setErrorModal} 
								route={`equipment/add/${selectedEquipment._id}/${jobsite._id}`}/>
							</div>
							) 
							}
						<ErrorModal errorMessage={errorMessage} setErrorMessage={setErrorMessage} errorModal={errorModal} setErrorModal={setErrorModal}/>
					</Modal.Body>
					<Modal.Body className='mx-auto bg-[#242526] w-full text-center'>or</Modal.Body>
					{ showDelete == false ? 
						<Modal.Footer id='modal' className='w-full p-2 flex flex-col'>
							<button className='bg-red-600 p-2 rounded' onClick={(e) => {
								e.preventDefault()
								axios.delete(`/api/equipment/delete/${selectedEquipment._id}`)
								.then(() => loadAll())
								.catch(err => loadAll())
								setEquipmentConfiguration(false)
							}}>Delete Equipment</button>
							<button className='buttons mt-4' onClick={() => setEditEquipmentModal(true)}>Edit</button>

							{/* /////////////////////////// EDIT EQUIPMENT MODAL ////////////////////////////// */}
							<Modal show={editEquipmentModal} onHide={() => {
								setEditEquipmentModal(false)
								setAccessoryConfiguration(false)
								setErrorMessage('')
								setSelectedEquipment({})
							}}>
								<Modal.Header className='bg-[#414345]' closeButton> Edit {selectedEquipment.name} </Modal.Header>
								<Modal.Body className='bg-[#414345]'>
									<form className='p-3 flex flex-col items-center'>
										<label>Number:</label>
										<input name='number' value={editEquipment?.number} className='input' onChange={(e) => { handleEditChange(e, setEditEquipment, editEquipment) }}></input>
										<label>Name:</label>
										<input name='name' value={editEquipment?.name} className='input' onChange={(e) => { handleEditChange(e, setEditEquipment, editEquipment)}}></input>
										<button className='buttons mt-4' onClick={(e) => {
											e.preventDefault();

											axios.patch(`/api/equipment/edit/${selectedEquipment._id}`, JSON.stringify(editEquipment), { headers: { 'Content-Type': 'application/json' }})
											.then(() => {
												loadAll();
												setEditEquipmentModal(false)
												setEquipmentConfiguration(false)
											})
											.catch((err) => {
												setErrorModal(true)
												setErrorMessage(err.response.data.message)
											})
										}}>EDIT</button>
									</form>
								</Modal.Body>
							</Modal>


						</Modal.Footer>	
						:
						<></>}
				</Modal>



				<Modal show={successModal}>
					<Modal.Header id='success' className='text-2xl '><p className='mx-auto'>Added Successfully</p></Modal.Header>
					<Modal.Footer id='success'>{checkIcon}</Modal.Footer>
				</Modal>
		</div>
	)
}

export default Settings