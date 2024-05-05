import axios from '@/custom/axios'
import { useState, useContext, useEffect } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import { PuffLoader } from 'react-spinners'
import imageCompression from 'browser-image-compression';
import CCSection from '@/components/CCSection'

const CreateDaily = () => {
    
    const { auth, setAuth, loadAll, jobsites, users, equipment } = useContext(AuthContext)
    const allEquipment = equipment;
    const [tempArray, setTempArray] = useState([])
    const [tempRentedArray, setTempRentedArray] = useState([])
    const [tempEquipment, setTempEquipment] = useState([])
    const [tempImported, setTempImported] = useState([])
    const [tempExported, setTempExported] = useState([])
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const [imported, setImported] = useState(false)
    const [exported, setExported] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [importedArray, setImportedArray] = useState([])
    const [exportedArray, setExportedArray] = useState([])
    const [jobsitesContractors, setJobsitesContractors] = useState([])
    const [attemptCount, setAttemptCount] = useState("")
    
    let importedSet = [...new Set(importedArray)]
    let exportedSet = [...new Set(exportedArray)]
    const contractorSet = [...new Set(jobsitesContractors)]
    
    const router = useRouter()

    const initialDaily = {
        date: '',
        dateCreated: Date().split(' ').splice(0, 5).join(' '),
        foreman: '',
        totalHours: '',
        pickedUpDiesel: false,
        pickedUpMaterial: false,
        contractor: '',
        superintendent: '',
        name: '',
        workDescription: '',
        extraWorkDescription: '',
        notes: '',
        employeesNo: '',
        rentedNo: '',
        equipmentNo: '',
        employees: [],
        rentedEmployees: [],
        equipment: [],
        imported: [],
        exported: [],
        startTime: '',
        submittedBy: auth && auth.name
    }

    const [ daily, setDaily ] = useState(initialDaily)

    useEffect(() => {
        if ( auth.token === undefined) {
            router.push('/login')
        } else {
            loadAll()
            CheckSession(AuthContext, setAuth)
        }
        jobsites.forEach(jobsite => jobsitesContractors.push(jobsite.contractor));
    }, [])


    // CHANGE HANDLER /////////////////////////////////////////////////////
    const handleChange = (e) => {
        const { name, value } = e.target;

        setDaily({
            ...daily,
            [name]: value
        })

        if (name === 'name') {
            const foundJobsite = jobsites && jobsites.find((jobsite) => jobsite.address == value)
            setDaily({
                ...daily,
                ['startTime']: foundJobsite.startTime,
                ['name']: value
            })
        }

        console.log(daily)
    }
     

    // DAILY SUBMISSION HANDLER ///////////////////////////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault()

        setIsLoading(true)
        setStatusMessage('Submitting Daily, Please Wait...')

        await axios.post('/api/email/daily', { daily, images})
        .then(res => {
            setAttemptCount(res.data)
        })
        .catch(err => {
            console.log(err)
        })

        await axios.post(`/api/daily/post`, JSON.stringify(daily), { headers: { 'Content-Type': 'application/json '}, timeout: 150000 })
        .then( res => {
            loadAll()
            setDaily(initialDaily)
            setTempArray([])
            setImages([])
            setStatusMessage(`✓ Daily Submitted Successfully ✓ | ${attemptCount}`)
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
            
        })
        .catch(err => {
            if (err.code === 'ECONNABORTED' && err.message.includes('timeout')) {
                console.log('Request timed out');
                setErrorMessage('Poor Connection, Please Try Again With Better Connection');
                setIsLoading(false);
            } else {
                console.log('An error occurred', err);
                setIsLoading(false)
              }
        })
        
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
        ///////////////// MAIN FORM ///////////////////
        <form id='dropdown' className='w-[300px] w-full lg:w-[70%] min-h-[600px] h-auto rounded flex flex-col lg:flex-row items-center lg:items-start justify-center pb-[150px]' onSubmit={handleSubmit}>
            <div className='w-full lg:w-1/2 h-auto p-2 flex flex-col items-center'>
                <label for="date">Date:</label>
                <input id='date' required value={daily.date} name='date' type='date' className='input' onChange={handleChange}/>
                <label for="contractor">General Contractor:</label>
                <select id='contractor' className='input' name='contractor' onChange={handleChange}>
                    <option>Choose Contractor</option>
                    { contractorSet?.map(contractor => {
                        return(
                            <option key={contractor}>{contractor}</option>
                        )
                    }) }
                </select>
                <label for="superintendent">Superintendent:</label>
                <input id='superintendent' value={daily.superintendent} name='superintendent' className='input' onChange={handleChange}/>
                <label for="jobsites">Job Address</label>
                <select required name='name' value={daily.name} onChange={handleChange} className='input' id='jobsites'>
                    <option value="" selected disabled hidden>Choose Jobsite</option>
                    { jobsites && jobsites.map((jobsite, index) => {
                        return (
                            <option key={`${jobsite.address}${index}`} name="name" value={`${jobsite.address}`}>{jobsite.address}</option>
                        )
                    })}
                </select>
                <label>Foreman:</label>
                <select className='input' name='foreman' onChange={handleChange}>
                    <option>Choose Foreman</option>
                    <option>No Foreman</option>
                    { users?.filter(user => user.isForeman === true && user.name !== 'Byanka Arceo' && user.name !== 'Veronica Rivera').map(user => {
                        return (
                            <option key={user.name}>{user.name}</option>
                        )
                    }) }
                </select>
                <div className='flex items-center justify-center flex-col lg:grid lg:grid-cols-6 mt-2 w-full lg:w-[80%]'>
                    <label>Total Hours:</label>
                    <input pattern="[0-9.]*" title="Only numbers and dots are allowed" className='input' type='number' name='totalHours' value={daily.totalHours} onChange={handleChange}/>
                    <label>Picked Up Diesel?</label>
                    <input type='checkbox' name='pickedUpDiesel' className='mb-2' onChange={(e) => {
                        const { name, value, type, checked } = e.target;
                        if (type === 'checkbox') {
                        setDaily((prevDaily) => ({
                            ...prevDaily,
                            [name]: checked,
                        }));
                        } else {
                        setDaily((prevDaily) => ({
                            ...prevDaily,
                            [name]: value,
                        }));
                        };
                    }}/>
                    <label>Picked Up Material?</label>
                    <input type='checkbox' name='pickedUpMaterial' onChange={(e) => {
                        const { name, value, type, checked } = e.target;
                        if (type === 'checkbox') {
                        setDaily((prevDaily) => ({
                            ...prevDaily,
                            [name]: checked,
                        }));
                        } else {
                        setDaily((prevDaily) => ({
                            ...prevDaily,
                            [name]: value,
                        }));
                        };
                    }}/>
                </div>
                <input className='input bg-slate-400' disabled value={
                    daily.pickedUpDiesel === true && daily.pickedUpMaterial ? parseFloat(daily.totalHours) + 1 : 
                    daily.pickedUpDiesel === true || daily.pickedUpMaterial === true ? parseFloat(daily.totalHours) + 0.5 : 
                    parseFloat(daily.totalHours) || 0} /> 

                {/* EQUIPMENT DROPDOWN */}
                <label>Number of equipment in jobsite:</label>
                <input value={daily.equipmentNo} name='equipmentNo' className='input' type='number' min={0} onChange={(e) => {
                    setDaily({ 
                        ...daily,
                        ['equipmentNo']: e.target.value
                     })
                    
                     const newArray = [];
                     for (let i = 0; i < parseInt(e.target.value); i++) {
                       newArray.push(i);
                     }

                     setTempEquipment(newArray);
                }}/>
                { tempEquipment.map((equipment, index) => {
                    return (
                        <div className='flex items-center w-full p-2' key={equipment._id}>
                            <select className='input' name={`equipment-${index}-name`} onChange={(e) => {
                                const newEquipment = [...daily.equipment];
                                newEquipment[index] = { ...newEquipment[index], name: e.target.value };
                                setDaily({ ...daily, equipment: newEquipment });
                            }}>
                                <option>Choose </option>
                                { allEquipment && allEquipment.map(equipment => {
                                    return (
                                        <option key={equipment._id}>{equipment.number} {equipment.name}</option>
                                    )
                                })}
                            </select>
                            <label className='ml-2'>Hours:</label>
                            <input required className='input' name={`equipment-${index}-hours`} onChange={(e) => {
                                const newEquipment = [...daily.equipment];
                                newEquipment[index] = { ...newEquipment[index], hours: e.target.value };
                                setDaily({ ...daily, equipment: newEquipment });
                            }}/>
                        </div>
                    )
                } )}
                <label>Description of contract work performed:</label>
                <textarea required value={daily.workDescription} name='workDescription' className='input h-[150px]' onChange={handleChange}/>
                <label>Description of Extra (T&M): </label>
                <textarea value={daily.extraWorkDescription} name='extraWorkDescription' className='input h-[150px]' onChange={handleChange}/>
                <label>Notes:</label>
                <textarea value={daily.notes} name='notes' className='input h-[150px]' onChange={handleChange}/>
            </div>

            {/* ************* IMPORTED/EXPORTED AREA *************/}

            <div className='w-full lg:w-1/2 h-auto p-2 flex flex-col items-center'>
                <div className='p-2 flex flex-row items-center justify-evenly w-[70%]'>
                    <label>Imported?</label>
                    <input type='checkbox' onChange={(e) => {
                        setImported(e.target.checked)
                        if (e.target.checked === false) {
                            setImportedArray([])
                            setTempImported([])
                        }
                        }}/>
                    <label>Exported?</label>
                    <input type='checkbox' onChange={(e) => {
                        setExported(e.target.checked)
                        if (e.target.checked === false) {
                            setExportedArray([])
                            setTempExported([])
                        }
                        }}></input>
                </div>
                <div className='p-2 w-[70%]'>

                    {imported ? (
                        <>  
                            <p className='font-bold text-center'>Import</p>
                            <select className='input w-full' onChange={(e) => {
                                tempImported.push(e.target.value);
                                setImportedArray([...tempImported, ...importedArray])
                            }}>
                                <option>Choose Materials</option>
                                <option>Dirt</option>
                                <option>Sand</option>
                                <option>Gravel</option>
                                <option>Base</option>
                            </select>
                        </>
                    ) : (<></>)}
                    {importedSet.filter((material) => material != 'Choose Materials').map((material, index) => {
                        return (
                            <div key={material} className='grid grid-cols-3 gap-2 flex items-center justify-center'>
                                <p className='my-auto'>{material}</p>
                                <input placeholder='#' className='input w-full' type='number' min={0} name={`importedMaterial-${index}-loads`} onChange={(e) => {
                                const newLoads = [...daily.imported];
                                newLoads[index] = { ...newLoads[index], loads: e.target.value, material: material };
                                setDaily({ ...daily, imported: newLoads });
                            }}/>
                                <button className='bg-red-700 rounded p-1 mt-2' onClick={(e) => {
                                    e.preventDefault();
                                    const updatedMaterials = importedSet.filter((_, i) => i !== index);
                                    setImportedArray(updatedMaterials)
                                    setTempImported(updatedMaterials)
                                    const newLoads = daily.imported.filter((_, i) => i !== index);
                                    setDaily({ ...daily, imported: newLoads });
                                }}>Remove</button>
                            </div>
                        )
                    })}

                    {exported ? (
                        <>
                            <p className='font-bold text-center mt-3'>Export</p>
                            <select className='input w-full' onChange={(e) => {
                                tempExported.push(e.target.value);
                                setExportedArray([...tempExported, ...exportedArray])
                            }}>
                                <option>Choose Materials</option>
                                <option>Dirt</option>
                                <option>Rock</option>
                                <option>Concrete</option>
                                <option>Green</option>
                                <option>Demo/Trash</option>
                                <option>Steel</option>
                            </select>
                        </>
                    ) : (<></>)}
                    {exportedSet.filter(material => material != 'Choose Materials').map((material, index) => {
                        return (
                            <div key={material} className='grid grid-cols-3 gap-2 flex items-center justify-center'>
                                <p className='my-auto'>{material}</p>
                                <input placeholder='#' className='input w-full' type='number' min={0} name={`exportedMaterial-${index}-loads`} onChange={(e) => {
                                const newLoads = [...daily.exported];
                                newLoads[index] = { ...newLoads[index], loads: e.target.value, material: material };
                                setDaily({ ...daily, exported: newLoads });
                            }}/>
                                <button className='bg-red-700 rounded p-1 mt-2' onClick={(e) => {
                                    e.preventDefault();
                                    const updatedMaterials = exportedSet.filter((_, i) => i !== index);
                                    setExportedArray(updatedMaterials)
                                    setTempExported(updatedMaterials)
                                    const newLoads = daily.exported.filter((_, i) => i !== index);
                                    setDaily({ ...daily, exported: newLoads });
                                }}>Remove</button>
                            </div>
                        )
                    })}

                </div>

                {/* EMPLOYEE INPUT */}

                <label>Number of employees in jobsite:</label>
                <input value={daily.employeesNo} name='employeesNo' className='input' type='number' min={0} max={15} onChange={(e) => {
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
                        <div className='flex items-center w-full p-2' key={`${employee.name}${index}`}>
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
                            <input pattern="[0-9.]*" title="Only numbers and dots are allowed"  className='input' name={`employee-${index}-hours`} onChange={(e) => {
                                const newEmployees = [...daily.employees];
                                newEmployees[index] = { ...newEmployees[index], hours: e.target.value };
                                setDaily({ ...daily, employees: newEmployees });
                            }}/>
                        </div>
                    )
                } )}

                {/* TEMPORAL EMPLOYEE INPUT */}

                <label>Number of rented employees:</label>
                <input value={daily.rentedNo} name='rentedNo' className='input' type='number' min={0} max={15} onChange={(e) => {
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
                            <label className='ml-2'>Hrs:</label>
                            <input className='input' name={`rentedEmployee-${index}-hours`} onChange={(e) => {
                                const newEmployees = [...daily.rentedEmployees];
                                newEmployees[index] = { ...newEmployees[index], hours: e.target.value };
                                setDaily({ ...daily, rentedEmployees: newEmployees });
                            }}/>
                        </div>
                    )
                } )}

                <input className='input mt-3' type="file" onChange={handleFileUpload} multiple />
                { images && images.length > 0 ? 
                    <div className='w-[80%] rounded mt-2 flex flex-row items-center overflow-x-auto border p-2"'>
                        {images.map((image, index) => (
                            <>
                                <img key={index} src={image} alt={`Preview ${index}`} className='w-[150px] m-2' />
                                <button className="mr-3 bg-red-600 rounded p-1" onClick={(e) => {
                                    e.preventDefault();
                                    const updatedImages = images.filter((_, i) => i !== index);
                                    setImages(updatedImages);
                                }}>x</button>
                            </>
                        ))}
                    </div>
                :
                    <></>
                }
                { images.length > 0 ? (
                    <button type='submit' className='buttons mt-3 w-[200px]'>Send</button>
                ) : ( <p className='mt-5 text-red-600 bg-slate-200 rounded p-1'>Cannot send daily report without photos.</p> )}
                <p className='text-red-600'>{errorMessage}</p>
            </div>
        </form>
         }
    <CCSection />
    </div>
  )
}

export default CreateDaily
