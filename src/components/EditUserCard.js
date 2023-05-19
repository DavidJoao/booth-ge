import axios from '@/custom/axios'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import ErrorModal from './ErrorModal'

const EditUserCard = ({ user, auth, loadAll }) => {

    const [userConfiguration, setUserConfiguration] = useState(false)

    const initialEdit = {
        name: user.name || '',
        email: user.email || '',
      }

    const [userEdit, setUserEdit] = useState(initialEdit)
    const [errorModal, setErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleEditChange = (e) => {
        const { value, name } = e.target;

        setUserEdit({
            ...userEdit,
            [name]: value
        })
        console.log(userEdit)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.patch(`/api/user/edit/${user._id}`, userEdit, { headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                console.log(res);
                setUserConfiguration(false)
                loadAll();
            })
            .catch(err => {
				setErrorModal(true)
				setErrorMessage(err.response.data.message)
            })    
    }

  return (
    <>
    <button className='form m-2 w-[90%] mx-auto hover:scale-110 duration-200 bg-[#494A4C] flex items-center' onClick={() => setUserConfiguration(true)}>{user.name}</button>
    <Modal show={userConfiguration} onHide={() => setUserConfiguration(false)}>
    <Modal.Header closeButton className='bg-slate-600'>Configuration Modal {user.name}</Modal.Header>
        <Modal.Body id='modal'>
            <div id='modal' className='flex flex-col items-center justify-center p-3'>
                <form className='mb-3 flex flex-col items-start w-full' onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input required name='name' className='input w-full' value={userEdit.name} onChange={handleEditChange}/>
                    <label>Email:</label>
                    <input required name='email' className='input w-full mb-3' value={userEdit.email} onChange={handleEditChange}/>
                    <label>Is Administrator? {user.isAdmin ? 'Yes' : 'No'} </label>
                    <label>Is Moderator? {user.isModerator ? 'Yes' : 'No'}</label>
                    <label>Is Foreman? {user.isForeman ? 'Yes' : 'No'}</label>
                    <button type='submit' className='buttons mt-3 mx-auto w-[300px]'>Edit</button>
                </form>
                {/* <button className='red-buttons w-[300px]'>Reset {user.name} Password</button>  */}
            </div>
        </Modal.Body>
        <ErrorModal errorMessage={errorMessage} setErrorMessage={setErrorMessage} errorModal={errorModal} setErrorModal={setErrorModal}/>
    </Modal>
    </>
  )
}

export default EditUserCard