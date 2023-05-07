import axios from '@/custom/axios'
import { useState, useContext, useEffect } from 'react'
import AuthContext from '@/custom/AuthProvider'
import CheckSession from '@/custom/CheckSession'
import { useRouter } from 'next/router'
import { jsPDF } from 'jspdf'
import { PuffLoader } from 'react-spinners'


const CreateDaily = () => {

    const { auth, setAuth, loadAll } = useContext(AuthContext)
    const [tempArray, setTempArray] = useState([])
    const [images, setImages] = useState([]);
    const [imagesModal, setImagesModal] = useState(false)
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

    const generatePDF = (e) => {
        const doc = new jsPDF()
        doc.setFontSize(12)

        doc.text('Booth Grading and Excavating, Inc.', 10, 10)
        doc.text(`Daily Report`, 10, 15)
        doc.text(`Contractor: ${daily.contractor}`, 10, 25)
        doc.text(`Date: ${daily.date}`, 80, 25)
        doc.text(`Directed By: ${daily.superintendent}`, 10, 35)
        doc.text(`Project: ${daily.name}`, 80, 35)
        doc.text(`Foreman: ${daily.foreman}`, 10, 55)
        doc.rect(7, 60, 180, 35)
        doc.text(`Equipment on jobsite and hours used:`, 10, 65)
        doc.text(`${daily.equipmentDescription}`, 10, 70)
        doc.text(`Description for work performed:`, 10, 80)
        doc.text(`${daily.workDescription}`, 10, 85)
        doc.rect(7, 110, 180, 60)
        doc.text(`Number of employees in jobsite: ${daily.employeesNo}`, 10, 115)
        daily.employees.forEach((employee, index) => {
            doc.text(`Name: ${employee.name}`, 10, 125 + (index * 5))
            doc.text(`Hours ${employee.hours}`, 80, 125 + (index * 5))
        })

        let yPos = 250; // starting y-position
        images.forEach((image, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onloadend = () => {
              const imageData = reader.result;
              const img = new Image();
              img.src = imageData;
              img.onload = () => {
                const pageWidth = doc.internal.pageSize.width - 10; // 10 is the margin
                const scaleFactor = pageWidth / img.width;
                const imgWidth = img.width * scaleFactor;
                const imgHeight = img.height * scaleFactor;
                if (yPos + imgHeight + 10 > doc.internal.pageSize.height) {
                  doc.addPage();
                  yPos = 10;
                }
                doc.addImage(imageData, 'JPEG', 5, yPos, imgWidth, imgHeight);
                yPos += imgHeight + 10; // increment the y-position
                if (index === images.length - 1) {
                  doc.save(`${daily.date}${daily.name}.pdf`);
                }
              };
            };
          });
    // DOWNLOAD EVEN IF HAS NO IMAGES
    if (images.length === 0) {
        doc.save(`${daily.date}${daily.name}.pdf`);
        return
    }

    const pdfData = doc.output('datauristring');
    const emailBody = encodeURIComponent(`Please see the attached PDF file. Daily Report ${daily.name} - ${daily.date}`);
    const mailtoLink = `mailto:davidsandoval596@gmail.com?subject=Daily Report&body=${emailBody}&attachment=${encodeURIComponent(pdfData)}`;
    window.open(mailtoLink, '_blank');

    }

    const handleSubmit = (e) => {
        e.preventDefault()

        generatePDF();

        axios.post(`/api/daily/post`, JSON.stringify(daily), { headers: { 'Content-Type': 'application/json '} })
        .then( res => {
            loadAll()
            setDaily(initialDaily)
            setTempArray([])
            setImages([])
        })
        .catch(err => console.log(err))
        
    }

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages([...images, ...files]);
      };

  return (
    <div className="bg-[#242526] min-h-screen h-auto lg:h-screen flex flex-col items-center justify-center pt-[80px]">
        <form id='dropdown' className='w-[300px] w-full lg:w-[70%] min-h-[600px] h-auto rounded flex flex-col lg:flex-row items-center lg:items-start justify-center pb-[150px]'>
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
    </div>
  )
}

export default CreateDaily