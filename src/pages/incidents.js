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
	const [tempName, setTempName] = useState('')
	const [involved, setInvolved] = useState([])
	const [witnesses, setWitnesses] = useState([])
	const [tempWitness, setTempWitness] = useState('')

	const initialReport = {
		name: "",
		type: "",
		date: "",
		time: "",
		location: "",
		submittedBy: auth && auth.name,
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

	const initialTempInvolved = {
		name: '',
		employeeOrVisitor: '',
		role: '',
		supervisor: ''
	}

	const [report, setReport] = useState(initialReport)
	const [tempInvolved, setTempInvolved] = useState(initialTempInvolved)

	const handleChange = (e) => {
		const { name, value } = e.target

		setReport({
			...report,
			[name]: value,
		})	
		console.log(report)
		console.log(involved)
	}

	const handleTempChange = (e) => {
		const { name, value } = e.target;

		setTempInvolved({
			...tempInvolved,
			[name]: value
		})
	}

	const addToList = (e, list, setList, value) => {
		e.preventDefault();

		setList(prevArray => [...prevArray, value])
		setTempWitness('')
	}

	useEffect(() => {
		setReport({ ...report, ['involved']: [...involved, tempInvolved] })
		setReport({ ...report, ['witnesses']: witnesses.join(', ') })
	}, [involved, witnesses])

	const handleSubmit = e => {
		e.preventDefault()

		console.log(report)
		// setIsLoading(true)
		// setStatusMessage("Submitting Report, Please Wait...")

		// axios
		// 	.post("/api/email/incident", report, { headers: { "Content-Type": "application/json" }})
		// 	.then(res => {
		// 		setStatusMessage("✓ Report Submitted Successfully ✓")
		// 		// setReport(initialReport)
		// 		setTimeout(() => {
		// 			setIsLoading(false)
		// 		}, "2000")
		// 	})
		// 	.catch(err => {
		// 		console.log(err)
		// 		setIsLoading(false)
		// 	})
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
					<form className="w-screen border rounded xl:w-[900px] flex items-start pl-5 justify-center flex-col gap-2" onSubmit={handleSubmit}>

						<label>Type of Incident:</label>
						<select value={report.type} name="type" required className="input" onChange={handleChange}>
							<option>Select Type</option>
							<option>Injury</option>
							<option>Property Damage</option>
							<option>Illness</option>
							<option>Accident</option>
							<option>Theft</option>
						</select>

						<label>Date of Incident:</label>
						<input value={report.date} name="date" type="date" className="input" onChange={handleChange}/>

						<label>Time of Incident:</label> 
						<input value={report.time} name="time" type="time" className="input" onChange={handleChange}/>

						<label>Location of Incident:</label>
						<input value={report.location} name="location" placeholder="" className="input" onChange={handleChange}/>


						{/* MAKE THIS EDITABLE */}
						<label>Involved Individual</label>
						<select id="name" value={report.name} name="name" className='input' onChange={(e) => {
							handleChange(e)
							if(e.target.value === 'Other') {
								setTempName('Other')
							}
							
							}}>
							<option>Choose Employee/Other</option>
							<option>Other</option>
							{ users && users.map((user) => {
								return (
									<option key={user._id}>{user.name}</option>
								)
							}) }
						</select>
						<input value={report.name} placeholder="Specify" name="name" className={tempName === 'Other' ? 'input' : 'hidden'} onChange={handleChange}/>

						<label>Employee or Visitor?</label>
						<select value={report.employeeType} name="employeeType" required className="input" onChange={handleChange}>
							<option>Select Answer</option>
							<option>Employee</option>
							<option>Rental</option>
						</select>

						<label>Role:</label>
						<input value={report.role} name="role" placeholder="Ex: Foreman, Laborer" className="input" onChange={handleChange}/>

						<label>Supervisor:</label>
						<input value={report.supervisor} name="supervisor" className="input" onChange={handleChange}/>

						{/* USE TYPE -> BUTTON -> PUSH TO ARRAY  */}
						{/* MORE INVOLVED PEOPLE */}
						<label>More Involved Individuals</label>
						<div className="grid grid-cols-2 gap-2 items-center mt-4 mb-4">
							<label>Name:</label>
							<input name="name" value={tempInvolved.name} className="input" onChange={handleTempChange}/>
							<label>Employee or Visitor?</label>
							<select name="employeeOrVisitor" value={tempInvolved.employeeOrVisitor} className="input" onChange={handleTempChange}>
								<option>Select One</option>
								<option>Employee</option>
								<option>Visitor</option>
							</select>
							<label>Role:</label>
							<select name="role" value={tempInvolved.role} className="input" onChange={handleTempChange}>
								<option>Select One</option>
								<option>Laborer</option>
								<option>Foreman</option>
								<option>Rental Labor</option>
							</select>
							<label>Supervisor:</label>
							<input name="supervisor" value={tempInvolved.supervisor} className="input" onChange={handleTempChange}/>
							<button className="buttons w-[150px]" onClick={(e) => {
								e.preventDefault();
								setInvolved(prevInvolved => [...prevInvolved, tempInvolved])
								setReport({ ...report, ['involved']: [...involved, tempInvolved] })
								setTempInvolved(initialTempInvolved)
							}}>Add</button>
						</div>
						{ involved && involved.length > 0 ? (
							<div>
								{ involved && involved.map((individual, index) => {
									return (
										<p key={index}>{`${individual.name} | ${individual.employeeOrVisitor} | ${individual.role} | Supervisor: ${individual.supervisor}`}</p>
									)
								}) }
							</div>
						) : (
							<></>
						)}
						{/* WITNESSES */}
						<label>Witnesses:</label>
						<input className="input" required value={tempWitness} placeholder="Name" onChange={(e) => setTempWitness(e.target.value)}/>
						<button onClick={(e) => {
							if(tempWitness !== '') addToList(e, witnesses, setWitnesses, tempWitness)
							}} className="buttons w-[150px]">Add Witness</button>
						<ol className="list-decimal">
							{ witnesses && witnesses.map((witness, index) => {
								return (
									<li key={index}>{witness}</li>
								)
							}) }
						</ol>

						<label>Description of Incident:</label>
						<textarea value={report.description} name="description" className="input h-[150px] resize-none" onChange={handleChange}/>

						<label>Injuries/Losses:</label>
						<textarea value={report.injuriesOrLosses} name="injuriesOrLosses" className="input h-[150px] resize-none" onChange={handleChange}/>

						<label>Hospitalization Required? </label>
						<select value={report.hospitalRequired} name="hospitalRequired" className="input" onChange={handleChange}>
							<option>Select Answer</option>
							<option>Yes</option>
							<option>No</option>
						</select>

						<label>Physician Required? </label>
						<select value={report.physicianRequired} name="physicianRequired" required className="input" onChange={handleChange}>
							<option>Select Answer</option>
							<option>Yes</option>
							<option>No</option>
						</select>

						<label>Facility Name:</label>
						<input value={report.facilityName} name="facilityName" className="input" onChange={handleChange}/>

						<label>Law Enforcement Required?</label>
						<select value={report.enforcementRequired} name="enforcementRequired" className="input" onChange={handleChange}>
							<option>Select Answer</option>
							<option>Yes</option>
							<option>No</option>
						</select>

						<label>Date and Time of Contact:</label>
						<input value={report.enforcementTime} name="enforcementTime" type="datetime-local" className="input"  onChange={handleChange}/>

						<label>Law Enforcement Agency Name:</label>
						<input value={report.enforcementName} name="enforcementName" className="input"  onChange={handleChange}/>

						<label>Report Number:</label>
						<input value={report.reportId} name="reportId" className="input"  onChange={handleChange}/>

						<label>Other Notes:</label>
						<textarea value={report.otherNotes} name="otherNotes" className="input resize-none"  onChange={handleChange}/>

							<button type="submit" className="buttons mt-3 mb-3 w-[150px] mx-auto">Submit Form</button>

					</form>
				</div>
			)}
		</div>
	)
}

export default incidents
