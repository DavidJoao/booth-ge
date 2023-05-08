import axios from '@/custom/axios'
import { useState, useContext, useEffect } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import { PuffLoader } from 'react-spinners'

const CreateDaily = () => {
    
    const { auth, setAuth, loadAll, jobsites } = useContext(AuthContext)
    const [tempArray, setTempArray] = useState([])
    const [images, setImages] = useState([]);
    const [ids, setIds] = useState([])
    const [isLoading, setIsLoading] = useState(false)
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
        employees: [],
        imagesIds: []
    }

    const [ daily, setDaily ] = useState(initialDaily)

    useEffect(() => {
        if ( auth.isForeman === false) router.push('/home')
      })

    useEffect(() => {
        if ( auth.token === undefined) {
            router.push('/login')
        } else {
            loadAll()
            CheckSession(AuthContext, setAuth)
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDaily({
            ...daily,
            [name]: value
        })

    }


    const handleImagesUpload = async () => {
        const idsArray = []
        setIsLoading(true)
        for (const image of images) {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('api_key', process.env.NEXT_PUBLIC_API_KEY)
            formData.append('upload_preset', 'b6spfpjz');
            formData.append('folder', 'booth_grading')
        
            await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}}/image/upload`, formData)
                .then(res => {
                    idsArray.push(res.data.public_id)
                    daily.imagesIds = idsArray
                })
          }
      };
    
      
    const handleSubmit = async (e) => {
        e.preventDefault()

        await handleImagesUpload();

        await axios.post(`/api/daily/post`, JSON.stringify(daily), { headers: { 'Content-Type': 'application/json '} })
        .then( res => {
            loadAll()
            setDaily(initialDaily)
            setTempArray([])
            setImages([])
            setIsLoading(false)
        })
        .catch(err => console.log(err))
        
    }

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages([...images, ...files]);
      };

  return (
    <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center pt-[80px]">
        { isLoading ? 
        <div className='flex flex-col items-center justify-center'>
            <PuffLoader color='#ffffff' loading={isLoading} size={120}/>
            <p className="mt-4">Submitting Daily, Please Wait...</p>
        </div>
        :
        <form id='dropdown' className='w-[300px] w-full lg:w-[70%] min-h-[600px] h-auto rounded flex flex-col lg:flex-row items-center lg:items-start justify-center pb-[150px]'>
            <div className='w-full lg:w-1/2 h-auto p-2 flex flex-col items-center'>
                <label>Date:</label>
                <input required value={daily.date} name='date' type='date' className='input' onChange={handleChange}/>
                <label>General Contractor:</label>
                <input required value={daily.contractor} name='contractor' className='input' onChange={handleChange}/>
                <label>Superintendent:</label>
                <input required value={daily.superintendent} name='superintendent' className='input' onChange={handleChange}/>
                <label>Job Address / Name</label>
                <select name='name' value={daily.name} onChange={handleChange} className='input' id='jobsites'>
                    <option value="" selected disabled hidden>Choose Jobsite</option>
                    { jobsites && jobsites.map(jobsite => {
                        return (
                            <option key={jobsite.address} name="name" value={jobsite.address}>{jobsite.address}</option>
                        )
                    })}
                </select>
                <label>Foreman:</label>
                <input required value={daily.foreman} name='foreman' className='input' onChange={handleChange}/>
                <label>Equipment on jobsite and hours used:</label>
                <textarea required value={daily.equipmentDescription} name='equipmentDescription' className='input' onChange={handleChange}/>
                <label>Description of work performed:</label>
                <textarea required value={daily.workDescription} name='workDescription' className='input h-[150px]' onChange={handleChange}/>
            </div>
            <div className='w-full lg:w-1/2 h-auto p-2 flex flex-col items-center'>
                <label>Number of employees in jobsite:</label>
                <input required value={daily.employeesNo} name='employeesNo' className='input' type='number' min={0} onChange={(e) => {
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
                        <div className='flex items-center w-full p-2' key={employee.name}>
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
                <input className='input mt-3' type="file" onChange={handleFileUpload} multiple />
                { images && images.length > 0 ? 
                    <div className='border mt-3 w-[90%] h-[160px] flex flex-row justify-center flex-wrap overflow-auto rounded'>
                        {images.map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Preview ${index}`} className='w-[200px] m-2' />
                        ))}
                    </div>
                :
                    <></>
                }
            { tempArray.length != 0 ? 
                <button type='submit' className='buttons mt-3 w-[200px]' onClick={handleSubmit}>Send</button>
                :
                <></>
            } 
            </div>
        </form>
         }
    </div>
  )
}

export default CreateDaily