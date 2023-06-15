import AuthContext from '@/custom/AuthProvider'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'
import JobsiteCard from '@/components/JobsiteCard'
import axios from '@/custom/axios'
import NotificationCard from '@/components/NotificationCard'
import { PuffLoader } from 'react-spinners'
import { Modal } from 'react-bootstrap'

const Home = () => {

    const settingsIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    const notificationIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
    </svg>
  

    const intiialPassword = {
        password: '',
        confirmPassword: '',
    }

    const { auth, setAuth, jobsites, loadAll, notifications } = useContext(AuthContext)
    const router = useRouter()
    const [singleJobsite, setSingleJobsite] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [configurationModal, setConfigurationModal] = useState(false)
    const [password, setPassword] = useState(intiialPassword)

    useEffect(() => {
        async function fetchData () {
            if (auth.isAdmin === true || auth.isModerator === true) {
                axios.get('/api/jobsite/all') 
            } else {
                axios.get(`/api/jobsite/findOne/${auth.email}`)
                .then(res => setSingleJobsite([res.data]))
            }
        }
        fetchData();
    }, [router])
    
    useEffect(() => {
        loadAll()
        CheckSession(AuthContext, setAuth).then(() => setIsLoading(false));
    }, [])

    useEffect(() => {
        if (!isLoading && !auth.token) router.push('/login');
      }, [isLoading, auth.token]);

      if (isLoading) {
        return (
        <div className='h-screen bg-[#242526] flex flex-col items-center justify-center'>
            <PuffLoader color='#ffffff' loading={isLoading} size={120}/>
            <p className="mt-4">Loading, Please Wait...</p>
        </div>
        )
      }

    const handleChange = (e) => {
        const { value, name } = e.target;

        setPassword({ 
            ...password,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPassword = password.password;

        axios.patch(`/api/user/changepassword/${auth._id}`, { password: newPassword }, { headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                console.log(res);
                setConfigurationModal(false)
            })
            .catch(err => console.log(err))
    }
    
  return (
    <div className='flex flex-col items-start bg-[#242526] lg:h-screen h-auto pt-[80px] pb-2'>
        <div className='w-full flex items-center justify-around bg-[rgba(58,59,60,0.4)]'>
            <h1 className='font-bold text-2xl m-2 text-white rounded p-1 flex'>Welcome {auth && auth.name} <button className='ml-5' onClick={() => setConfigurationModal(true)}>{settingsIcon}</button> </h1>
            { auth.isAdmin || auth.isModerator ?  <input className='hidden lg:flex input w-[500px]' placeholder='Employee, Equipment, Address, Accessory' value={search} onChange={(e) => setSearch(e.target.value)}/> : <></> }
        </div>
        <Modal show={configurationModal} onHide={() => setConfigurationModal(false)}>
            <Modal.Header closeButton id='modal'>Change Password</Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body id='modal' className='flex flex-col'>
                    <label>New Password:</label>
                    <input name='password' value={password.password} className='input' type='password' onChange={handleChange}/>
                    <label>Confirm Password:</label>
                    <input name='confirmPassword' value={password.confirmPassword} className='input' type='password' onChange={handleChange}/>
                </Modal.Body>
                <Modal.Footer id='modal'>
                    { password.password === password.confirmPassword 
                    && password.password.length >= 8 
                    && password.confirmPassword.length >= 8 
                    ? <button className='red-buttons w-[250px] mx-auto'>Change Password</button> 
                    :<p className='text-red-500 mx-auto'>Passwords do not match or are shorter than 8 characters</p> }
                </Modal.Footer>
            </form>
        </Modal>
        <div className='home-container'>
            <div className='flex flex-col items-center justify-start lg:w-1/2 h-full pt-2'>
                <h1 className='text-[20px] lg:text-[25px] p-1 border-[1px] border-black w-full h-[15%] lg:h-[7%] flex items-center justify-center rounded-lg bg-[#494A4C]'>
                    Administration Notifications 
                    <span className='ml-3 bg-yellow-600 rounded p-[2px] flex items-center font-normal text-sm'>{notificationIcon} • {notifications.length}</span>
                </h1>
                <div className='notifications-container bg-[#3a3b3c] w-full h-[400px] lg:h-[700px] pt-3' >
                    { notifications && notifications.reverse().map(notification => {
                        return ( <NotificationCard key={notification._id} notification={notification} auth={auth} loadAll={loadAll} /> )
                    }) }
                    { notifications && notifications.length === 0 ? <p>No notifications</p> : <></>}
                    {/* <div>
                    <iframe src="https://drive.google.com/file/d/1NTmdPyqQBdclSMqZqusc2BPuEllUZVxs/preview" width="640" height="480"></iframe>
                    </div> */}
                </div>
            </div>
            { auth.isAdmin === true || auth.isModerator === true ? <input className='flex lg:hidden input w-[300px]' placeholder='Employee, Equipment, Address, Accessory' value={search} onChange={(e) => setSearch(e.target.value)}/> : <></> }
            <div className='jobsite-container scroll h-full min-h-[300px]'>
                { auth.isAdmin || auth.isModerator ? 
                jobsites
                .filter(jobsite => search === '' 
                    || jobsite.equipment.some(items => (`${items.number} ${items.name}`).toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                    || jobsite.employees.some((employee) => (`${employee.name}`).toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                    || jobsite.accessories.some(accessory => (`${accessory.name}`).toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                    || jobsite.address.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                    || jobsite.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                    || jobsite.status.toLocaleLowerCase() === search.toLocaleLowerCase())
                .sort(function (a, b) {
                    if (a.status === 'active' && b.status === 'inactive') return -1;
                    if (a.status === 'inactive' && b.status === 'active') return 1;
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
					return 0
					})
                .map(jobsite => {
                        return( <JobsiteCard key={jobsite._id} jobsite={jobsite} auth={auth}/> )})
                :
                jobsites.filter(jobsite => jobsite.employees.some(employee => employee._id === auth._id)).map(jobsite => {
                    return (
                        <JobsiteCard key={jobsite._id} jobsite={jobsite} auth={auth}/>
                    )
                })
                }
                { jobsites.filter(jobsite => jobsite.employees.some(employee => employee._id === auth._id)).length === 0 && auth.isAdmin === false && auth.isModerator === false ? 
                    <p>No Jobsite Assigned</p> : <></> 
                }
            </div>
        </div>
    </div>
  )
}

export default Home