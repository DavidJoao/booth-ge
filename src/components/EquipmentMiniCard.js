import axios from '@/custom/axios'
import React from 'react'
import { useRouter } from 'next/router'

const EquipmentMiniCard = ( { equipment, setErrorMessage, setErrorModal, route } ) => {

    const router = useRouter()

    const handleUpdate = () => {
        setErrorMessage('')
        try {
            axios.patch(`/api/${route}`)
                .then(res => {
                    router.push('/home')
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
        <button className='form mx-auto w-[200px] border border-white hover:scale-110 duration-200 mb-2' onClick={handleUpdate}>{equipment.number} {equipment.name}</button>
    </>
  )
}

export default EquipmentMiniCard 