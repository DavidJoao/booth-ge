import React from 'react'

const UserCard = ( {user } ) => {
  return (
    <>
        <button className='form m-2 w-full hover:scale-110 duration-200 bg-[#494A4C] flex items-center'>{user.number ? user.number : ''} {user.name}</button>
    </>
  )
}

export default UserCard