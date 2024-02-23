import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { PuffLoader } from 'react-spinners'
import CCSection from '@/components/CCSection'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'

const Warnings = () => {

    const router = useRouter()
    const violations = ['Attendance', 'Breach of Company Policy', 'Carelessness', 'Conduct', 'Creating a Disturbance', 'Failure to Follow Instructions', 'Insubordination', 'Performance', 'Personal Work', 'Safety', 'Tardiness', 'Unauthorized Absence', 'Work Quality / Accuracy', 'Work Quantity / Output', 'Willful Damage to Company Property']
    const [checkedViolations, setCheckedViolations] = useState([])

    // CHECK SESSION
    useEffect(() => {
        if ( auth.token === undefined) {
            router.push('/login')
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
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Submitting Warning, Please Wait...');
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

        setIsLoading(true)
        setStatusMessage('Submitting Warning, Please Wait...')

        axios.post('/api/email/warning', warning, { headers: { 'Content-Type': 'application/json ' } })
            .then(res => {
                setStatusMessage('✓ Warning Submitted Successfully ✓')
                setCheckedViolations([])
                setType('')
                setWarning(initialWarning)
                setTimeout(() => {
                    setIsLoading(false)
                }, "2000");
            })
            .catch(err => {
                console.log(err)
                setIsLoading(false)
            })
    }

  return (
    <div className='flex flex-col items-center bg-[#242526] min-h-[1200px] h-auto lg:h-screen pt-[85px] pb-2'>
        { isLoading ? (
            <div className='h-screen bg-[#242526] flex flex-col items-center justify-center'>
                <PuffLoader color='#ffffff' loading={isLoading} size={120}/>
                <p className="mt-4">{statusMessage}</p>
            </div>
        ) : (
        <div>
        <p className='text-xl font-bold'>Employee Discipline Form</p>
        <form className='lg:border rounded w-full md:w-[800px] lg:w-[900px] p-2 flex flex-col' onSubmit={handleSubmit}>
            {/* SELECT EMPLOYEE */}
            <p className='mb-0'>Employee Name:</p>
            <select required name='employee' value={warning.employee} onChange={handleChange} className='input w-full'>
                <option>Select Employee</option>
                { users && users.filter((user) => user.name !== 'Byanka Arceo' && user.name !== 'Alfredo Sandoval' && user.name !== 'Roger Booth' && user.name !== 'Veronica Rivera').map((user) => {
                    return (
                        <option key={user._id}>{user.name}</option>
                    )
                }) }
            </select>
            <p className='mb-0'>Date:</p>
            <input required type='date' className='input w-full mb-1' onChange={(e) => {
                let [day, month, year] = e.target.value.split('-').reverse()
                setWarning({
                    ...warning,
                    ['date']: `${month}-${day}-${year}`
                })

            }} />
            {/* CHECK TYPE OF WARNING */}
            <select required name='type' value={warning.type} className='input w-full' onChange={(e) => {
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
                <div className='flex flex-col'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 mt-2'>
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
                    <textarea required name='description' value={warning.description} className='input resize-none h-[150px] mx-auto mb-4' placeholder='Description of violation(s)' onChange={handleChange}/>   
                </div>
            ) : type === 'Verbal' ? (
                // VERBAL FORM
                <div>
                    <textarea required name='description' value={warning.description} className='input resize-none h-[150px] mx-auto mb-4 w-full mt-3' placeholder='Description of violation(s)' onChange={handleChange}/>   
                </div>
            ) : (
                <p>Please, select type of warning</p>
            ) }
            <button type='submit' className='buttons w-[200px] mx-auto'>Send Warning</button>
            <p className='text-[rgba(255,255,255,0.4)]'>Warning will be submitted by: {auth?.name}</p>
        </form>
        <CCSection />
        </div>
        ) }
    </div>
  )
}

export default Warnings