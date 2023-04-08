import axios from '@/custom/axios'
import React from 'react'
import { useRouter } from 'next/router'

const JobsiteMiniCard = ( { jobsite, selectedUser, setErrorMessage } ) => {

    const router = useRouter()

    const handleUpdate = () => {
        try {
            axios.patch(`/api/jobsite/add/${selectedUser._id}/${jobsite._id}`)
                .then(res => {
                    router.push('/home')
                })
                .catch(err => {
                    setErrorMessage('User already in jobsite')
                })
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <>
        <button className='form m-2 w-[200px] border border-white hover:scale-110 duration-200' onClick={handleUpdate}>{jobsite.address}</button>
    </>
  )
}

export default JobsiteMiniCard 