import React from 'react'
import { Modal } from 'react-bootstrap'

const ErrorModal = ( { errorMessage, setErrorMessage, errorModal, setErrorModal } ) => {
  return (
    <Modal centered show={errorModal} onHide={() => {
        setErrorMessage('')
        setErrorModal(false)
    }}>
        <Modal.Header id='error-modal' closeButton>{errorMessage}</Modal.Header>
        <Modal.Footer id='error-modal'>
            <button className='buttons mx-auto' onClick={(e) => {
                e.preventDefault();
                setErrorModal(false)
            }}>Close</button>
        </Modal.Footer>
    </Modal>
  )
}

export default ErrorModal