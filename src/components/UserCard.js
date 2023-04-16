import React from 'react'

const UserCard = ( {user } ) => {
  return (
    <>
        <button className='form m-2 w-[200px] hover:scale-110 duration-200 bg-[#494A4C]'>{user.number ? user.number : ''} {user.name}</button>
    </>
  )
}

export default UserCard