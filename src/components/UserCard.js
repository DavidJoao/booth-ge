import React from 'react'

const UserCard = ( {user } ) => {
  return (
    <>
        <button className='form m-2 w-[200px] border border-white hover:scale-110 duration-200'>{user.name}</button>
    </>
  )
}

export default UserCard