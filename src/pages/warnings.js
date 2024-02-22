import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { PuffLoader } from 'react-spinners'
import CCSection from '@/components/CCSection'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'

const warnings = () => {

    const router = useRouter()
    const violations = ['Attendance', 'Breach of Company Policy', 'Carelessness', 'Conduct', 'Creating a Disturbance', 'Failure to Follow Instructions', 'Insubordination', 'Performance', 'Personal Work', 'Safety', 'Tardiness', 'Unauthorized Absence', 'Work Quality / Accuracy', 'Work Quantity / Output', 'Willful Damage to Company Property']
    const [checkedViolations, setCheckedViolations] = useState([])

    // CHECK SESSION
    useEffect(() => {
        if ( auth.token === undefined) {
            // router.push('/login')
        } else {
            CheckSession(AuthContext, setAuth)
        }
    }, [])

    useEffect(() => {
        setWarning({
            ...warning,
            ['violations']: checkedViolations.join(', ')
        })
    }, [checkedViolations])

    // STATES
    const { auth, setAuth, users } = useContext(AuthContext)
    const [type, setType] = useState('')

    const initialWarning = {
        submittedBy: auth?.name,
        violations: '',
        description: '',
        date: '',
        employee: '',
        type: ''
    }

    const [warning, setWarning] = useState(initialWarning)

    const handleChange = (e) => {
        const { name, value } = e.target;

        setWarning({
            ...warning,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

  return (
    <div className='flex flex-col items-center bg-[#242526] h-[1200px] lg:h-screen pt-[85px] pb-2'>
        <p className='text-xl font-bold'>Employee Discipline Form</p>
        <form className='border w-full md:w-[800px] lg:w-[900px] p-2'>
            {/* SELECT EMPLOYEE */}
            <p className='mb-0'>Employee Name:</p>
            <select name='employee' value={warning.employee} onChange={handleChange} className='input w-full'>
                <option>Select Employee</option>
                { users && users.filter((user) => user.name !== 'Byanka Arceo' && user.name !== 'Alfredo Sandoval' && user.name !== 'Roger Booth' && user.name !== 'Veronica Rivera').map((user) => {
                    return (
                        <option key={user._id}>{user.name}</option>
                    )
                }) }
            </select>
            <p className='mb-0'>Date:</p>
            <input type='date' className='input w-full mb-1' onChange={(e) => {
                let [day, month, year] = e.target.value.split('-').reverse()
                setWarning({
                    ...warning,
                    ['date']: `${month}-${day}-${year}`
                })

            }} />
            {/* CHECK TYPE OF WARNING */}
            <select name='type' value={warning.type} className='input w-full' onChange={(e) => {
                setType(e.target.value)
                setWarning({
                    ...warning,
                    ['type']: e.target.value
                })
                }}>
                <option>Choose Type of Warning</option>
                <option>Verbal</option>
                <option>Written</option>
            </select>
            {/* CONDITIONAL RENDERING IF VERBAL/WRITTEN WARNING */}
            { type && type === 'Written' ? (
                // WRITTEN FORM
                <div>
                    <div className='grid grid-cols-2 md:grid-cols-4 mt-2'>
                        { violations && violations.map((violation, index) => {
                            return(
                                <div key={index} className='flex flex-row items-center justify-start gap-2'>
                                    <input type='checkbox' value={`${violation}`} className='mx-0 my-0' onChange={(e) => {
                                        if (e.target.checked === true) {
                                            setCheckedViolations(prevArray => [...prevArray, e.target.value])
                                        } else {
                                            setCheckedViolations(prevArray => prevArray.filter(item => item !== e.target.value))
                                        }
                                        // e.target.checked ? setCheckedViolations(prevArray => [...prevArray, e.target.value]) : setCheckedViolations(prevArray => prevArray.filter(item => item !== e.target.value))
                                    }}/>
                                    <p className='mx-0 my-0'>{violation}</p>
                                </div>
                            )
                        }) }   
                    </div>
                    <p className='mt-5 mb-5'>Checked Violations: { checkedViolations.length !== 0 ? checkedViolations.join(', ') : 'Checked Options Empty' }</p>
                    <textarea name='description' value={warning.description} className='input resize-none h-[150px]' placeholder='Description of violation(s)' onChange={handleChange}/>   
                </div>
            ) : type === 'Verbal' ? (
                // VERBAL FORM
                <div>
                    VERBAL
                </div>
            ) : (
                <p>Please, select type of warning</p>
            ) }
            <p className='text-[rgba(255,255,255,0.4)]'>Warning will be submitted by: {auth?.name}</p>
        </form>
        <p onClick={handleSubmit}>click</p>
    </div>
  )
}

export default warnings