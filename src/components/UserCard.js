import React from 'react'
import { Modal } from 'react-bootstrap'

const UserCard = ( {user } ) => {
  return (
    <div>
        <p className='form m-2 w-[200px] border border-white hover:scale-110 duration-200'>{user.name}</p>
    </div>
  )
}

export default UserCard