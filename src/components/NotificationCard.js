import axios from "@/custom/axios"
import { useState, useContext } from "react"
import { Modal } from "react-bootstrap"
import AuthContext from "@/custom/AuthProvider"

const NotificationCard = ( { notification, auth, loadAll } ) => {

    const trashLogo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>

    const editLogo = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>

    const { jobsites, users } = useContext(AuthContext)

    const [showEdit, setShowEdit] = useState(false)
    const [showSign, setShowSign] = useState(false)
    const [employeesNoArray, setEmployeesNoArray] = useState([])
    const [rentalNoArray, setRentalNoArray] = useState([])

    const initialEdit = {
        title: notification.title || '',
        message: notification.message || '',
    }

    const initialSignSheet = {
        title: notification.title,
        date: Date().split(' ').splice(1, 3).join(' '),
        employees: [],
        rentedEmployees: [],
        jobsite: ''
    }

    const [newEdit, setNewEdit] = useState(initialEdit)
    const [signForm, setSignForm] = useState(initialSignSheet)

    const handleChange = (e) => {
        const { name, value } = e.target;

        setNewEdit({
        ...newEdit,
        [name]: value
        })
    }

    console.log(signForm)

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/api/email/meeting', JSON.stringify(signForm), { headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                console.log(res)
                setShowSign(false);
                setRentalNoArray([]);
                setEmployeesNoArray([]);
                setSignForm(initialSignSheet)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="w-[90%] flex flex-col h-auto mb-3 p-3 rounded-lg shadow-md bg-[#494A4C]">
            <h1 className="text-xl">{notification.title}</h1>
            <div className="mb-1">
            {auth.isAdmin || auth.isModerator ? (
                <>
                    <button className="bg-red-700 p-1 border float-right rounded" onClick={() => {
                        axios
                            .delete(`/api/notification/delete/${notification._id}`)
                            .then(() => loadAll())
                        }}>
                        {trashLogo}
                    </button>
                    <button  className="bg-slate-700 p-1 border float-right rounded mr-2" onClick={() => setShowEdit(true)}>
                        {editLogo}
                    </button>
                </>
            ) : (
                ""
            )}
            </div>
            {/* EDIT MODAL */}
            <Modal show={showEdit} onHide={() => {setShowEdit(false)}}>
                <Modal.Header id="dropdown" closeButton>
                    Edit Notification
                </Modal.Header>
                <Modal.Body id="modal" className="flex flex-col">
                    <label>Title:</label>
                    <input name="title" value={newEdit.title} className="input" onChange={handleChange} />
                    <label>Message:</label>
                    <textarea name="message" value={newEdit.message} className="input h-[300px]" onChange={handleChange}/>
                    <button
                        className="buttons mt-3 mx-auto"
                        onClick={() => {
                            axios
                            .patch(
                                `/api/notification/edit/${notification._id}`,
                                JSON.stringify(newEdit),
                                { headers: { "Content-Type": "application/json" } }
                            )
                            .then(() => {
                                loadAll()
                                setShowEdit(false)
                            })
                        }}>
                        Edit
                    </button>
                </Modal.Body>
            </Modal>
            {notification.message === "" ? (
            <></>
            ) : (
            <p className="break-words overflow-auto border-[1px] border-white rounded p-2 bg-[rgba(255,255,255,0.3)]"> {notification.message} </p>
            )}
            {notification.link !== "" ? (
            <iframe className="mt-3" src={`${notification.link.split("view")[0]}preview`} height={500}></iframe>
            ) : (
            <></>
            )}
            <button
            className="blue-buttons w-3/4 mx-auto mt-4 mb-4"
            onClick={e => {
                e.preventDefault()
                setShowSign(true)
            }}>
            Sign Safety Meeting
            </button>
            {/* MEETING SIGNING SHEET MODAL */}
            <Modal show={showSign} onHide={() => {
                setShowSign(false)
                setEmployeesNoArray([])
                setRentalNoArray([])
            }}>
                <Modal.Header id="modal" className="font-bold text-2xl" closeButton>{notification.title}</Modal.Header>
                <Modal.Body id="modal">
                    <form className="grid p-3" onSubmit={handleSubmit}>
                        <label>Number of Booth Grading Employees:</label>
                        <input required name="rentalNo" type="number" min={0} className="input" onChange={(e) => {
                            const newArray = [];
                            for (let i = 0; i < parseInt(e.target.value); i++) {
                                newArray.push(i);
                            }
                            setEmployeesNoArray(newArray);
                        }}/>
                        <label>Number of Rental Laborers:</label>
                        <input name="rentalNo" type="number" min={0} className="input" onClick={(e) => {
                            const newArray = [];
                            for (let i = 0; i < parseInt(e.target.value); i++) {
                                newArray.push(i);
                            }
                            setRentalNoArray(newArray);
                        }}/>
                        <label>Date:</label>
                        <input value={signForm.date} name="date" disabled className="input bg-slate-400"/>
                        <label>Jobsite Location: </label>
                        <select required name="jobsite" className="input" onChange={(e) => {
                            const { value, name } = e.target
                            setSignForm({
                                ...signForm,
                                [name]: value
                            })
                        }}>
                            <option>Choose Jobsite Address</option>
                            { jobsites && jobsites.map(jobsite => {
                                return (<option key={jobsite.address}>{jobsite.address}</option>)
                            })}
                        </select>

                        { employeesNoArray.map((employee, index) => {
                        return (
                        <div className='grid w-full p-2' key={employee.name}>
                            <label className="mr-1">Booth Employe {index + 1} Name:</label>
                            <select className='input' onChange={(e) => {
                                const newEmployees = [...signForm.employees];
                                newEmployees[index] = { ...newEmployees[index], name: e.target.value };
                                setSignForm({ ...signForm, employees: newEmployees });
                            }}>
                                <option>Choose Employee</option>
                                    { users && users.filter((user) => user.name !== 'Byanka Arceo' && user.name !== 'Alfredo Sandoval' && user.name !== 'Roger Booth' && user.name !== 'Veronica Rivera').map(user => {
                                        return (
                                            <option key={user._id}>{user.name}</option>
                                        )
                                    })}
                            </select>
                        </div>
                            )
                        } )}
                        { rentalNoArray.map((employee, index) => {
                        return (
                        <div className='grid w-full p-2' key={employee.name}>
                            <label className="mr-1">Rental Employe {index + 1} Name:</label>
                            <input className="input"  onChange={(e) => {
                                const newEmployees = [...signForm.rentedEmployees];
                                newEmployees[index] = { ...newEmployees[index], name: e.target.value };
                                setSignForm({ ...signForm, rentedEmployees: newEmployees });
                            }}/>
                        </div>
                            )
                        } )}

                        <button type="submit" className="blue-buttons mx-auto mt-2">Submit</button>

                    </form>
                </Modal.Body>
                <Modal.Footer id="modal">
                </Modal.Footer>
            </Modal>
            <p>Posted By: {notification.author}</p>
            <p>Date: {notification.date}</p>
        </div>
    )
    }

    export default NotificationCard