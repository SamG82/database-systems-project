import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import ItemsList from "../components/item-list"
import client from "../client"

import "../../styles/portal.css"

type portalData = {
    name: string,
    appointments: {
        date: string,
        doctor_id: number,
        doctor_name: string,
        hospital_name: string,
        end_time: string,
        start_time: string,
        patient_concerns: string,
        patient_id: number,
        patient_review: string | null,
        patient_satisfaction: string | null,
    }[]
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
    const appointmentData = portal?.appointments.map(value => ([
        value.doctor_name,
        value.date,
        `${value.start_time} - ${value.end_time}`
    ]))
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
                    <div className="search">
                        <h1>test</h1>
                    </div>
                    <button className="schedule-button">Schedule new appointment</button>
                </div>
                <div className="appointment-list">
                    {portal.appointments.length > 0 ? 
                    <ItemsList
                    features={["Hospital", "Doctor", "Date", "Time"]}
                    dataItems={appointmentData}/> : <h1 className="no-appointments">Appointments you make will appear here</h1>}
                   
                </div>
            </div>
        </div>
    )
}

export default PatientPortal