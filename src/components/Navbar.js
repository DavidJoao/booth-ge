import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='border-[3px] border-black flex flex-row items-center justify-between w-full h-[70px] p-5 bg-gradient-to-tr from-[#3b2c19] to-[#6e4f27] shadow-lg'>
        <Link className='buttons' href={'/home'}>Home</Link>
        <Link className='buttons' href={'/settings'}>Settings</Link>
    </div>
  )
}

export default Navbar