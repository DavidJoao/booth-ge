import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { PuffLoader } from 'react-spinners'
import CCSection from '@/components/CCSection'
import axios from '@/custom/axios'
import AuthContext from '@/custom/AuthProvider'
import { useRouter } from 'next/router'
import CheckSession from '@/custom/CheckSession'

const incidents = () => {

  const router = useRouter()

  useEffect(() => {
    if ( auth.token === undefined) {
        // router.push('/login')
    } else {
        CheckSession(AuthContext, setAuth)
    }
}, [])

    const { auth, setAuth, users } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Submitting Report, Please Wait...');

    const initialReport = {
      name: '',
      type: '',
      date: '',
      time: '',
      location: '',
      submittedBy: '',
      supervisor: '',
      witnesses: '',
      description: '',
      injuriesOrLosses: '',
      involved: [],
      enforcementRequied: '',
      enforcementTime: '',
      enforcementName: '',
      reportId: '',
      otherNotes: '',
    }

    const [report, setReport] = useState(initialReport)

    const handleChange = (e) => {
      const { name, value } = e.target;

      setReport({
        ...report,
        [name]: value
      })
    }

    const handleSubmit = (e) => {
      e.preventDefault();

      setIsLoading(true)
      setStatusMessage('Submitting Report, Please Wait...')

      axios.post('/api/email/incident', report, { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
          setStatusMessage('✓ Report Submitted Successfully ✓')
          // setReport(initialReport)
          setTimeout(() => {
            setIsLoading(false)
          }, "2000");
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false)
        })
    }



  return (
    <div className='flex flex-col items-center bg-[#242526] h-[1200px] lg:h-screen pt-[85px] pb-2'>
        incidents
    </div>
  )
}

export default incidents