import AuthContext from "@/custom/AuthProvider"
import { useContext, useEffect } from "react"
import CheckSession from "@/custom/CheckSession"
import { useRouter } from "next/router"

const createtimesheet = () => {

    const { auth, setAuth, loadAll } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        loadAll()
      if (!auth.token) router.push('/login')
      CheckSession(AuthContext, setAuth)
    }, [])

  return (
    <div className="bg-[#242526] h-screen">
        <form className="w-full h-full grid place-content-center grid-cols-3 gap-4 border p-5">
            <div className="daily-container border"></div>
            <div className="daily-container"></div>
            <div className="daily-container"></div>
            <div className="daily-container"></div>
            <div className="daily-container"></div>
            <div className="daily-container"></div>
        </form>
    </div>
  )
}

export default createtimesheet