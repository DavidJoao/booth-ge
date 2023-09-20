import { useContext, useState } from 'react'
import CCSection from '@/components/CCSection'
import AuthContext from '@/custom/AuthProvider'

const EquipmentStatus = () => {

  const { auth, equipment } = useContext(AuthContext)

  const initialReport = {
    author: auth?.name,
    equipment: '',
    description: '',
    date: Date().split(' ').splice(1, 3).join(' ')
  }

  const [report, setReport] = useState(initialReport)


  const handleChange = (e) => {
    const {value, name} = e.target;

    setReport({
      ...report,
      [name]: value
    })
  }

  return (
    <div className='flex flex-col items-center bg-[#242526] h-[1200px] lg:h-screen pt-[85px] pb-2'>
      <form className='flex flex-col w-[350px] sm:w-full lg:w-3/4 bg-[#494A4C] p-4 text-white rounded-lg shadow-xl'>
        <label className='font-extrabold text-xl mb-5'>Booth Grading and Excavating Equipment Report</label>
        <div className='rounded-lg w-full sm:w-[600px] mx-auto mb-5 flex flex-col items-center justify-center'>
          <label>Equipment:</label>
          <select name='equipment' className='input w-full' onChange={handleChange}>
            <option>Select Equipment:</option>
            {/* EQUIPMENT MAPPING */}
            { equipment && equipment.map(equipment => {
              return (
                <option key={`${equipment.number}${equipment.name}`}>{equipment.number} {equipment.name}</option>
              )
            }) }
          </select>
          <label>Foreman Description:</label>
          <textarea className='input h-[200px] w-full' name='description' onChange={handleChange}>

          </textarea>
          <button className='buttons mt-3 w-full'>Submit</button>
        </div>
        <label>Report by {auth?.name}</label>
        <label>Date: {Date().split(' ').splice(1, 3).join(' ')}</label>
      </form>
        <CCSection />
    </div>
  )
}

export default EquipmentStatus