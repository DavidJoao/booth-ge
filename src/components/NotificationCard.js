import axios from "@/custom/axios"
import { useState } from "react"
import { Modal } from "react-bootstrap"

const NotificationCard = ( { notification, auth, loadAll } ) => {

  const trashLogo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>

  const editLogo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>

  const [showEdit, setShowEdit] = useState(false)

  const initialEdit = {
    title: notification.title || '',
    message: notification.message || '',
  }

  const [newEdit, setNewEdit] = useState(initialEdit)

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewEdit({
      ...newEdit,
      [name]: value
    })
  }

  return (
    <div className="w-[90%] flex flex-col h-auto mb-3 p-3 rounded-lg shadow-md bg-[#494A4C]">
      <h1 className="text-xl">
        {notification.title}
      </h1>
      <div className="mb-1">
        { auth.isAdmin || auth.isModerator ? 
        <>
            <button className='bg-red-700 p-1 border float-right rounded' onClick={() => {
              axios.delete(`/api/notification/delete/${notification._id}`)
                .then(() => loadAll())
            }}>{trashLogo}</button>
              <button className='bg-slate-700 p-1 border float-right rounded mr-2' onClick={() => setShowEdit(true)}>{editLogo}</button>
        </>
            :
            ''
             }
      </div>
      {/*  */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header id="dropdown" closeButton>Edit Notification</Modal.Header>
        <Modal.Body id="modal" className="flex flex-col">
            <label>Title:</label>
            <input name="title" value={newEdit.title} className="input" onChange={handleChange}/>
            <label>Message:</label>
            <textarea name="message" value={newEdit.message} className="input h-[300px]" onChange={handleChange} />
            <button className="buttons mt-3 mx-auto" onClick={() => {
              axios.patch(`/api/notification/edit/${notification._id}`, JSON.stringify(newEdit), { headers: { 'Content-Type': 'application/json' } })
                .then(() => {
                  loadAll()
                  setShowEdit(false)
                })
            }}>Edit</button>
        </Modal.Body>
      </Modal>
      <p className="break-words overflow-auto border-[1px] border-white rounded p-2 bg-[rgba(255,255,255,0.3)]">{notification.message}</p>
      <p>Posted By: {notification.author}</p>
      <p>Date: {notification.date}</p>
    </div>
  )
}

export default NotificationCard