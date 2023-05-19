import axios from "@/custom/axios"
import React, { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { PuffLoader } from "react-spinners"
import generatePDF from "@/custom/generatePDF"

const DailyCard = ({ daily, loadAll, auth }) => {
   const trashLogo = (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth={1.5}
         stroke="currentColor"
         className="w-6 h-6">
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
         />
      </svg>
   )

   const printIcon = (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         strokeWidth={1.5}
         stroke="currentColor"
         className="w-6 h-6">
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
         />
      </svg>
   )

   const [deleteModal, setDeleteModal] = useState(false)

   const dateArr = daily.date.split('-');
   const newDate = `${dateArr[1]}-${dateArr[2]}-${dateArr[0]}`

   return (
      <div id="menu" className="w-full lg:w-[45%] p-3 rounded m-2" key={daily._id}>
         <div className="flex items-center justify-center">
            {auth.isModerator || auth.isAdmin ? (
               <button
                  className="text-white border p-1 rounded bg-slate-600"
                  onClick={() => generatePDF(daily)}>
                  {printIcon}
               </button>
            ) : (
               <></>
            )}

            <p className="w-full text-center border-b-[1px]">
               {newDate} at {daily.name}
            </p>

            {auth.isAdmin ? (
               <button
                  className="float-right bg-red-700 border rounded"
                  onClick={e => {
                     setDeleteModal(true)
                  }}>
                  {trashLogo}
               </button>
            ) : (
               <></>
            )}
         </div>
         <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
            <Modal.Header id="dropdown" closeButton>
               Are you sure you want to delete the daily permanently?
            </Modal.Header>
            <Modal.Body className="flex flex-row items-center justify-evenly p-3" id="modal">
               <button className="buttons" onClick={() => setDeleteModal(false)}>
                  Cancel
               </button>
               <button
                  className="red-buttons"
                  onClick={e => {
                     e.preventDefault()
                     axios.delete(`/api/daily/delete/${daily._id}`)
                     loadAll()
                     setDeleteModal(false)
                  }}>{" "} DELETE
               </button>
            </Modal.Body>
         </Modal>

         <div className="grid grid-cols-1 sm:grid-cols-2">
            <p>Contractor: {daily.contractor}</p>
            <p>Superintendent: {daily.superintendent}</p>
            <p>Foreman: {daily.foreman}</p>
            <p>Submitted: {daily.dateCreated}</p>
         </div>
         <p className="w-full border-t-[1px] font-bold"> Equipment and hours used: </p>
         <ul className="list-disc">
            {daily &&
               daily.equipment.map(item => {
                  return (
                     <li key={item.name}>
                        Name: {item.name} - Hours: {item.hours}
                     </li>
                  )
               })}
         </ul>
         <p>{daily.equipmentDescription}</p>
         <p className="w-full border-t-[1px] font-bold">Description of contract work performed:</p>
         <p>{daily.workDescription}</p>
         <p className="w-full border-t-[1px] font-bold">Description of contract extra performed:</p>
         <p>{daily.extraWorkDescription || 'No extra work'}</p>
         <p className="w-full text-center border-t-[1px]">
            Number of employees in jobsite: {daily.employeesNo}
         </p>
         <p>Picked Up Diesel? {daily.pickedUpDiesel === true ? 'Yes' : 'No'}</p>
         <ul className="list-disc">
            <li>Name: {daily.foreman} - Hours: {daily.totalHours}</li>
            {daily &&
               daily.employees.map(employee => {
                  return (
                     <li key={employee.name}>
                        Name: {employee.name} - Hours: {employee.hours}
                     </li>
                  )
               })}
         </ul>
         <p className="w-full border-t-[1px] font-bold">Notes:</p>
         <p>{daily.notes || 'No notes'}</p>
      </div>
   )
}

export default DailyCard
