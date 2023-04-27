import axios from '@/custom/axios'
import { useState, useContext, useEffect } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'

const createdaily = () => {

    const { auth, setAuth, loadAll } = useContext(AuthContext)
    const [tempArray, setTempArray] = useState([])
    const router = useRouter()

    const initialDaily = {
        date: '',
        contractor: '',
        superintendent: '',
        name: '',
        foreman: '',
        equipmentDescription: '',
        workDescription: '',
        employeesNo: '',
        employees: []
    }

    const [ daily, setDaily ] = useState(initialDaily)

    useEffect(() => {
        if ( auth.isForeman === false) router.push('/home')
      })

    useEffect(() => {
        loadAll()
        CheckSession(AuthContext, setAuth)
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDaily({
            ...daily,
            [name]: value
        })

    }

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post(`/api/daily/post`, JSON.stringify(daily), { headers: { 'Content-Type': 'application/json '} })
        .then( res => {
            loadAll()
            setDaily(initialDaily)
            setTempArray([])
        })
        .catch(err => console.log(err))
        
    }

  return (
    <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center">
        <form id='dropdown' className='w-[300px] w-full lg:w-[70%] min-h-[600px] h-auto rounded flex flex-col lg:flex-row items-center lg:items-start justify-center'>
            <div className='w-full lg:w-1/2 h-auto p-2 flex flex-col items-center'>
                <label>Date:</label>
                <input required value={daily.date} name='date' type='date' className='input' onChange={handleChange}/>
                <label>General Contractor:</label>
                <input required value={daily.contractor} name='contractor' className='input' onChange={handleChange}/>
                <label>Superintendent:</label>
                <input required value={daily.superintendent} name='superintendent' className='input' onChange={handleChange}/>
                <label>Job Address / Name</label>
                <input required value={daily.name} name='name' className='input' onChange={handleChange}/>
                <label>Foreman:</label>
                <input required value={daily.foreman} name='foreman' className='input' onChange={handleChange}/>
                <label>Equipment on jobsite and hours used:</label>
                <textarea required value={daily.equipmentDescription} name='equipmentDescription' className='input' onChange={handleChange}/>
                <label>Description of work performed:</label>
                <textarea required value={daily.workDescription} name='workDescription' className='input h-[150px]' onChange={handleChange}/>
            </div>
            <div className='w-full lg:w-1/2 h-auto p-2 flex flex-col items-center'>
                <label>Number of employees in jobsite:</label>
                <input required value={daily.employeesNo} name='employeesNo' className='input' type='number' onChange={(e) => {
                    setDaily({ 
                        ...daily,
                        ['employeesNo']: e.target.value
                     })
                    
                     const newArray = [];
                     for (let i = 0; i < parseInt(e.target.value); i++) {
                       newArray.push(i);
                     }

                     setTempArray(newArray);
                }}/>
                { tempArray.map((employee, index) => {
                    return (
                        <div className='flex items-center w-full p-2'>
                            <label>Name:</label>
                            <input required className='input' name={`employee-${index}-name`} onChange={(e) => {
                                const newEmployees = [...daily.employees];
                                newEmployees[index] = { ...newEmployees[index], name: e.target.value };
                                setDaily({ ...daily, employees: newEmployees });
                            }}/> 
                            <label className='ml-2'>Hours:</label>
                            <input required className='input' name={`employee-${index}-hours`} onChange={(e) => {
                                const newEmployees = [...daily.employees];
                                newEmployees[index] = { ...newEmployees[index], hours: e.target.value };
                                setDaily({ ...daily, employees: newEmployees });
                            }}/>
                        </div>
                    )
                } )}
            { tempArray.length != 0 ? 
                <button type='submit' className='buttons mt-3' onClick={handleSubmit}>Send</button>
                :
                <></>
            } 
            </div>
        </form>
    </div>
  )
}

export default createdaily