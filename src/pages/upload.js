import React, { useState } from 'react'
import axios from '@/custom/axios'
import imageCompression from 'browser-image-compression';

const Upload = () => {

    const [uploadedFile, setUploadedFile] = useState(null);
    const [arrayBuffer, setPdfBuffer] = useState();
  
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
      
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          setPdfBuffer(arrayBuffer);
        };
      
        reader.readAsArrayBuffer(file);
      };


  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('file', uploadedFile)

    axios.post('/api/uploads/send', arrayBuffer, { headers: { 'Content-Type': 'application/pdf' } })
        .then((res) => console.log(res))
        .catch((error) => console.error('Error uploading PDF:', error));
  };
    
  return (
    <div className='bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center pt-[80px] lg:p-4 lg:pt-[80px]'>
        <form className='flex flex-col items-center justify-center p-4 rounded' id='menu' onSubmit={handleSubmit}>
            <label>Upload Photos</label>
            <input type='file' className='input' onChange={handleFileUpload}/>
            {/* <div className='p-4 mt-4 w-full overflow-x-auto h-auto' id='dropdown'>

            </div> */}
            <button type='submit' className='buttons'>Submit</button>
        </form>
    </div>
  )
}

export default Upload