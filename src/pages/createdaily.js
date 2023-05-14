import axios from '@/custom/axios'
import { useState, useContext, useEffect } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import { PuffLoader } from 'react-spinners'
import imageCompression from 'browser-image-compression';
import generatePDF from '@/custom/generatePDF'

const CreateDaily = () => {
    
    const { auth, setAuth, loadAll, jobsites, users, equipment } = useContext(AuthContext)
    const [tempArray, setTempArray] = useState([])
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const [checkBoxStatus, setCheckBoxStatus] = useState(false)
    const router = useRouter()

    const initialDaily = {
        date: '',
        dateCreated: Date().split(' ').splice(0, 5).join(' '),
        pickedUpDiesel: checkBoxStatus === true ? 'Yes' : 'No',
        totalHours: '',
        contractor: '',
        superintendent: '',
        name: '',
        foreman: '',
        equipmentDescription: '',
        workDescription: '',
        extraWorkDescription: '',
        notes: '',
        employeesNo: '',
        rentedNo: '',
        employees: [],
        rentedEmployees: [],
    }

    const [ daily, setDaily ] = useState(initialDaily)

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
        console.log(daily)
    }
     
    const handleSubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true)
        setStatusMessage('Submitting Daily, Please Wait...')

        await axios.post('/api/email/send', { daily, images})

        await axios.post(`/api/daily/post`, JSON.stringify(daily), { headers: { 'Content-Type': 'application/json '} })
        .then( res => {
            loadAll()
            setDaily(initialDaily)
            setTempArray([])
            setImages([])
            setStatusMessage('✓ Daily Submitted Successfully ✓')
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
            
        })
        .catch(err => console.log(err))
        
    }

    const handleFileUpload = async (event) => {
      const files = Array.from(event.target.files);
    
      const compressPromises = files.map((file) => {
        return new Promise(async (resolve, reject) => {
          try {
            const compressedFile = await imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 800, 
            });
    
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(compressedFile);
          } catch (error) {
            reject(error);
          }
        });
      });
    
      Promise.all(compressPromises)
        .then((base64Images) => {
          setImages([...images, ...base64Images]);
        })
        .catch((error) => {
          console.error('Error reading file:', error);
        });
    };
    

  return (
    <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center pt-[80px]">
        { isLoading ? 
        <div className='flex flex-col items-center justify-center'>
            <PuffLoader color='#ffffff' loading={isLoading} size={120}/>
            <p className="mt-4">{statusMessage}</p>
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
                <div className='flex flex-col lg:flex-row items-center justify-around mt-2 w-full lg:w-[80%]'>
                    <label>Total Hours:</label>
                    <input className='input lg:w-[100px]' type='number' name='totalHours' value={daily.totalHours} onChange={handleChange}/>
                    <label>Picked Up Diesel?</label>
                    <input type='checkbox' onChange={(e) => {
                        setCheckBoxStatus(e.target.checked)
                        if (checkBoxStatus === true) {
                            setDaily({
                                ...daily,
                                ['totalHours']: (parseFloat(daily.totalHours) - 0.5).toString()
                            })
                        } else {
                            setDaily({
                                ...daily,
                                ['totalHours']: (parseFloat(daily.totalHours) + 0.5).toString()
                            })
                        }
                    }}/>
                </div>
                <input className='input bg-slate-400' disabled value={checkBoxStatus === true ? parseFloat(daily.totalHours) : parseFloat(daily.totalHours) || 0} /> 
                <label>Equipment on jobsite and hours used:</label>
                {/* <select className='input' onChange={(e) => console.log(e.target.value)}>
                    { equipment && equipment.map(item => {
                        return (
                            <option>{item.number} {item.name}</option>
                        )
                    }) }
                </select> */}
                <textarea required value={daily.equipmentDescription} name='equipmentDescription' className='input' onChange={handleChange}/>
                <label>Description of contract work performed:</label>
                <textarea required value={daily.workDescription} name='workDescription' className='input h-[150px]' onChange={handleChange}/>
                <label>Description of extra work performed:</label>
                <textarea required value={daily.extraWorkDescription} name='extraWorkDescription' className='input h-[150px]' onChange={handleChange}/>
                <label>Notes:</label>
                <textarea required value={daily.notes} name='notes' className='input h-[150px]' onChange={handleChange}/>
            </div>
            <div className='w-full lg:w-1/2 h-auto p-2 flex flex-col items-center'>
                {/* EMPLOYEE INPUT */}
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
                            <select className='input' onChange={(e) => {
                                const newEmployees = [...daily.employees];
                                newEmployees[index] = { ...newEmployees[index], name: e.target.value };
                                setDaily({ ...daily, employees: newEmployees });
                            }}>
                                <option>Choose Employee</option>
                                { users && users.filter((user) => user.name !== 'Byanka Arceo' && user.name !== 'Alfredo Sandoval' && user.name !== 'Roger Booth' && user.name !== 'Veronica Rivera').map(user => {
                                    return (
                                        <option key={user._id}>{user.name}</option>
                                    )
                                })}
                            </select>
                            <label className='ml-2'>Hours:</label>
                            <input required className='input' name={`employee-${index}-hours`} onChange={(e) => {
                                const newEmployees = [...daily.employees];
                                newEmployees[index] = { ...newEmployees[index], hours: e.target.value };
                                setDaily({ ...daily, employees: newEmployees });
                            }}/>
                        </div>
                    )
                } )}

                {/* TEMPORAL EMPLOYEE INPUT */}
                {/* <label>Number of rented employees:</label>
                <input required value={daily.rentedNo} name='rentedNo' className='input' type='number' min={0} onChange={(e) => {
                    setDaily({ 
                        ...daily,
                        ['rentedNo']: e.target.value
                     })
                    
                     const newArray = [];
                     for (let i = 0; i < parseInt(e.target.value); i++) {
                       newArray.push(i);
                     }

                     setTempRentedArray(newArray);
                }}/>
                { tempRentedArray.map((employee, index) => {
                    return (
                        <div className='flex items-center w-full p-2' key={employee.name}>
                            <label>Name:</label>
                            <input className='input' onChange={(e) => {
                                const newEmployees = [...daily.rentedEmployees];
                                newEmployees[index] = { ...newEmployees[index], name: e.target.value };
                                setDaily({ ...daily, rentedEmployees: newEmployees });
                            }} />
                            <label className='ml-2'>Hours:</label>
                            <input required className='input' name={`rentedEmployee-${index}-hours`} onChange={(e) => {
                                const newEmployees = [...daily.rentedEmployees];
                                newEmployees[index] = { ...newEmployees[index], hours: e.target.value };
                                setDaily({ ...daily, rentedEmployees: newEmployees });
                            }}/>
                        </div>
                    )
                } )} */}

                <input className='input mt-3' type="file" onChange={handleFileUpload} multiple />
                { images && images.length > 0 ? 
                    <div className='border mt-3 w-[90%] h-[160px] flex flex-row justify-center flex-wrap overflow-auto rounded'>
                        {images.map((image, index) => (
                            <img key={index} src={image} alt={`Preview ${index}`} className='w-[200px] m-2' />
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