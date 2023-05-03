import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'
import { Modal } from 'react-bootstrap'

const JobsiteCard = ( { jobsite, auth } ) => {

  const trashLogo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
  const editLogo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>

  const initialEdit = {
    address: jobsite.address || '',
    name: jobsite.name || '',
    employees: jobsite.employees,
    equipment: jobsite.equipment,
    superintendent: jobsite.superintendent || '',
    startTime: jobsite.startTime || '',
    contractor: jobsite.contractor || ''
  }

  const router = useRouter()
  const { loadAll } = useContext(AuthContext)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [newEdit, setNewEdit] = useState(initialEdit)
  const [errorMessage, setErrorMessage] = useState('')
  
  const handleDelete = () => {
    axios.delete(`/api/jobsite/delete/${jobsite._id}`)
    .then(res => loadAll())
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewEdit({
      ...newEdit,
      [name]: value
    })
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();

    axios.patch(`/api/jobsite/edit/${jobsite._id}`, JSON.stringify(newEdit), { headers: { 'Content-Type': 'application/json' } })
      .then(res => {
        loadAll()
        setShowEdit(false)
      })
      .catch(err => setErrorMessage(err.response.data.message))
  }
  
  return (
    <div className='w-full lg:w-[500px] h-auto lg:h-[500px] m-2 basic-container' key={jobsite._id}>
          <h1 className='border-t-[1px] border-l-[1px] border-r-[1px] border-white p-2 rounded-tr-lg rounded-tl-lg font-extrabold text-3xl flex items-center justify-between'>
            {jobsite.name}
            { auth.isAdmin ? 
            <div className='w-[100px] flex flex-row justify-between'>
              <button className='bg-slate-700 p-1 border rounded' onClick={() => setShowEdit(true)}>{editLogo}</button>
              <button className='bg-red-700 p-1 border rounded' onClick={() => setShowDelete(true)}>{trashLogo}</button>
            </div>
            :
            ''
          }
          </h1>
          {/* MODAL FOR JOBSITE DELETION */}
          <Modal show={showDelete} onHide={() => setShowDelete(false)}>
            <Modal.Header className='text-2xl font-bold bg-[#242526]'>Are you sure you want to delete {jobsite.name}?</Modal.Header>
            <Modal.Body className='flex items-center justify-between bg-[#242526]'>
              <button className='buttons' onClick={() => setShowDelete(false)}>Cancel</button>
              <button className='red-buttons' onClick={() => {
                handleDelete()
                setShowDelete(false)
              }}>Delete</button>
            </Modal.Body>
          </Modal>


          {/* MODAL FOR JOBSITE EDIT */}
          <Modal show={showEdit} onHide={() => setShowEdit(false)}>
              <Modal.Header className='text-2xl font-bold bg-[#242526]' closeButton>Edit {jobsite.name}</Modal.Header>
              <Modal.Body className='bg-[#242526]'>
                <form className='flex flex-col items-center justify-between' onSubmit={handleEditSubmit}>
                  <label>Name: </label>
                  <input required name='name' className='input' value={newEdit.name} onChange={handleChange}/>
                  <label>Address: </label>
                  <input required name='address' className='input' value={newEdit.address} onChange={handleChange}/>
                  <label>Superintendent: </label>
                  <input required name='superintendent' className='input' value={newEdit.superintendent} onChange={handleChange}/>
                  <label>Contractor:</label>
                  <input required name='contractor' className='input' value={newEdit.contractor} onChange={handleChange}/>
                  <label>Start Time:</label>
                  <input required name='startTime' className='input' value={newEdit.startTime} type='time' onChange={handleChange}/>
                  <button type='submit' className='buttons mt-3'>Edit</button>
                </form>
                <p className='text-center mt-3 text-red-600 font-bold'>{errorMessage}</p>
              </Modal.Body>
          </Modal>
        <div className='border-[1px] p-2 rounded-lg rounded-tl-none h-auto'>
            <p>Address: {jobsite.address}</p>
            <p>Superintendent: {jobsite.superintendent}</p>
            <p> Contractor: {jobsite.contractor}</p>
            <p className='border-t-[1px] border-white pt-2'>Start Time: {jobsite.startTime} A.M.</p>
            <p className='border-t-[1px] border-white pt-2'>Employees:</p>
            { jobsite && jobsite.employees.length != 0 ? jobsite.employees.map(employee => {
              return(
                <div className='flex flex-row items-center justify-between' key={employee._id}>
                    { employee.isForeman === true ?
                      <p>{employee.name} (foreman)</p>
                      :
                      <p>{employee.name}</p>
                     }
                    { auth.isAdmin ? 
                      <button className='bg-red-700 rounded w-[70px]' onClick={() => {
                        axios.patch(`/api/user/remove/${employee._id}/${jobsite._id}`)
                        .then(res => loadAll())
                      }}>remove</button>
                      :
                      <></>
                    }
                  </div>
                )}) : <p>No employees</p>
              }
            <p className='border-t-[1px] border-white pt-2'>Equipment:</p>
            { jobsite && jobsite.equipment.length != 0 ? jobsite.equipment.map(equipment => {
              return(
                <div className='border flex flex-col justify-center rounded p-2 mb-2' key={equipment._id}>
                  <div className='flex flex-row items-start justify-between'>
                    <p>{equipment.number} {equipment.name}</p>
                    { auth.isAdmin ? 
                    <div>
                      {/* <button className='bg-slate-500 rounded w-[70px] mr-2'>edit</button> */}
                      <button className='bg-red-700 rounded w-[70px]' onClick={() => {
                        axios.patch(`/api/equipment/remove/${equipment._id}/${jobsite._id}`)
                        .then(res => loadAll())
                      }}>remove</button>
                    </div>
                    :
                    <></>
                  }
                  </div>
                  <ul className='list-disc'>
                  {equipment.accessories.map(accessory => {
                    return(
                      <li className='m-1' key={accessory._id}>{accessory.name}
                      {auth.isAdmin ? 
                        <button className='float-right bg-red-600 hover:bg-red-500 w-[20px] rounded text-center' onClick={(e) => {
                          e.preventDefault()
                          axios.patch(`/api/accessory/remove/${accessory._id}/${equipment._id}`)
                            .then(res => loadAll())
                        }}>-</button>
                        :
                        <></>
                      }
                      </li>
                    )
                  })}
                  </ul>
                </div>
              )}) : <p>No equipment</p>}

        </div>
    </div>
  )
}

export default JobsiteCard