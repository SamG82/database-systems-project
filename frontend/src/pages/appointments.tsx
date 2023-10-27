import "../../styles/appointments.css"
import AppointmentListing from "../components/appointment"
import { Link } from "react-router-dom"

const testData = [
    {
        doctorName: "John",
        startTime: "10:00",
        endTime: "10:30",
        hospitalName: "Test Hospital",
        date: "10/02",
        notes: "test notes for appointment testing data",
    },
    {
        doctorName: "John",
        startTime: "10:00",
        endTime: "10:30",
        hospitalName: "Test Hospital",
        date: "10/02",
        notes: "test notes for appointment testing data",
    },
    {
        doctorName: "John",
        startTime: "10:00",
        endTime: "10:30",
        hospitalName: "Test Hospital",
        date: "10/02",
        notes: "test notes for appointment testing data"
    }
]

function Appointments() {
    return (
        <div className="appointments-main">
            <h1 className="appointments-title">Appointment Manager</h1>
            <Link to={'/schedule'}>Schedule a new appointment</Link>
            <div className="appointments-list">
                <span className="column-title">Hospital</span>
                <span className="column-title">Doctor</span>
                <span className="column-title">Time</span>
                <span className="column-title">Date</span>
                {/* placeholder */}
                <span></span>
                {testData.map((appt, idx) => <AppointmentListing key={idx} appt={appt}/>)}
            </div>
        </div>
    )
}

export default Appointments