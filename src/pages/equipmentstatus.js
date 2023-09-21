import { useContext, useState, useEffect } from 'react'
import CCSection from '@/components/CCSection'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { PuffLoader } from 'react-spinners';
import axios from '@/custom/axios';

const EquipmentStatus = () => {

  const { auth, equipment, loadAll, setAuth } = useContext(AuthContext)

  const initialReport = {
    author: auth?.name,
    equipment: '',
    description: '',
    date: Date().split(' ').splice(1, 3).join(' ')
  }

  const [report, setReport] = useState(initialReport)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Submitting Equipment Report, Please Wait...');

  useEffect(() => {
    CheckSession(AuthContext, setAuth)
      .then(() => {
        loadAll()
        })
  }, [])

  const handleChange = (e) => {
    const {value, name} = e.target;

    setReport({
      ...report,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true)
    setStatusMessage('Submitting Report, Please Wait...')

    axios.post('/api/email/report', report, { headers: { 'Content-Type': 'application/json ' }})
      .then(res => {
        setStatusMessage('✓ Equipment Report Submitted Successfully ✓')
        setReport(initialReport)
        setTimeout(() => {
            setIsLoading(false)
        }, "2000");
    })
    .catch(err => {
        console.log(err)
        setIsLoading(false)
    })
  }

  return (
    <div className='flex flex-col items-center bg-[#242526] h-[1200px] lg:h-screen pt-[85px] pb-2'>
      { isLoading ? (
        <div className='h-screen bg-[#242526] flex flex-col items-center justify-center'>
            <PuffLoader color='#ffffff' loading={isLoading} size={120}/>
            <p className="mt-4">{statusMessage}</p>
        </div>
      ) : (
        <form className='flex flex-col w-[350px] sm:w-full lg:w-3/4 bg-[#494A4C] p-4 text-white rounded-lg shadow-xl' onSubmit={handleSubmit}>
          <label className='font-extrabold text-xl mb-5'>Booth Grading and Excavating Equipment Report</label>
          <div className='rounded-lg w-full sm:w-[600px] mx-auto mb-5 flex flex-col items-center justify-center'>
            <label>Equipment:</label>
            <select required name='equipment' value={report.equipment} className='input w-full' onChange={handleChange}>
              <option>Select Equipment:</option>
              {/* EQUIPMENT MAPPING */}
              { equipment && equipment.map(equipment => {
                return (
                  <option key={`${equipment.number}${equipment.name}`}>{equipment.number} {equipment.name}</option>
                )
              }) }
            </select>
            <label>Foreman Description:</label>
            <textarea required className='input h-[200px] w-full' name='description' value={report.description} onChange={handleChange} />
            <button type='submit' className='buttons mt-3 w-full'>Submit</button>
          </div>
          <label>Report by {auth?.name}</label>
          <label>Date: {Date().split(' ').splice(1, 3).join(' ')}</label>
        </form>
      )}
        <CCSection />
    </div>
  )
}

export default EquipmentStatus