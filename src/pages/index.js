import Link from 'next/link'
import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import AuthContext from '@/custom/AuthProvider'


export default function Home() {

  const router = useRouter()
  const tokenCookie = Cookies.get('token')
  const { auth } = useContext(AuthContext)

  useEffect(() => {
    if (tokenCookie) router.push('/home')
    if (auth.token) router.push('/home')
  })

  return (
    <div className='bg-white'>
      <div className='h-screen relative'> 
        <div className='w-full h-[60vh] flex justify-center absolute z-10'>
          <img src='https://i.ibb.co/pXXMrvC/IMG-0927.jpg' />
        </div>
        <div className='w-full h-[60vh] flex flex-col items-center justify-center relative z-20 bg-[rgba(58,59,60,0.8)] p-3'>
            <h1 className='w-[360px] md:w-[700px] font-extrabold text-5xl'>Welcome to Booth Grading and Excavating</h1>
            <p className='w-[360px] md:w-[700px]'>Welcome to Booth Grading and Excavating, your go-to construction company for all your grading and excavation needs in the area. We have a team of highly experienced professionals ready to take on any project, big or small.</p>
            <div className='w-[300px] flex justify-evenly items-center p-1 mt-2 w-full'>
                <Link href={'/login'} className='nav-buttons m-2 max-w-[250px]'>Log In</Link>
                <Link href={'/register'} className='nav-buttons m-2 max-w-[250px]'>Register</Link>
            </div>
        </div>
        <div className='w-full h-auto sm:h-[40vh] flex flex-col justify-center sm:justify-start items-center p-4 text-white bg-[#242526] bg-center' >
            <h1 className='text-5xl font-extrabold p-4'>Contact Us</h1>
            <p>Want to learn more about our services or have a question about your project? Contact us using the information below:</p>
            <p>Contact Field Administrator (Alfredo): 661-547-3730</p>
            <p>Email: booth@gmail.com</p>
            <p>2149 W Carson Mesa Road</p>
            <p>Acton, CA 93510</p>
        </div>
      </div>
    </div>
  )
}
