import "../../styles/appointments.css"
import { Appointment, AppointmentRow } from "./appointment-row"

type Props = {
    appointments: Array<Appointment>
}

function AppointmentList({appointments}: Props) {
    return (
        <div className="appointments-list">
            <span className="column-title">Hospital</span>
            <span className="column-title">Doctor</span>
            <span className="column-title">Time</span>
            <span className="column-title">Date</span>
            {/* placeholder */}
            <span></span>
            {appointments.map((appt, idx) => <AppointmentRow key={idx} appt={appt}/>)}
        </div>
    )
}

export default AppointmentList