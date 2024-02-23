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
		witnesses: "",
		description: "",
		injuriesOrLosses: "",
		hospitalRequired: "",
		physicianRequired: "",
		facilityName: "",
		involved: [],
		enforcementRequied: "",
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
			.post("/api/email/incident", report, {
				headers: { "Content-Type": "application/json" },
			})
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
		<div className="flex flex-col items-center bg-[#242526] h-[1200px] lg:h-screen pt-[85px] pb-2">
			{isLoading ? (
				<div className="h-screen bg-[#242526] flex flex-col items-center justify-center">
					<PuffLoader color="#ffffff" loading={isLoading} size={120} />
					<p className="mt-4">{statusMessage}</p>
				</div>
			) : (
				<div>
					<p className="text-xl font-bold">Incident Report Form</p>
					<form>

						<label>Type of Incident:</label>
						<select name="type" required className="input">
							<option>Select Type</option>
							<option>Injury</option>
							<option>Property Damage</option>
							<option>Illness</option>
							<option>Accident</option>
							<option>Theft</option>
						</select>

						<label>Date of Incident:</label>
						<input type="date" />

						<label>Time of Incident:</label> 
						<input type="time" />

						<label>Location of Incident:</label>
						<input placeholder="" />

						<label>Involved Individual</label>
						<input />

						<label>Employee or Visitor?</label>
						<select required>
							<option>Employee</option>
							<option>Rental</option>
						</select>

						<label>Role:</label>
						<input placeholder="Ex: Foreman, Laborer" />

						<label>Supervisor:</label>
						<input />

						{/* USE TYPE -> BUTTON -> PUSH TO ARRAY  */}
						{/* MORE INVOLVED PEOPLE */}
						{/* WITNESSES */}

						<label>Description of Incident:</label>
						<textarea />

						<label>Injuries/Losses:</label>
						<textarea />

						<label>Hospitalization Required? </label>
						<select>
							<option>Yes</option>
							<option>No</option>
						</select>

						<label>Physician Required? </label>
						<select>
							<option>Yes</option>
							<option>No</option>
						</select>

						<label>Facility Name:</label>
						<input />

						<label>Law Enforcement Required?</label>
						<select>
							<option>Yes</option>
							<option>No</option>
						</select>

						<label>Date and Time of Contact:</label>
						<input type="datetime-local" />

						<label>Law Enforcement Agency Name:</label>
						<input />

						<label>Report Number:</label>
						<input />

						<label>Other Notes:</label>
						<textarea />


					</form>
				</div>
			)}
		</div>
	)
}

export default incidents
