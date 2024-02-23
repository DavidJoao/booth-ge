import React from "react"
import { useContext, useState, useEffect } from "react"
import { PuffLoader } from "react-spinners"
import CCSection from "@/components/CCSection"
import axios from "@/custom/axios"
import AuthContext from "@/custom/AuthProvider"
import { useRouter } from "next/router"
import CheckSession from "@/custom/CheckSession"

const incidents = () => {
	const router = useRouter()

	useEffect(() => {
		if (auth.token === undefined) {
			// router.push('/login')
		} else {
			CheckSession(AuthContext, setAuth)
		}
	}, [])

	const { auth, setAuth, users } = useContext(AuthContext)
	const [isLoading, setIsLoading] = useState(false)
	const [statusMessage, setStatusMessage] = useState("Submitting Report, Please Wait...")

	const initialReport = {
		name: "",
		type: "",
		date: "",
		time: "",
		location: "",
		submittedBy: "",
		supervisor: "",
		role: "",
		employeeType: "",
		witnesses: "",
		description: "",
		injuriesOrLosses: "",
		hospitalRequired: "",
		physicianRequired: "",
		facilityName: "",
		involved: [],
		enforcementRequired: "",
		enforcementTime: "",
		enforcementName: "",
		reportId: "",
		otherNotes: "",
	}

	const [report, setReport] = useState(initialReport)

	const handleChange = e => {
		const { name, value } = e.target

		setReport({
			...report,
			[name]: value,
		})
	}

	const handleSubmit = e => {
		e.preventDefault()

		setIsLoading(true)
		setStatusMessage("Submitting Report, Please Wait...")

		axios
			.post("/api/email/incident", report, { headers: { "Content-Type": "application/json" }})
			.then(res => {
				setStatusMessage("✓ Report Submitted Successfully ✓")
				// setReport(initialReport)
				setTimeout(() => {
					setIsLoading(false)
				}, "2000")
			})
			.catch(err => {
				console.log(err)
				setIsLoading(false)
			})
	}

	return (
		<div className="flex flex-col items-center bg-[#242526] h-[1200px] min-h-screen h-auto pt-[85px] pb-5">
			{isLoading ? (
				<div className="h-screen bg-[#242526] flex flex-col items-center justify-center">
					<PuffLoader color="#ffffff" loading={isLoading} size={120} />
					<p className="mt-4">{statusMessage}</p>
				</div>
			) : (
				<div>
					<p className="text-xl font-bold">Incident Report Form</p>
					<form className="w-screen border xl:w-[1200px] flex items-center justify-center flex-col gap-2 lg:grid lg:grid-cols-4 p-2" onSubmit={handleSubmit}>

						<label>Type of Incident:</label>
						<select value={report.type} name="type" required className="input">
							<option>Select Type</option>
							<option>Injury</option>
							<option>Property Damage</option>
							<option>Illness</option>
							<option>Accident</option>
							<option>Theft</option>
						</select>

						<label>Date of Incident:</label>
						<input value={report.date} name="date" type="date" className="input"/>

						<label>Time of Incident:</label> 
						<input value={report.time} name="time" type="time" className="input"/>

						<label>Location of Incident:</label>
						<input value={report.location} name="location" placeholder="" className="input"/>

						<label>Involved Individual</label>
						<input value={report.name} name="name" className="input"/>

						<label>Employee or Visitor?</label>
						<select value={report.employeeType} name="employeeType" required className="input">
							<option>Select Answer</option>
							<option>Employee</option>
							<option>Rental</option>
						</select>

						<label>Role:</label>
						<input value={report.role} name="role" placeholder="Ex: Foreman, Laborer" className="input"/>

						<label>Supervisor:</label>
						<input value={report.supervisor} name="supervisor" className="input"/>

						{/* USE TYPE -> BUTTON -> PUSH TO ARRAY  */}
						{/* MORE INVOLVED PEOPLE */}
						{/* WITNESSES */}

						<label>Description of Incident:</label>
						<textarea value={report.description} name="description" className="input h-[150px] resize-none"/>

						<label>Injuries/Losses:</label>
						<textarea value={report.injuriesOrLosses} name="injuriesOrLosses" className="input h-[150px] resize-none"/>

						<label>Hospitalization Required? </label>
						<select value={report.hospitalRequired} name="hospitalRequired" className="input">
							<option>Select Answer</option>
							<option>Yes</option>
							<option>No</option>
						</select>

						<label>Physician Required? </label>
						<select value={report.physicianRequired} name="physicianRequired" required className="input">
							<option>Select Answer</option>
							<option>Yes</option>
							<option>No</option>
						</select>

						<label>Facility Name:</label>
						<input value={report.facilityName} name="facilityName" className="input" />

						<label>Law Enforcement Required?</label>
						<select value={report.enforcementRequired} name="enforcementRequired" className="input">
							<option>Select Answer</option>
							<option>Yes</option>
							<option>No</option>
						</select>

						<label>Date and Time of Contact:</label>
						<input value={report.enforcementTime} name="enforcementTime" type="datetime-local" className="input" />

						<label>Law Enforcement Agency Name:</label>
						<input value={report.enforcementName} name="enforcementName" className="input" />

						<label>Report Number:</label>
						<input value={report.reportId} name="reportId" className="input" />

						<label>Other Notes:</label>
						<textarea value={report.otherNotes} name="otherNotes" className="input resize-none" />

						<div className="col-span-4 flex items-center justify-center p-2">
							<button type="submit" className="buttons mt-3 w-[150px] mx-auto">Submit Form</button>
						</div>

					</form>
				</div>
			)}
		</div>
	)
}

export default incidents
