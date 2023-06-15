import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession';
import axios from '@/custom/axios';
import { PuffLoader } from 'react-spinners';
import CCSection from '@/components/CCSection';

const Absence = () => {

    const { auth, setAuth, loadAll } = useContext(AuthContext)
    
    const initialForm = {
        name: auth?.name,
        foreman: '',
        type: '',
        from: '',
        to: '',
        totalHours: '',
        reason: '',
        date: Date().split(' ').splice(1, 3).join(' '),
    }
    
    const [form, setForm] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Submitting Absence Request, Please Wait...');

    useEffect(() => {
        CheckSession(AuthContext, setAuth)
            .then(() => {
                loadAll()
                setForm({
                    ...form,
                    ['name']: auth?.name
                })
            })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true)
        setStatusMessage('Submitting Absence Request, Please Wait...')

        axios.post('/api/email/absence', form, { headers: { 'Content-Type': 'application/json ' } })
            .then(res => {
                setStatusMessage('✓ Absence Request Submitted Successfully ✓')
                setForm(initialForm)
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
    <div className='flex flex-col items-center bg-[#242526] h-[1200px] lg:h-screen pt-[85px] pb-2'>
        { isLoading ? (
            <div className='h-screen bg-[#242526] flex flex-col items-center justify-center'>
                <PuffLoader color='#ffffff' loading={isLoading} size={120}/>
                <p className="mt-4">{statusMessage}</p>
            </div>
        ) : (
            <form className='flex flex-col w-[350px] w-full lg:w-3/4 bg-[#494A4C] p-4 text-white rounded-lg shadow-xl' onSubmit={handleSubmit}>
                <p className='font-bold text-2xl'>Absence Request</p>
                <p className='w-full bg-[rgba(255,255,255,0.3)] rounded p-1 text-center'>Absence Information</p>
                <p className='font-bold'>Employee Name:</p>
                <p>{auth.name}</p>
                <div className='flex flex-col lg:grid lg:grid-cols-4 gap-2 lg:gap-5'>
                    <div className='flex flex-col'>
                        <label className='font-bold'>Foreman:</label>
                        <input required name='foreman' value={form.foreman} className='input w-full' onChange={handleChange}/>
                    </div>
                    <div className='flex flex-col'>
                        <label>Type of Absence:</label>
                        <select required name='type' value={form.type} className='input w-full' onChange={handleChange}>
                            <option>Choose Type</option>
                            <option>Vacation</option>
                            <option>Sick</option>
                            <option>Jury Duty</option>
                            <option>Time Off Without Pay / Other</option>
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-bold'>From:</label>
                        <input required name='from' value={form.from} className='input w-full' type='date' onChange={handleChange}/>
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-bold'>To:</label>
                        <input required name='to' value={form.to} className='input w-full' type='date' onChange={handleChange}/>
                    </div>
                    <div className='flex flex-col'>
                        <label className='font-bold'>Total Hours:</label>
                        <input required name='totalHours' value={form.totalHours} className='input w-full' type='number' onChange={handleChange}/>
                    </div>
                    <div className='flex flex-col col-span-3'>
                        <label className='font-bold'>Reason for Absence:</label>
                        <input required name='reason' value={form.reason} className='input  w-full' onChange={handleChange}/>
                    </div>
                </div>
                <p className='mt-3 italic'>You must submit requests for absences, other than sick leave, two days prior to the first day you will be absent.</p>
                <p>Date: {form.date}</p>
                <button type='submit' className='buttons mx-auto w-[150px]'>Send Request</button>
            </form>
        ) }
        <CCSection />
    </div>
  )
}

export default Absence