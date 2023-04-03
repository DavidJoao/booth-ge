import React, { useContext } from 'react'
import Link from 'next/link'
import AuthContext from '@/custom/AuthProvider'

const Navbar = () => {

  const { auth } = useContext(AuthContext)
  return (
    <>
    { auth.token ? 
      <div className='border-[3px] border-black flex flex-row items-center justify-between w-full h-[70px] p-5 bg-gradient-to-tr from-[#3b2c19] to-[#6e4f27] shadow-lg mb-3'>
          <Link className='buttons' href={'/home'}>Home</Link>
          <Link className='buttons' href={'/settings'}>Settings</Link>
      </div>
      :
      <></>
     }
    </>
  )
}

export default Navbar