import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import ItemsList from "../components/item-list"
import client from "../client"

import "../../styles/portal.css"
import PopupSelector from "../components/popup-selector"

type appointment = {
    date: string,
    doctor_id: number,
    doctor_name: string,
    hospital_name: string,
    end_time: string,
    start_time: string,
    patient_concerns: string,
    patient_id: number,
    patient_review: string | null,
    patient_satisfaction: string | null
}

type portalData = {
    name: string,
    appointments: Array<appointment>
}

type hospitalData = {
    address: string,
    close_time: string,
    doctors: {
        available: boolean,
        id: number,
        name: string,
        specialization: string,
    }[],
    id: number,
    name: string,
    open_time: string,
    phone: number
}[]

function AppointmentsList(props: {appointments: Array<appointment>}) {
    const appointmentData = props.appointments.map(value => ([
        value.doctor_name,
        value.date,
        `${value.start_time} - ${value.end_time}`
    ]))

    return (
        <div className="appointment-list">
            {props.appointments.length > 0 ? 
            <ItemsList
            features={["Hospital", "Doctor", "Date", "Time"]}
            dataItems={appointmentData}/> : <h1 className="no-appointments">Appointments you make will appear here</h1>}
        </div>
    )
}
function AppointmentScheduler() {
    const [hospitals, setHospitals] = useState<hospitalData>()
    const [hospitalChoice, setHospitalChoice] = useState<number>()
    const [loading, setLoading] = useState<boolean>(true)

    const formatTime = (time: string): string => {
        const split_str = time.split(":")
        let hours = split_str[0]
        let minutes = split_str[1]
        let suffix = "AM"

        hours = hours.replace("0", "")
        if (Number(hours) > 12) {
            hours = String(Number(hours) - 12)
            suffix = "PM"
        }

        return `${hours}:${minutes} ${suffix}`
    }

    useEffect(() => {
        client.get('/hospitals', {withCredentials: true}).then(response => {
            setHospitals(response.data)
            setLoading(false)
        })
    }, [])
    
    const hospitalItems = hospitals?.map((hos, _) => (
        {
            "name": hos.name,
            "id": hos.id,
            "features": {
                "Address": hos.address,
                "Hours": `${formatTime(hos.open_time)} - ${formatTime(hos.close_time)}`,
                "Phone": hos.phone
            }
        }
    ))

    if (loading) return null
    return (
        <div className="appointment-scheduler">
            <PopupSelector
            title="Select a hospital"
            selected={hospitalChoice}
            items={hospitalItems}
            setSelected={setHospitalChoice}/>
        </div>
    )
}

function PatientPortal() {
    const navigate = useNavigate()
    const [portal, setPortal] = useState<portalData>({
        name: "",
        appointments: []
    })
    const [loading, setLoading] = useState<boolean>(true)
    const getPatientDetails = () => {
        client.get("/portal", {withCredentials: true}).then(response => {
            setPortal(response.data)
            setLoading(false)
        }).catch(_ => navigate("/login"))
    }

    // get dashboard details whenever loaded
    useEffect(() => {
        getPatientDetails()
    }, [])

    const [displayAppts, setDisplayAppts] = useState<boolean>(true)

    if (loading) return null
    return (
        <div className="patient-portal">
            <div className="portal-header">
                <h1>Patient Portal</h1>
                <h3>Welcome back, <span className="patient-name">{portal?.name}</span></h3>
                <span className="spacer"></span>
            </div>
            <div className="appointment-manager">
                <div className="appointment-header">
                    <h1>Appointment Manager</h1>
                    <div className="appointment-buttons">
                        <button
                        onClick={() => setDisplayAppts(true)}
                        className={displayAppts ? "appointments-button-active" : "appointments-button"}>View appointments</button>
                        <button
                        onClick={() => setDisplayAppts(false)}
                        className={!displayAppts ? "appointments-button-active" : "appointments-button"}>Schedule new appointment</button>
                    </div>
                </div>
                {displayAppts ?
                <AppointmentsList appointments={portal.appointments}/> :
                <AppointmentScheduler/>}
            </div>
        </div>
    )
}

export default PatientPortal