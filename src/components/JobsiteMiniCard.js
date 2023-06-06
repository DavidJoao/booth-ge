import axios from '@/custom/axios'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Modal } from 'react-bootstrap'

const JobsiteMiniCard = ( { jobsite, setErrorMessage, setSuccessModal, setErrorModal, route, setUserConfiguration, setAccessoryConfiguration, setEquipmentConfiguration } ) => {

    const router = useRouter()

    const handleUpdate = () => {
        setErrorMessage('')
        try {
            axios.patch(`/api/${route}`)
                .then(res => {
                    console.log(res)
                    setUserConfiguration(false)
                    setEquipmentConfiguration(false)
                    setAccessoryConfiguration(false)

                    setSuccessModal(true)
                    setTimeout(() => {
                        setSuccessModal(false)
                    }, 2000);

                })
                .catch(err => {
                    setErrorModal(true)
                    setErrorMessage(err.response.data.message)
                })
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <>
        <button className='form mx-auto w-[200px] border border-white hover:scale-110 duration-200 mb-2' onClick={handleUpdate}>{jobsite.address}</button>
    </>
  )
}

export default JobsiteMiniCard 