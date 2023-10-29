import "../../styles/appointments.css"
import AppointmentList from "../components/appointment-list"
import { Link } from "react-router-dom"

function Appointments() {
    const testData = [
        {
            doctorName: "test doctor",
            hospitalName: "test hospital",
            startTime: "10:30",
            endTime: "11:00",
            date: "10/03"
        },
        {
            doctorName: "longer doctor name example",
            hospitalName: "longer hospital name example",
            startTime: "10:30",
            endTime: "11:00",
            date: "10/21"
        },
        {
            doctorName: "test doctor",
            hospitalName: "test hospital",
            startTime: "10:30",
            endTime: "11:00",
            date: "10/03"
        },
        {
            doctorName: "test doctor",
            hospitalName: "test hospital",
            startTime: "10:30",
            endTime: "11:00",
            date: "10/03"
        },
        {
            doctorName: "test doctor",
            hospitalName: "test hospital",
            startTime: "10:30",
            endTime: "11:00",
            date: "10/03"
        },
    ]
    return (
        <div className="appointments-main">
            <h1 className="appointments-title">Appointment Manager</h1>
            <Link to={'/schedule'} className="schedule-link">Schedule a new appointment</Link>
            <AppointmentList appointments={testData}/>
        </div>
    )
}

export default Appointments